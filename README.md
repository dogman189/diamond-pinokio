# DIAMOND — Pinokio Launcher

[DIAMOND](https://diamond-wm.github.io) (DIffusion As a Model Of eNvironment Dreams) is a diffusion world model trained on CS:GO and Atari. This is a [Pinokio](https://pinokio.computer) launcher for easy one-click install and play.

## Features

- **One-click install** — automatically sets up the Python environment and downloads pretrained models
- **Resolution selector** — launch CS:GO at 2x–5x display size (300×560 to 750×1400)
- **Quality settings** — toggle upsampler between Fast (1 denoising step) and High Quality (10 denoising steps)
- **Cross-platform** — works on Linux, macOS, and Windows via Pinokio

## Usage

### Install

Click **Install** in the launcher menu. This will:
1. Clone the DIAMOND repository
2. Create a Python virtual environment
3. Install dependencies including PyTorch

### Play CS:GO

1. Click **Quality Settings** to choose upsampler quality (Fast / High Quality)
2. Click a **Counter Strike** resolution button (2x–5x)
3. The game launches in fullscreen. Controls:
   - `WASD` / `mouse` — move and aim
   - `Space` — jump
   - `Ctrl` — crouch
   - `Click` — shoot
   - `m` — switch between human and AI control
   - `.` — pause/unpause
   - `Esc` — quit
   - `Enter` — reset

### Play Atari

Click **Start Atari** to launch the pretrained Atari world model. Select a game number from the list shown in the terminal.

### Reset

Click **Reset** to remove all installed dependencies and revert to a clean state.

## Resolution Reference

| Button | Display Size |
|---|---|
| Counter Strike 2x | 300 × 560 |
| Counter Strike 3x | 450 × 840 |
| Counter Strike 4x | 600 × 1120 |
| Counter Strike 5x | 750 × 1400 |

## Quality Settings

| Mode | Denoising Steps | Speed |
|---|---|---|
| Fast (default) | 1 step | Faster |
| High Quality | 10 steps | Slower, sharper images |

## Credits

- [DIAMOND](https://diamond-wm.github.io) — Eloi Alonso et al., NeurIPS 2024
- [Pinokio](https://pinokio.computer) — AI browser and launcher
