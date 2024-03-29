package ffmpeg

import (
	"context"
	"os/exec"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type FFmpeg struct {
	ctx    *context.Context
	Params []string
}

func NewFFmpeg(ctx *context.Context) *FFmpeg {
	ffmpeg := FFmpeg{ctx: ctx}
	ffmpeg.SetParams(strings.Join(ffmpeg.DefaultParams(), " "))
	return &ffmpeg
}

func (f *FFmpeg) SetParams(params string) {
	paramsArray := strings.Split(params, " ")
	paramsFiltersArray := []string{}
	for _, param := range paramsArray {
		param = strings.TrimSpace(param)
		if param != "" {
			paramsFiltersArray = append(paramsFiltersArray, param)
		}
	}
	f.Params = paramsFiltersArray
}

func (f *FFmpeg) GetParams() []string {
	return f.Params
}

func (f *FFmpeg) DefaultParams() []string {
	return []string{"-c:v", "libx264", "-crf", "14"}
}

func (f *FFmpeg) GetVideoInfo(vidfile string) ([]string, error) {
	runtime.LogDebug(*f.ctx, "Getting dimensions for: "+vidfile)
	out, err := exec.Command("ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
		"stream=width,height,duration", "-of",
		"default=nw=1:nk=1", vidfile).Output()
	data := strings.Split(string(out), "\n")
	runtime.LogDebug(*f.ctx, "Data: "+strings.Join(data, ","))
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (f *FFmpeg) CreateClip(inputFile string, outputFile string, start string, end string) error {
	params := f.GetParams()
	cmd_without_params := []string{"-y", "-i", inputFile, "-ss", start, "-to", end, outputFile}

	runtime.LogDebug(*f.ctx, "ffmpeg "+strings.Join(cmd_without_params, " "))
	cmd := make([]string, 0, len(cmd_without_params)+len(params))
	cmd = append(cmd, cmd_without_params[:len(cmd_without_params)-1]...)
	cmd = append(cmd, params...)
	cmd = append(cmd, cmd_without_params[len(cmd_without_params)-1:]...)
	runtime.LogDebug(*f.ctx, "Running ffmpeg "+strings.Join(cmd, " "))
	go func() {
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", true)
		out, err := exec.Command("ffmpeg", cmd...).Output()
		if err != nil {
			runtime.LogError(*f.ctx, "Error running ffmpeg: "+string(out))
			runtime.EventsEmit(*f.ctx, "ffmpeg-error", strings.Join(cmd, " "))
		}
		runtime.LogDebug(*f.ctx, "ffmpeg completed")
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", false)
	}()
	return nil
}
