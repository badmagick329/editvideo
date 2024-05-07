package internal

import (
	"testing"
)

func TestSecondParser(t *testing.T) {
	type test struct {
		input string
		want  float64
	}
	tests := []test{
		{"1", 1.0},
		{"1.", 1.0},
		{"1.0", 1.0},
		{"1.1", 1.1},
		{"1.01", 1.01},
		{"1.123", 1.123},
	}

	for _, tc := range tests {
		parsedTime := newParsedTimeInSeconds(tc.input)
		got, err := parsedTime.Value()
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if tc.want != got {
			t.Fatalf("want %f, got %f", tc.want, got)
		}
	}
}

func TestMinuteSecondParser(t *testing.T) {
	type test struct {
		input string
		want  float64
	}
	tests := []test{
		{"1:30", 90.0},
		{"1:01", 61.0},
		{"1:30.123", 90.123},
		{"1:40.0", 100.0},
		{"20:59.59", 1259.59},
	}

	for _, tc := range tests {
		parsedTime := newParsedTimeInSeconds(tc.input)
		got, err := parsedTime.Value()
		if err != nil {
			t.Fatalf("unexpected error: %v. want %f. got %f", err, tc.want, got)
		}
		if tc.want != got {
			t.Fatalf("want %f, got %f", tc.want, got)
		}
	}
}

func TestHourMinuteSecondParser(t *testing.T) {
	type test struct {
		input string
		want  float64
	}
	tests := []test{
		{"1:00:00", 3600.0},
		{"1:30:00", 5400.0},
		{"00:00:00.500", 0.5},
		{"03:30:50.764", 12650.764},
	}

	for _, tc := range tests {
		parsedTime := newParsedTimeInSeconds(tc.input)
		got, err := parsedTime.Value()
		if err != nil {
			t.Fatalf("unexpected error: %v. want %f. got %f", err, tc.want, got)
		}
		if tc.want != got {
			t.Fatalf("want %f, got %f", tc.want, got)
		}
	}
}
