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

func (f *FFmpeg) CreateClip(inputFile, outputFile, start, end, ffmpegParams string) error {
	shellCmd := NewShellCommand("ffmpeg")
	shellCmd.createClipCommand(inputFile, outputFile, start, end, ffmpegParams)
	go runCommand(shellCmd, f.ctx)
	return nil
}

func (f *FFmpeg) PreviewCrop(
	w, h, x, y, cropClipStart, cropClipEnd, totalDuration, videoFile string,
) error {
	shellCmd := NewShellCommand("ffplay")
	err := shellCmd.previewCropCommand(
		w,
		h,
		x,
		y,
		cropClipStart,
		cropClipEnd,
		totalDuration,
		videoFile,
	)
	if err != nil {
		return fmt.Errorf("Error creating preview crop command: %s", err)
	}

	go runCommand(shellCmd, f.ctx)
	return nil
}

func (f *FFmpeg) CreateCrop(
	inputFile, outputFile, w, h, x, y, cropClipStart, cropClipEnd, ffmpegParams string,
) error {
	shellCmd := NewShellCommand("ffmpeg")
	shellCmd.createCropCommand(
		inputFile,
		outputFile,
		w,
		h,
		x,
		y,
		cropClipStart,
		cropClipEnd,
		ffmpegParams,
	)
	runCommand(shellCmd, f.ctx)
	return nil
}

func runCommand(shellCmd ShellCommand, ctx *context.Context) {
	runtime.EventsEmit(*ctx, "ffmpeg-running", true)
	fmt.Println(shellCmd.String())
	cmd := exec.Command(shellCmd.program, shellCmd.cmd...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		runtime.LogError(*ctx, "Error running "+shellCmd.program+": "+string(out))
		runtime.EventsEmit(
			*ctx,
			"ffmpeg-error",
			"Error running "+shellCmd.String(),
		)
	}
	runtime.EventsEmit(*ctx, "ffmpeg-running", false)
}
