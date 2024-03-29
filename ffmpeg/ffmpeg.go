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

func (f *FFmpeg) CreateClip(inputFile string, outputFile string, start string, end string) error {
	params := f.GetParams()
	cmd_without_params := []string{"-y", "-i", inputFile, "-ss", start, "-to", end, outputFile}
	runtime.LogDebug(*f.ctx, "ffmpeg "+strings.Join(cmd_without_params, " "))
	// list1 := []int{1, 2, 3}
	// list2 := []int{4, 5, 6}
	//
	// // Insert list2 into list1 at index 2
	// list3 := make([]int, 0, len(list1)+len(list2))
	// list3 = append(list3, list1[:2]...)
	// list3 = append(list3, list2...)
	// list3 = append(list3, list1[2:]...)
	//
	// fmt.Println(list3) // Output: [1 2 4 5 6 3]
	cmd := make([]string, 0, len(cmd_without_params)+len(params))
	cmd = append(cmd, cmd_without_params[:7]...)
	cmd = append(cmd, params...)
	cmd = append(cmd, cmd_without_params[7:]...)
	runtime.LogDebug(*f.ctx, "Running ffmpeg "+strings.Join(cmd, " "))
	_, err := exec.Command("ffmpeg", cmd...).Output()
	if err != nil {
		runtime.LogError(*f.ctx, "Error running ffmpeg: "+err.Error())
		return err
	}
	runtime.LogDebug(*f.ctx, "ffmpeg completed")
	return nil
}
