package ffmpeg

import (
	"context"
	"fmt"
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
	return []string{
		"-c:v",
		"libx264",
		"-crf",
		"17",
		"-preset",
		"ultrafast",
	}
}

func (f *FFmpeg) GetVideoInfo(vidfile string) (VideoInfo, error) {
	info, err := ProbeFile(vidfile)
	if err != nil {
		return VideoInfo{}, fmt.Errorf("Error probing file: %s", err)
	}
	return info, nil
}

func (f *FFmpeg) CreateClip(inputFile string, outputFile string, start string, end string) error {
	params := f.GetParams()
	withoutParams := []string{"-y", "-i", inputFile, "-ss", start, "-to", end, outputFile}

	runtime.LogDebug(*f.ctx, "ffmpeg "+strings.Join(withoutParams, " "))
	runCmd := make([]string, 0, len(withoutParams)+len(params))
	runCmd = append(runCmd, withoutParams[:len(withoutParams)-1]...)
	runCmd = append(runCmd, params...)
	runCmd = append(runCmd, withoutParams[len(withoutParams)-1:]...)
	runtime.LogDebug(*f.ctx, "Running ffmpeg "+strings.Join(runCmd, " "))
	go func() {
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", true)
		cmd := exec.Command("ffmpeg", runCmd...)
		out, err := cmd.CombinedOutput()
		if err != nil {
			runtime.LogError(*f.ctx, "Error running ffmpeg: "+string(out))
			runtime.EventsEmit(*f.ctx, "ffmpeg-error", strings.Join(runCmd, " "))
		}
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", false)
	}()
	return nil
}
