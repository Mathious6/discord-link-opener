# Agent Instructions

## Dev Container (MANDATORY)

All shell commands MUST run inside the dev container. NEVER run `npm`, `node`, `npx`, `tsc`, or any build/lint/test commands directly on the host machine.

### Container access

```bash
docker exec discord-link-opener <command>
```

Or with the workspace directory:

```bash
docker exec -w /workspaces/discord-link-opener discord-link-opener <command>
```

### Why

- `node_modules` contains platform-specific native bindings (linux-x64 in container vs darwin-arm64 on host)
- Running `npm install` on the host corrupts bindings for the container and vice versa
- The dev container has the correct Node version and tooling configured

### File editing

Reading and writing source files can be done on the host (the workspace is mounted). Only shell commands must go through the container.
