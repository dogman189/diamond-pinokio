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
    // Step 1: Install PyTorch first (foundation for everything else)
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
    },
    // Step 2: Install project dependencies (torch will be skipped since already installed)
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
    // Step 3: Install Real-ESRGAN for the enhanced quality tier
    // This pulls in basicsr -> tb-nightly -> protobuf 7.x
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: ["uv pip install realesrgan"]
      }
    },
    // Step 4: Upgrade wandb — the one pinned in requirements.txt (0.17.0)
    // is incompatible with protobuf 7.x pulled in by tb-nightly (transitive dep of basicsr)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: ["uv pip install -U wandb"]
      }
    },
    // Step 5: Patch basicsr 1.4.2 — it imports from
    // torchvision.transforms.functional_tensor, renamed to
    // _functional_tensor in torchvision >=0.18.
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "sed -i 's/from torchvision.transforms.functional_tensor import/from torchvision.transforms._functional_tensor import/' env/lib/python3.10/site-packages/basicsr/data/degradations.py"
        ]
      }
    }
  ]
}
