# Upscaler Quality Selector

## Overview
Add a configurable upsampler quality setting to the DIAMOND Pinokio launcher. The user selects Fast or High Quality via a settings button in the menu, and the choice persists in `settings.json`. CS:GO launch buttons then pass `--quality` to `play.py`, which uses it to select the Hydra world_model_env config.

## Motivation
The DIAMOND CS:GO model has a trained diffusion upsampler (5× factor) with two configs:
- **fast** (default): 1 denoising step, Heun order 2 — faster, lower quality
- **higher_quality**: 10 denoising steps, Euler order 1 — slower, significantly better output

Previously the config was hardcoded in `trainer.yaml`. Now the user chooses at launch time.

## Architecture

```
User clicks "Quality Settings"
  → configure.js runs
  → input dropdown: "Fast" / "High Quality"
  → json.set writes to settings.json

User clicks "CS:GO 2x (300×560)"
  → start.js runs
  → json.get reads settings.json (if exists)
  → shell.run passes --quality <value> to play.py
  → play.py uses Hydra override: world_model_env=<quality>
  → game launches with chosen upsampler config
```

## Files Changed

### `app/src/play.py`
- Add `--quality` argument (type=str, default="fast", choices=["fast", "higher_quality"])
- Pass to `compose()` as `overrides=[f"world_model_env={args.quality}"]`

### `configure.js` (new)
- Pinokio script with `input` step (type: select, key: quality)
- Two options: "Fast (1 denoising step)" / "High Quality (10 denoising steps)"
- Writes choice to `settings.json` via `json.set`

### `start.js`
- Add conditional `json.get` step before `shell.run` (guarded by `exists('settings.json')`)
- Update shell command to include `--quality {{(local.settings || {}).quality || 'fast'}}`

### `pinokio.js`
- Add settings button in the menu that runs `configure.js`
- Icon: `fa-solid fa-gear`, text: "Quality Settings"

### `.gitignore`
- Add `settings.json`

## Config File Format
```json
{
  "quality": "fast"
}
```

Stored in launcher root (`/home/dogman/pinokio/api/diamond.git/settings.json`). Not committed to git.

## Defaults
- Unconfigured (no settings.json): `start.js` passes `--quality fast`
- Configured: uses value from settings.json
- configure.js always overwrites the entire quality key
