# Development

## Stack

- **React 19** + **TypeScript** for the side panel UI
- **Vite** as build tool
- **CRXJS Vite Plugin** for Chrome extension bundling (Manifest V3)
- **Tailwind CSS v4** for styling
- **shadcn/ui** (New York style) for UI components
- **Lucide React** for icons
- **ESLint** + **Prettier** for code quality

## Project structure

```tree
src/
  background.ts        # Service worker (side panel, TTS, webhook relay)
  content/index.ts     # Content script (monitoring, overlay, DOM manipulation)
  sidepanel/           # React side panel app (entry point)
  components/          # React components (settings, header, alerts)
  components/ui/       # shadcn/ui primitives (button, input, label, etc.)
  hooks/               # Custom hooks (useSetting, useIsDiscordActive)
  config/constants.ts  # Shared constants and storage keys
  lib/                 # Utilities (url, validators, cn)
manifest.config.ts     # Chrome extension manifest (generates manifest.json)
```

## Dev container

A VS Code dev container is provided (`.devcontainer/`):

- **Base image**: Ubuntu with Node 22
- **Extensions**: Prettier, ESLint, Tailwind CSS IntelliSense
- **Post-create**: runs `npm install` automatically

Open the project in VS Code and select **"Reopen in Container"** to get started.

## Commands

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start Vite dev server with HMR           |
| `npm run build`    | Type-check + production build to `dist/` |
| `npm run lint`     | Run ESLint                               |
| `npm run lint:fix` | Run ESLint with auto-fix                 |

## Loading the extension

1. Run `npm run dev` or `npm run build`
2. Go to `chrome://extensions/`, enable Developer mode
3. Click **Load unpacked** and select the `dist/` folder

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component-name>
```

Config is in `components.json`. Components land in `src/components/ui/`.
