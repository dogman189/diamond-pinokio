# 2026-06-29 ESRGAN Enhancer — Design Spec

## Overview

Add an optional Real-ESRGAN post-processing pass to DIAMOND's CS:GO demo for
sharper, more detailed output — conceptually similar to NVIDIA DLSS. The GAN
both refines the diffusion-upsampled frame and upscales it 4× in one pass,
replacing the simple bicubic display resize.

---

## Menu Design

A third "Enhanced" tier in the Pinokio launcher, alongside the existing Fast and
High Quality tiers:

⚡ **Fast** — `quality=fast` (1 diffusion step), no GAN
👑 **High Quality** — `quality=higher_quality` (10 diffusion steps), no GAN
✨ **Enhanced** — `quality=higher_quality` (10 diffusion steps) + Real-ESRGAN

Each tier is a Pinokio nested menu with 4 resolution choices (2×–5×). In
Enhanced mode the display resolution is always 600×1120 (Real-ESRGAN's native 4×
output from 150×280), regardless of the selected multiplier.

### Pinokio arg flow

| Tier | `quality` | `enhance` |
|------|-----------|-----------|
| Fast | `fast` | `false` |
| High Quality | `higher_quality` | `false` |
| Enhanced | `higher_quality` | `true` |

---

## Pipeline

```
              ┌─ Fast / HQ ─────────────────────────┐
denoiser ──►  bicubic 5× ──► diffusion upsampler ──► bicubic ──► display
(30×56)         (150×280)      (150×280 refined)     resize      (e.g., 300×560)

              ┌─ Enhanced ────────────────────────────┐
denoiser ──►  bicubic 5× ──► diffusion upsampler ──► Real-ESRGAN 4× ──► display
(30×56)         (150×280)      (150×280 refined)      (600×1120)       (600×1120)
```

The GAN pass replaces the display-side bicubic resize — it both refines image
quality and upscales to the final display resolution.

---

## Code Changes

### New file: `app/src/enhancer.py`

Thin wrapper around `RealESRGANer` from the `realesrgan` package:

```python
class Enhancer(nn.Module):
    def __init__(self, device="cuda"):
        # Download RealESRGAN_x4plus.pth weights (~67 MB) on first use
        # Initialize RRDBNet model + RealESRGANer

    def forward(self, img_tensor):
        # Input:  (1, 3, H, W), float32, [-1, 1], on GPU
        # → numpy (H, W, 3), uint8, [0, 255]
        # → RealESRGANer.enhance() → 4× upscaled numpy
        # → tensor (1, 3, 4H, 4W), float32, [-1, 1], on GPU
        return enhanced_tensor
```

### Modified: `app/src/play.py`

1. New `--enhance` flag (`action="store_true"`).
2. When `--enhance` is set, display size becomes `(600, 1120)` regardless of
   `--size-multiplier`.
3. Pass an `Enhancer` instance through to `WorldModelEnv`.

### Modified: `app/src/world_model_env.py`

In `step()`, after the diffusion upsampler returns:

```python
if self.enhancer is not None and next_obs_full is not None:
    next_obs_full = self.enhancer(next_obs_full)
```

The enhanced tensor (now 600×1120) flows through the existing pipeline — no
changes to `game.py` or `play_env.py`.

### Modified: `pinokio.js`

Add the ✨ **Enhanced** nested menu (crown → sparkle icon), identical structure
to the existing Fast and High Quality dropdowns but with `enhance: true` in each
item's params.

### Modified: `start.js`

Append `--enhance` to the shell command when `args.enhance` is true:

```
--enhance  →  python src/play.py ... --quality higher_quality --enhance
no flag    →  python src/play.py ... (as before)
```

### Modified: `install.js`

Add one step after the `requirements.txt` install:

```javascript
{
  method: "shell.run",
  params: {
    venv: "env",
    path: "app",
    message: ["uv pip install realesrgan"]
  }
}
```

---

## Dependencies

| Dependency | Purpose | When acquired |
|-----------|---------|---------------|
| `realesrgan` pip package | RealESRGANer API + model auto-download | install step |
| `RealESRGAN_x4plus.pth` | RRDBNet weights (~67 MB) | first `--enhance` run |

The `realesrgan` package pulls in `basicsr` transitively — this is normal and
expected.

---

## Performance (RTX 4070)

| Operation | Input size | Expected latency |
|-----------|-----------|-----------------|
| Diffusion upsampler | 150×280 | ~20–40 ms (10 steps) |
| Real-ESRGAN 4× | 150×280 | ~5–15 ms |
| Total per frame (Enhanced) | — | ~30–55 ms → ~18–33 FPS |

Target frame rate of 15 FPS should be comfortably achievable.

---

## Edge Cases

- **First run with `--enhance`**: model weights auto-download (~67 MB). A brief
  stall on the first frame is expected.
- **Out of memory**: the Enhancer catches CUDA OOM and falls back to CPU.
- **No enhance flag**: zero overhead — no model loaded, no tensor conversion.
- **Recording**: enhanced frames are saved at 600×1120 (higher quality
  recordings).
- **Atari (main branch)**: no `--enhance` support (Atari branch has no diffusion
  upsampler to chain onto).

---

## Future Considerations

- Support for `realesr-general-x4v3` (lighter model, ~7 MB) as a "light"
  enhance mode.
- Per-frame tiling if larger display resolutions are desired.
