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
      message: "Upsampler set to {{input.quality === 'fast' ? 'Fast' : 'High Quality'}}. Launch a CS:GO resolution to play."
    }
  }]
}
