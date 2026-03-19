# Recording `demo.gif`

Step-by-step procedure to produce a clean demo GIF for the README.

## Prerequisites

### Discord test server

Create a dedicated Discord server (e.g. **discord-link-opener**) with one text channel: `#demo`.

### Webhooks

Create two webhooks on `#demo` in **Server Settings → Integrations → Webhooks**:

| Webhook       | Used by                                 |
| ------------- | --------------------------------------- |
| Demo Injector | The bash script — injects test messages |
| Link Notifier | The extension — sends detection alerts  |

Copy both webhook URLs and export them in your terminal:

```bash
export WEBHOOK_INJECT="https://discord.com/api/webhooks/<id>/<token>"  # Demo Injector
export WEBHOOK_NOTIFY="https://discord.com/api/webhooks/<id>/<token>"  # Link Notifier
```

### Build the extension

```bash
npm run build
```

## Step 1 — Launch Chrome with a blank profile

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** → select the `dist/` folder

## Step 2 — Open Discord and hide private elements

1. Log into Discord in the demo profile
2. Navigate to the `#demo` channel in your test server
3. Open the browser console (`Cmd + Option + J`) and paste:

   ```js
   // Remove the DM sidebar (left panel) — hides direct messages list
   document.querySelector('nav[aria-label="Direct Messages"]')?.remove();

   // Remove the servers sidebar (left icon column) — hides server list
   document.querySelector('nav[aria-label="Servers sidebar"]')?.remove();

   // Remove the user panel (bottom-left) — hides username and avatar
   document.querySelector('section[aria-label="User status and settings"]')?.remove();
   ```

## Step 3 — Configure the extension

1. Click the extension icon to open the side panel
2. Fill in the settings:

   | Field        | Value             |
   | ------------ | ----------------- |
   | Regex filter | `Mathious6`       |
   | Delay        | `2000`            |
   | Open         | ON (green)        |
   | Notify       | ON (green)        |
   | Webhook URL  | `$WEBHOOK_NOTIFY` |

3. Click the **play** button to start monitoring

## Step 4 — Inject test messages

In a separate terminal (with `$WEBHOOK_INJECT` exported), run:

```bash
curl -s -H "Content-Type: application/json" \
  -d '{"embeds":[{"title":"❌ Check out this link","description":"https://google.com","color":15548997}]}' \
  "$WEBHOOK_INJECT"

sleep 2

curl -s -H "Content-Type: application/json" \
  -d '{"embeds":[{"title":"❌ Another link here","description":"https://example.com","color":15548997}]}' \
  "$WEBHOOK_INJECT"

sleep 2

curl -s -H "Content-Type: application/json" \
  -d '{"embeds":[{"title":"⏰ New drop available","description":"https://github.com/Mathious6/discord-link-opener","color":5763719}]}' \
  "$WEBHOOK_INJECT"
```

### Expected behavior

1. **Message 1** (`google.com`) — appears in chat, extension ignores it (no regex match)
2. **Message 2** (`example.com`) — appears in chat, extension ignores it (no regex match)
3. **Message 3** (`github.com`) — regex matches:
   - A new tab opens `https://github.com/Mathious6/discord-link-opener`
   - TTS says "Opening link..."
   - A rich embed from **Link notifier** appears in the same channel:
     - Title: **New link detected 🔔**
     - Fields: Delay `1000ms` · Regex `Mathious6` · Server `discord-link-opener`

## Recording

The final file goes to `docs/demo.gif` and is referenced in the README as:

```markdown
![demo_gif](./docs/demo.gif)
```
