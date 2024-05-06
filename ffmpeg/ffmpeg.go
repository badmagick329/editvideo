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

func (f *FFmpeg) CreateClip(inputFile, outputFile, start, end string) error {
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
			runtime.EventsEmit(
				*f.ctx,
				"ffmpeg-error",
				"Error running ffmpeg "+strings.Join(runCmd, " "),
			)
		}
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", false)
	}()
	return nil
}

func (f *FFmpeg) PreviewCrop(w, h, x, y, videoFile string) error {
	cropString := "crop=" + w + ":" + h + ":" + x + ":" + y
	go func() {
		ffplayCmd := []string{"-loop", "0", "-vf", cropString, "-an", videoFile}
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", true)
		fmt.Println("ffplay " + strings.Join(ffplayCmd, " "))
		cmd := exec.Command("ffplay", ffplayCmd...)
		err := cmd.Run()
		if err != nil {
			fmt.Println("Error running ffplay " + err.Error())
			runtime.EventsEmit(
				*f.ctx,
				"ffmpeg-error",
				"Error running ffplay "+strings.Join(ffplayCmd, " "),
			)
		}
		fmt.Println("No error")
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", false)
	}()
	return nil
}

func (f *FFmpeg) CreateCrop(inputFile, outputFile, w, h, x, y string) error {
	params := f.GetParams()
	withoutParams := []string{
		"-y",
		"-i",
		inputFile,
		"-vf",
		"crop=" + w + ":" + h + ":" + x + ":" + y,
		outputFile,
	}

	runtime.LogDebug(*f.ctx, "ffmpeg "+strings.Join(withoutParams, " "))
	runCmd := make([]string, 0, len(withoutParams)+len(params))
	runCmd = append(runCmd, withoutParams[:len(withoutParams)-3]...)
	runCmd = append(runCmd, params...)
	runCmd = append(runCmd, withoutParams[len(withoutParams)-3:]...)
	runtime.LogDebug(*f.ctx, "Running ffmpeg "+strings.Join(runCmd, " "))
	go func() {
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", true)
		cmd := exec.Command("ffmpeg", runCmd...)
		out, err := cmd.CombinedOutput()
		if err != nil {
			runtime.LogError(*f.ctx, "Error running ffmpeg "+string(out))
			runtime.EventsEmit(
				*f.ctx,
				"ffmpeg-error",
				"Error running ffmpeg "+strings.Join(runCmd, " "),
			)
		}
		runtime.EventsEmit(*f.ctx, "ffmpeg-running", false)
	}()
	return nil
}
