module.exports = {
  requires: {
    bundle: "ai",
  },
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/dogman189/diamond app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -r requirements.txt"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: ["uv pip install realesrgan"]
      }
    },
    // basicsr 1.4.2 imports from torchvision.transforms.functional_tensor,
    // which was renamed to _functional_tensor in torchvision >=0.18.
    // Patch it so the import resolves correctly.
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "sed -i 's/from torchvision.transforms.functional_tensor import/from torchvision.transforms._functional_tensor import/' env/lib/python3.10/site-packages/basicsr/data/degradations.py"
        ]
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          // xformers: true
        }
      }
    }
  ]
}
