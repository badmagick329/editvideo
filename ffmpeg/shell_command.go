package ffmpeg

import (
	"fmt"
	"strings"

	"edit-video/internal"
)

type ShellCommand struct {
	program string
	cmd     []string
}

func NewShellCommand(program string) ShellCommand {
	return ShellCommand{program: program}
}

func (s *ShellCommand) createClipCommand(
	inputFile, outputFile, start, end, ffmpegParams string,
) {
	params := strings.Split(ffmpegParams, " ")
	withoutParams := []string{"-y", "-i", inputFile, "-ss", start, "-to", end, outputFile}

	runCmd := make([]string, 0, len(withoutParams)+len(params))
	runCmd = append(runCmd, withoutParams[:len(withoutParams)-1]...)
	runCmd = append(runCmd, params...)
	runCmd = append(runCmd, withoutParams[len(withoutParams)-1:]...)
	s.cmd = runCmd
}

func (s *ShellCommand) previewCropCommand(
	w, h, x, y, cropClipStart, cropClipEnd, totalDuration, videoFile string,
) error {
	cropDimensions := internal.NewCropDimensions(w, h, x, y)
	cropDuration := internal.NewCropDuration(cropClipStart, cropClipEnd, totalDuration)
	clipDuration, err := cropDuration.Duration()
	if err != nil {
		return fmt.Errorf("Error parsing clip duration: %s", err)
	}

	s.cmd = []string{
		"-loop",
		"0",
		"-ss",
		cropDuration.ClipStart(),
		"-t",
		fmt.Sprintf("%f", clipDuration),
		"-vf",
		cropDimensions.FilterString(),
		"-an",
		videoFile,
	}
	return nil
}

func (s *ShellCommand) createCropCommand(
	inputFile, outputFile, w, h, x, y, cropClipStart, cropClipEnd, ffmpegParams string,
) {
	params := strings.Split(ffmpegParams, " ")
	cropClipStart = strings.TrimSpace(cropClipStart)
	cropClipEnd = strings.TrimSpace(cropClipEnd)
	baseParams := []string{
		"-y",
		"-i",
		inputFile,
		"-ss",
		cropClipStart,
		"-to",
		cropClipEnd,
		"-vf",
		"crop=" + w + ":" + h + ":" + x + ":" + y,
		outputFile,
	}
	filteredBaseParams := make([]string, 0, len(baseParams))
	for i := 0; i < 3; i++ {
		filteredBaseParams = append(filteredBaseParams, baseParams[i])
	}
	if cropClipStart != "" {
		filteredBaseParams = append(filteredBaseParams, baseParams[3])
		filteredBaseParams = append(filteredBaseParams, baseParams[4])
	}
	if cropClipEnd != "" {
		filteredBaseParams = append(filteredBaseParams, baseParams[5])
		filteredBaseParams = append(filteredBaseParams, baseParams[6])
	}
	for i := 7; i < len(baseParams); i++ {
		filteredBaseParams = append(filteredBaseParams, baseParams[i])
	}

	runCmd := make([]string, 0, len(filteredBaseParams)+len(params))
	runCmd = append(runCmd, filteredBaseParams[:len(filteredBaseParams)-3]...)
	runCmd = append(runCmd, params...)
	runCmd = append(runCmd, filteredBaseParams[len(filteredBaseParams)-3:]...)
	s.cmd = runCmd
}

func (s *ShellCommand) Command() []string {
	cmd := make([]string, 0, len(s.cmd)+1)
	cmd = append(cmd, s.program)
	for _, c := range s.cmd {
		cmd = append(cmd, c)
	}
	return cmd
}

func (s *ShellCommand) String() string {
	cmd := s.Command()
	return strings.Join(cmd, " ")
}
