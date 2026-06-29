module.exports = {
  run: [{
    method: "input",
    params: {
      title: "Quality Settings",
      description: "Select the upsampler quality level. Higher quality produces sharper images but runs slower.",
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
    method: "local.set",
    params: {
      quality: "{{input.quality}}"
    }
  }, {
    method: "json.set",
    params: {
      "settings.json": {
        "quality": "{{local.quality}}"
      }
    }
  }, {
    method: "notify",
    params: {
      title: "Quality Set",
      message: "Upsampler set to {{local.quality === 'fast' ? 'Fast' : 'High Quality'}}. Launch a CS:GO resolution to play."
    }
  }]
}
