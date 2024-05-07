package internal

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type ParsedTimeInSeconds struct {
	originalValue string
}

func newParsedTimeInSeconds(originalValue string) ParsedTimeInSeconds {
	return ParsedTimeInSeconds{
		originalValue: strings.TrimSpace(originalValue),
	}
}

func (pt *ParsedTimeInSeconds) Value() (float64, error) {
	colonCount := strings.Count(pt.originalValue, ":")
	switch colonCount {
	case 0:
		return pt.tryParseSeconds()
	case 1:
		return pt.tryParseMMSS()
	case 2:
		return pt.tryParseHHMMSS()
	default:
		return 0, errors.New(fmt.Sprintf("invalid time format: %s", pt.originalValue))
	}
}

func (pt *ParsedTimeInSeconds) tryParseSeconds() (float64, error) {
	seconds, err := strconv.ParseFloat(pt.originalValue, 64)
	if err != nil {
		return 0, errors.New(fmt.Sprintf("invalid time format: %s", pt.originalValue))
	}
	return seconds, nil
}

func (pt *ParsedTimeInSeconds) tryParseMMSS() (float64, error) {
	reMMSSTime := regexp.MustCompile(`^[012345]?\d\:[012345]\d(?:\.\d+)?$`)
	if !reMMSSTime.MatchString(pt.originalValue) {
		return 0, errors.New(fmt.Sprintf("invalid time format: %s", pt.originalValue))
	}
	minutesAndSeconds := strings.Split(pt.originalValue, ":")
	minutes, err := strconv.ParseFloat(minutesAndSeconds[0], 64)
	if err != nil {
		return 0, err
	}
	seconds, err := strconv.ParseFloat(minutesAndSeconds[1], 64)
	if err != nil {
		return 0, err
	}
	return minutes*60 + seconds, nil
}

func (pt *ParsedTimeInSeconds) tryParseHHMMSS() (float64, error) {
	reHHMMSSTime := regexp.MustCompile(`^\d{1,2}\:[012345]\d\:[012345]\d(?:\.\d+)?$`)
	if !reHHMMSSTime.MatchString(pt.originalValue) {
		return 0, errors.New(fmt.Sprintf("invalid time format: %s", pt.originalValue))
	}
	hoursMinutesAndSeconds := strings.Split(pt.originalValue, ":")
	hours, err := strconv.ParseFloat(hoursMinutesAndSeconds[0], 64)
	if err != nil {
		return 0, err
	}
	minutes, err := strconv.ParseFloat(hoursMinutesAndSeconds[1], 64)
	if err != nil {
		return 0, err
	}
	seconds, err := strconv.ParseFloat(hoursMinutesAndSeconds[2], 64)
	if err != nil {
		return 0, err
	}
	return hours*3600 + minutes*60 + seconds, nil
}

func ParseTime(time string, defaultValue string) string {
	parsedTime := newParsedTimeInSeconds(time)
	value, err := parsedTime.Value()
	if err != nil {
		return defaultValue
	}
	return fmt.Sprintf("%f", value)
}
