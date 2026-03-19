# Agent Instructions

## Local Development

All commands run directly on the host machine. Node.js 22+ is required.

### Setup

```bash
npm ci
```

### Development

```bash
npm run dev
```

Load the extension from the `dist/` directory in `chrome://extensions/` (Developer mode enabled).

### Build

```bash
npm run build
```

### File editing

Source files are in `src/`. The project uses Prettier for formatting and ESLint for linting — both run automatically on save via VS Code settings.
