package internal

import "strconv"

type CropDuration struct {
	start         string
	end           string
	totalDuration string
	startNum      float64
	endNum        float64
}

func NewCropDuration(start, end, totalDuration string) CropDuration {
	return CropDuration{
		start:         start,
		end:           end,
		totalDuration: totalDuration,
	}
}

func (c *CropDuration) ClipStart() string {
	return ParseTime(c.start, "0")
}

func (c *CropDuration) ClipEnd(clipDuration string) string {
	return ParseTime(c.end, clipDuration)
}

func (c *CropDuration) Duration() (float64, error) {
	clipDurationNum, err := strconv.ParseFloat(c.totalDuration, 64)
	if err != nil {
		return 0, err
	}
	clipStartNum, err := strconv.ParseFloat(c.ClipStart(), 64)
	if err != nil {
		clipStartNum = 0
	}
	clipEndNum, err := strconv.ParseFloat(c.ClipEnd(c.totalDuration), 64)
	if err != nil {
		clipEndNum = clipDurationNum
	}
	return clipEndNum - clipStartNum, nil
}
