package main

import (
	"context"
	"os"
	"path/filepath"
	"slices"
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

func (a *App) FileExists(path string) bool {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	validVideoExtensions := []string{
		".mp4",
		".webm",
		".mkv",
		".avi",
		".mov",
		".flv",
		".wmv",
		".mpg",
		".mpeg",
		".m4v",
		".3gp",
		".3g2",
		".ts",
		".mts",
		".m2ts",
		".vob",
	}
	ext := filepath.Ext(path)
	return slices.Contains(validVideoExtensions, ext)
}
