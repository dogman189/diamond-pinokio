# Upscaler Quality Selector — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a quality-level selector to the DIAMOND launcher so users can toggle between fast (1 step) and high-quality (10 step) upsampling as a persistent menu setting.

**Architecture:** A `configure.js` script writes quality preference to `settings.json`. The `start.js` script reads it and passes `--quality` to `play.py`, which uses a Hydra override to load either `config/world_model_env/fast.yaml` or `config/world_model_env/higher_quality.yaml`.

**Tech Stack:** Pinokio scripts, Hydra config, Python argparse, diffusion upsampler

## Global Constraints

- `play.py` already uses Hydra's `compose()` with `config_name="trainer"` and defaults to `world_model_env: fast`
- `settings.json` must not be tracked in git
- The upsampler config files already exist at `config/world_model_env/fast.yaml` and `config/world_model_env/higher_quality.yaml`
- All new files go in the launcher root (`/home/dogman/pinokio/api/diamond.git/`), not in `app/`

---
### Task 1: Add `--quality` argument to `play.py`

**Files:**
- Modify: `app/src/play.py:18-28` (parse_args), `app/src/play.py:97-99` (compose call)

**Interfaces:**
- Consumes: existing `argparse` infrastructure
- Produces: new CLI arg `--quality` (choices: `fast`, `higher_quality`, default: `fast`)

- [ ] **Step 1: Add the `--quality` argument**

In `app/src/play.py`, add a new argument to `parse_args()`:

```python
parser.add_argument("--quality", type=str, default="fast", choices=["fast", "higher_quality"], help="Upsampler quality (fast or higher_quality).")
```

Insert after line 26 (after the `--compile` argument) and before line 27 (`--fps`).

- [ ] **Step 2: Pass quality as Hydra override**

In `main()`, change the `compose()` call at line 99 to pass the quality as a Hydra override:

```python
cfg = compose(config_name="trainer", overrides=[f"world_model_env={args.quality}"])
```

This overrides the `defaults: [world_model_env: fast]` in `trainer.yaml` with whatever the user selected.

- [ ] **Step 3: Verify the change**

Run a dry check to make sure argparse parses correctly:

```bash
python app/src/play.py --help
```

Expected output should include: `--quality {fast,higher_quality}`

- [ ] **Step 4: Commit**

```bash
git add app/src/play.py
git commit -m "feat: add --quality arg to play.py for upsampler config selection"
```

---
### Task 2: Create `configure.js`

**Files:**
- Create: `configure.js`

**Interfaces:**
- Consumes: user selection from input dropdown
- Produces: writes `{"quality": "fast"}` or `{"quality": "higher_quality"}` to `settings.json`

- [ ] **Step 1: Write `configure.js`**

Create `configure.js` with the quality selection dropdown that saves to `settings.json`:

```javascript
module.exports = {
  run: [{
    method: "input",
    params: {
      title: "Quality Settings",
      description: "Select the upsampler quality level for CS:GO. Higher quality produces sharper images but runs slower.",
      type: "notify",
      form: [{
        type: "select",
        key: "quality",
        title: "Upsampler Quality",
        items: [{
          text: "Fast (1 denoising step) — default",
          value: "fast"
        }, {
          text: "High Quality (10 denoising steps)",
          value: "higher_quality"
        }]
      }]
    }
  }, {
    method: "json.set",
    params: {
      path: "settings.json",
      key: "quality",
      value: "{{input.quality}}"
    }
  }, {
    method: "notify",
    params: {
      title: "Quality Set",
      message: "Upsampler set to {{input.quality === 'fast' ? 'Fast' : 'High Quality'}}. Select a CS:GO resolution to launch."
    }
  }]
}
```

- [ ] **Step 2: Commit**

```bash
git add configure.js
git commit -m "feat: add configure.js for upsampler quality selection"
```

---
### Task 3: Update `start.js` to read settings and pass quality

**Files:**
- Modify: `start.js`

**Interfaces:**
- Consumes: `settings.json` (via `json.get`), `args.size_multiplier` from menu params
- Produces: shell command with `--quality` flag passed to `play.py`

- [ ] **Step 1: Add `json.get` step to read settings**

Insert a conditional `json.get` step before the `shell.run` step. This reads `settings.json` and populates `local.settings`:

```javascript
    {
      when: "{{exists('settings.json')}}",
      method: "json.get",
      params: {
        settings: "settings.json"
      }
    },
```

This goes between the opening `run: [` and the `shell.run` step.

- [ ] **Step 2: Add `--quality` to the shell commands**

Update both the CS:GO and Atari shell commands to include `--quality`:

At line 18 (CS:GO branch):
```javascript
"{{args.branch === 'csgo' ? 'python src/play.py --size-multiplier ' + (args.size_multiplier || '2') + ' --quality ' + ((local.settings || {}).quality || 'fast') : null}}",
```

At line 19 (main/Atari branch):
```javascript
"{{args.branch === 'main' ? 'python src/play.py --pretrained --size-multiplier ' + (args.size_multiplier || '2') + ' --quality ' + ((local.settings || {}).quality || 'fast') : null}}",
```

The `((local.settings || {}).quality || 'fast')` expression safely handles:
- No `settings.json` → `local.settings` is undefined → falls back to `'fast'`
- `settings.json` exists but no `quality` key → `{}` then `.quality` is undefined → falls back to `'fast'`
- `settings.json` with quality set → uses the configured value

- [ ] **Step 3: Verify the file**

Read `start.js` and confirm the structure is:

```
run: [
  { when: exists settings.json → json.get settings },
  { shell.run with --quality {{(local.settings || {}).quality || 'fast'}} },
  ... existing steps ...
]
```

- [ ] **Step 4: Commit**

```bash
git add start.js
git commit -m "feat: pass --quality from settings.json to play.py in start.js"
```

---
### Task 4: Update `pinokio.js` — add Quality Settings button

**Files:**
- Modify: `pinokio.js`

**Interfaces:**
- Consumes: `configure.js` exists at project root
- Produces: menu item that launches `configure.js`

- [ ] **Step 1: Add Quality Settings button to the installed menu**

In `pinokio.js`, after the CS:GO buttons and Atari button, add the Quality Settings button:

```javascript
        }, {
          icon: "fa-solid fa-gear",
          text: "Quality Settings",
          href: "configure.js",
        },
```

This goes before the "Update" button.

- [ ] **Step 2: Verify the menu structure**

Read `pinokio.js` to confirm the ordering. The installed menu should be:

```
Counter Strike 2x (300×560)
Counter Strike 3x (450×840)
Counter Strike 4x (600×1120)
Counter Strike 5x (750×1400)
Start Atari
Quality Settings     ← new
Update
Install
<save disk space>
<reset>
```

- [ ] **Step 3: Commit**

```bash
git add pinokio.js
git commit -m "feat: add Quality Settings menu button to pinokio.js"
```

---
### Task 5: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `settings.json` to `.gitignore`**

Append to `.gitignore`:

```
settings.json
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add settings.json to .gitignore"
```

---

## Integration Check

After all tasks complete, verify:

1. Run `python app/src/play.py --help` — should show `--quality` arg
2. Run `configure.js` via Pinokio — dropdown appears, selection writes `settings.json`
3. Read `settings.json` — format matches `{"quality": "fast"}`
4. Verify `settings.json` is NOT tracked by git (`git check-ignore settings.json` should succeed)
