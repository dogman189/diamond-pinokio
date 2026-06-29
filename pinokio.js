const path = require('path')
module.exports = {
  version: "3.7",
  title: "diamond",
  description: "Diffusion for World Modeling https://diamond-wm.github.io/",
  icon: "icon.gif",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env")
    let running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js"),
      link: info.running("link.js")
    }
    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    } else if (installed) {
      if (running.start) {
        let local = info.local("start.js")
        if (local && local.url) {
          return [{
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open Web UI",
            href: local.url,
          }, {
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        } else {
          return [{
            default: true,
            icon: 'fa-solid fa-terminal',
            text: "Terminal",
            href: "start.js",
          }]
        }
      } else if (running.update) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Updating",
          href: "update.js",
        }]
      } else if (running.reset) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Resetting",
          href: "reset.js",
        }]
      } else if (running.link) {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Deduplicating",
          href: "link.js",
        }]
      } else {
        return [{
          icon: "fa-solid fa-power-off",
          text: "Counter Strike 2x (300×560)",
          href: "start.js",
          params: {
            branch: "csgo",
            size_multiplier: "2"
          }
        }, {
          icon: "fa-solid fa-power-off",
          text: "Counter Strike 3x (450×840)",
          href: "start.js",
          params: {
            branch: "csgo",
            size_multiplier: "3"
          }
        }, {
          icon: "fa-solid fa-power-off",
          text: "Counter Strike 4x (600×1120)",
          href: "start.js",
          params: {
            branch: "csgo",
            size_multiplier: "4"
          }
        }, {
          icon: "fa-solid fa-power-off",
          text: "Counter Strike 5x (750×1400)",
          href: "start.js",
          params: {
            branch: "csgo",
            size_multiplier: "5"
          }
        }, {
          icon: "fa-solid fa-power-off",
          text: "Start Atari",
          href: "start.js",
          params: {
            branch: "main"
          }
        }, {
          icon: "fa-solid fa-gear",
          text: "Quality Settings",
          href: "configure.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Update",
          href: "update.js",
        }, {
          icon: "fa-solid fa-plug",
          text: "Install",
          href: "install.js",
        }, {
          icon: "fa-solid fa-file-zipper",
          text: "<div><strong>Save Disk Space</strong><div>Deduplicates redundant library files</div></div>",
          href: "link.js",
        }, {
          icon: "fa-regular fa-circle-xmark",
          text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
          href: "reset.js",
          confirm: "Are you sure you wish to reset the app?"
        }]
      }
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
    }
  }
}
