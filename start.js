module.exports = {
  requires: {
    bundle: "ai",
  },
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        id: "shell",
        venv: "env",
        env: {
          PYTORCH_ENABLE_MPS_FALLBACK: "1"
        },
        path: "app",
        message: [
          "git checkout {{args.branch}}",
          "{{args.branch === 'main' ? 'python src/play.py --pretrained --size-multiplier ' + (args.size_multiplier || '2') + ' --quality ' + (args.quality || 'fast') : null}}",
          "{{args.branch === 'csgo' ? 'python src/play.py --size-multiplier ' + (args.size_multiplier || '2') + ' --quality ' + (args.quality || 'fast') + (args.enhance ? ' --enhance' : '') : null}}",
        ],
        on: [{
          "event": "/(press enter|enter a number)/i",
          "done": true
        }]
      }
    },
    {
      when: "{{args.branch === 'main'}}",
      method: "input",
      params: {
        type: "notify",
        title: "Select",
        form: [{
          "key": "game",
          "title": "Select a number"
        }]
      }
    },
    {
      when: "{{args.branch === 'main'}}",
      method: "shell.enter",
      params: {
        id: "shell",
        message: "{{input.game}}" 
      }
    },
    {
      method: "shell.enter",
      params: {
        id: "shell",
        message: "\n\n" 
      }
    },
  ]
}
