import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zip from "vite-plugin-zip-pack";

import manifest from "./manifest.config";
import { name, version } from "./package.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RELEASE_DIR = "release";
const ZIP_FILENAME = `crx-${name}-${version}.zip`;

/** @type {import('vite').UserConfig} */
export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest }),
    zip({ outDir: RELEASE_DIR, outFileName: ZIP_FILENAME }),
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_NAME__: JSON.stringify(name),
  },
};
