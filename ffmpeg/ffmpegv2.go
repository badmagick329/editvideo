package ffmpeg

import (
	"fmt"

	"github.com/tidwall/gjson"
	ffmpeggo "github.com/u2takey/ffmpeg-go"
)

type VideoInfo struct {
	Width    int64
	Height   int64
	Duration float64
}

func ExampleChangeCodec() {
	ffmpeggo.Input("./sample_data/in1.mp4").
		Output("./sample_data/out1.mp4", ffmpeggo.KwArgs{"c:v": "libx265"}).
		OverWriteOutput().ErrorToStdOut().Run()
}

func ProbeFile(file string) (VideoInfo, error) {
	a, err := ffmpeggo.Probe(file)
	if err != nil {
		return VideoInfo{}, err
	}
	fmt.Println(a)
	totalDuration := gjson.Get(a, "format.duration").Float()
	width := gjson.Get(a, "streams.0.width").Int()
	height := gjson.Get(a, "streams.0.height").Int()
	return VideoInfo{
		Width:    width,
		Height:   height,
		Duration: totalDuration,
	}, nil
}
