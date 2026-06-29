# Resolution Selector for DIAMOND Demo

## Summary
Add a dropdown in the Pinokio launcher to let users choose the display size multiplier before launching the demo, instead of using a hardcoded default of 2x.

## Design
- Resolution is set via menu-level launch options in `pinokio.js`, not a popup
- Each resolution gets its own "Start Counter Strike" button with `size_multiplier` in `params`
- `start.js` reads `args.size_multiplier` (defaults to `"2"`) to build the `--size-multiplier` flag
- Applies to both CS:GO (no `--pretrained`) and Atari (`--pretrained`) branches
- Atari keeps a single default button (2x) to keep the menu manageable

## Resolution Options (CS:GO)
| Menu Label | Multiplier | Display Size |
|---|---|---|
| Counter Strike 2x (300×560) | 2 | 300×560 |
| Counter Strike 3x (450×840) | 3 | 450×840 |
| Counter Strike 4x (600×1120) | 4 | 600×1120 |
| Counter Strike 5x (750×1400) | 5 | 750×1400 |

## Files Changed
- `start.js` — use `args.size_multiplier` in shell commands (no more popup)
- `pinokio.js` — resolution-specific CS:GO launch buttons with `size_multiplier` param
