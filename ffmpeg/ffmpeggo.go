package ffmpeg

import (
	"github.com/tidwall/gjson"
	ffmpeggo "github.com/u2takey/ffmpeg-go"
)

type VideoInfo struct {
	Width    int64
	Height   int64
	Duration float64
}

func ProbeFile(file string) (VideoInfo, error) {
	a, err := ffmpeggo.Probe(file)
	if err != nil {
		return VideoInfo{}, err
	}
	totalDuration := gjson.Get(a, "format.duration").Float()
	width := gjson.Get(a, "streams.0.width").Int()
	height := gjson.Get(a, "streams.0.height").Int()
	return VideoInfo{
		Width:    width,
		Height:   height,
		Duration: totalDuration,
	}, nil
}
