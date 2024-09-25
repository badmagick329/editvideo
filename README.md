# FFmpeg GUI Wrapper - Clip and Crop Tool

This is a lightweight desktop application built in Go, providing a simple and user-friendly graphical interface for clipping and cropping video clips using FFmpeg.

## Features

- **Clip Videos**: Select start and end times to extract specific portions of a video.
- **Crop Videos**: Easily define the crop area by setting coordinates and dimensions.
- **Cross-Platform**: Works on Windows, macOS, and Linux.

## Screenshot

Clip and crop videos using either your own or the default ffmpeg parameters.

![Crop Videos](https://github.com/user-attachments/assets/1c875c6d-583d-46c5-8732-ff505ab5a917)


## Installation

### Prerequisites

- [FFmpeg](https://ffmpeg.org/) must be installed and accessible from your system’s PATH.
- [Wails](https://wails.io/docs/gettingstarted/installation) will be required for building this project.

### Build

Build the app with `wails build --clean`. Alternatively you can target specific operating systems with one of the scripts in the scripts folder.
