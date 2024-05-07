package internal

type CropDimensions struct {
	width  string
	height string
	x      string
	y      string
}

func NewCropDimensions(width, height, x, y string) CropDimensions {
	return CropDimensions{
		width:  width,
		height: height,
		x:      x,
		y:      y,
	}
}

func (c *CropDimensions) String() string {
	return c.width + ":" + c.height + ":" + c.x + ":" + c.y
}

func (c *CropDimensions) FilterString() string {
	return "crop=" + c.String()
}
