package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	// Perform your setup here
	a.ctx = ctx
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) FileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func (a *App) GetDimensions(vidfile string) (string, error) {
	runtime.LogDebug(a.ctx, "Getting dimensions for: "+vidfile)
	out, err := exec.Command("ffprobe", "-v", "error", "-show_entries",
		"stream=width,height,duration", "-of",
		"default=noprint_wrappers=1:nokey=1", vidfile).Output()
	data := strings.Split(string(out), "\n")
	dimensions := strings.Join(data[:2], "x")
	duration := strings.Replace(data[2], "\n", "", 1)
	output := "WidthxHeight: " + dimensions + " " + "Duration: " + duration + "s"
	if err != nil {
		return "", err
	}
	return output, nil
}
