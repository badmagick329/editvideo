package internal

import (
	"fmt"
	"strconv"
)

func ParseTime(time string, defaultValue string) string {
	// TODO: Time parsing for other formats
	fl, err := strconv.ParseFloat(time, 64)
	if err != nil {
		return defaultValue
	}
	return fmt.Sprintf("%f", fl)
}
