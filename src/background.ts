import { appendLog } from "@/lib/storage";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: unknown) => console.error(error));

/**
 * Clears `isMonitoring` for any channel whose URL is no longer open in a tab.
 * Called when a tab is closed or navigates to a different URL so that
 * returning to the channel later does not auto-resume monitoring.
 */
async function clearOrphanedMonitoring(): Promise<void> {
  const storage = await chrome.storage.local.get(null);
  const discordTabs = await chrome.tabs.query({ url: "https://discord.com/*" });
  const openUrls = new Set(discordTabs.map((t) => t.url).filter(Boolean));

  for (const [key, value] of Object.entries(storage)) {
    if (!key.endsWith(":isMonitoring") || value !== true) continue;

    const channelUrl = key.slice("channel:".length, -":isMonitoring".length);
    if (!openUrls.has(channelUrl)) {
      await appendLog(channelUrl, "Monitoring stopped (tab closed)");
      await chrome.storage.local.set({ [key]: false });
    }
  }
}

chrome.tabs.onRemoved.addListener(() => clearOrphanedMonitoring());
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url) clearOrphanedMonitoring();
});

interface ExtensionMessage {
  type: "speak" | "sendWebhook";
  message?: string;
  webhookUrl?: string;
  serverName?: string;
  regexFilter?: string;
  delay?: number;
  link?: string;
}

chrome.runtime.onMessage.addListener(
  (
    request: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    // eslint-disable-next-line no-unused-vars
    sendResponse: (d: { success: boolean; error?: string }) => void
  ): boolean | undefined => {
    if (request.type === "speak" && request.message) {
      chrome.tts.speak(request.message);
      return undefined;
    }

    if (request.type === "sendWebhook") {
      sendWebhook(
        request.webhookUrl ?? "",
        request.serverName ?? "Unknown",
        request.regexFilter ?? "",
        request.delay ?? 0,
        request.link ?? ""
      )
        .then((res) => sendResponse({ success: res.ok }))
        .catch((err: Error) => sendResponse({ success: false, error: err.message }));
      return true;
    }

    return undefined;
  }
);

/**
 * Posts a Discord webhook with a rich embed containing the detected link metadata.
 *
 * @param webhookUrl - Discord webhook endpoint
 * @param serverName - Discord server name for the embed field
 * @param regexFilter - Regex pattern used for the embed field
 * @param delay - Delay in ms applied before opening the link
 * @param link - The detected URL to include in the embed
 * @returns The fetch Response from the webhook POST
 */
function sendWebhook(
  webhookUrl: string,
  serverName: string,
  regexFilter: string,
  delay: number,
  link: string
): Promise<Response> {
  const regexValue = regexFilter ? `\`${regexFilter}\`` : "None";
  const ts = new Date().toLocaleString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  return fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: null,
      embeds: [
        {
          title: "New link detected :bell:",
          description: link,
          color: 13547807,
          fields: [
            { name: "Delay", value: `\`${delay}ms\``, inline: true },
            { name: "Regex", value: regexValue, inline: true },
            { name: "Server", value: `\`${serverName}\``, inline: true },
          ],
          footer: {
            text: `Discord link-opener \u2022 ${ts}`,
            icon_url: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
          },
        },
      ],
      username: "Link notifier",
      attachments: [],
    }),
  });
}
