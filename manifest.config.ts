import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  description: "Automatically monitor and open Discord links in your browser.",
  version: pkg.version,
  icons: {
    16: "public/icons/logo16.png",
    32: "public/icons/logo32.png",
    48: "public/icons/logo48.png",
    128: "public/icons/logo128.png",
  },
  action: {},
  background: {
    service_worker: "src/background.ts",
  },
  permissions: ["sidePanel"],
  host_permissions: ["https://discord.com/channels/*"],
  content_scripts: [],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
});
