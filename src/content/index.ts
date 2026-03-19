import { channelKey, STORAGE_KEYS } from "@/config/constants";
import { appendLog as appendLogToStorage } from "@/lib/storage";

interface Settings {
  regexFilter: string;
  delay: number;
  isMonitoring: boolean;
  openEnabled: boolean;
  notifyEnabled: boolean;
  webhookUrl: string;
}

const ck = (key: string) => channelKey(window.location.href, key);
const appendLog = (message: string) => appendLogToStorage(window.location.href, message);

let currentObserver: MutationObserver | null = null;
let isProcessing = false;

chrome.runtime.onMessage.addListener((request: { type: string }) => {
  if (request.type === "startMonitoring") {
    startMonitoring();
  }

  if (request.type === "stopMonitoring") {
    stopMonitoring();
  }
});

main().catch((error) => console.error("Error in main:", error));

/** Auto-resumes monitoring on page reload if this channel's isMonitoring is true. */
async function main(): Promise<void> {
  const settings = await getSettings();
  if (settings.isMonitoring) {
    await startMonitoring();
  }
}

/** Strips Discord UI distractions, resolves the server name from the page title, then starts the MutationObserver. */
async function startMonitoring(): Promise<void> {
  const settings = await getSettings();
  if (!settings.openEnabled && !settings.notifyEnabled) return;

  await removeDomElements();
  await appendLog("Ready to monitor this channel");

  const tabTitle = document.querySelector("title");
  const serverName = tabTitle?.textContent?.split("|").pop()?.trim() ?? "Unknown";
  await sleep(1000);

  monitor(settings, serverName);
}

/** Disconnects the observer, resets state in storage, and reloads the page to restore Discord UI. */
function stopMonitoring(): void {
  currentObserver?.disconnect();
  currentObserver = null;
  isProcessing = false;
  appendLog("Monitoring stopped").then(() => {
    chrome.storage.local.set({ [ck(STORAGE_KEYS.IS_MONITORING)]: false });
    window.location.reload();
  });
}

/**
 * Observes DOM mutations for new Discord messages containing links matching the regex.
 * Uses `isProcessing` guard to prevent async double-fire when mutations queue up.
 * On match: sends webhook (if notify), opens link (if open) or re-observes (notify-only).
 *
 * @param settings - Current extension settings from chrome.storage
 * @param serverName - Discord server name extracted from the page title
 */
async function monitor(settings: Settings, serverName: string): Promise<void> {
  const { regexFilter, delay = 0, notifyEnabled, openEnabled, webhookUrl } = settings;
  const regex = new RegExp(regexFilter || ".*", "i");

  isProcessing = false;

  currentObserver = new MutationObserver(async (mutations) => {
    if (isProcessing) return;

    for (const mutation of mutations) {
      const addedNodes = Array.from(mutation.addedNodes).filter(
        (node): node is HTMLElement =>
          node.nodeType === 1 && (node as HTMLElement).matches?.('[class^="messageListItem_"]')
      );

      for (const node of addedNodes) {
        const links = Array.from(node.querySelectorAll("a"))
          .map((a) => a.href)
          .filter((url) => regex.test(url));

        if (links.length > 0) {
          isProcessing = true;
          currentObserver?.disconnect();
          await appendLog("Link found");

          if (notifyEnabled) {
            chrome.runtime.sendMessage({
              type: "sendWebhook",
              webhookUrl,
              serverName,
              regexFilter,
              delay,
              link: links[0],
            });
            await appendLog("Webhook sent");
          }

          if (openEnabled) {
            await sleep(delay);
            chrome.runtime.sendMessage({ type: "speak", message: "Opening link..." });
            window.open(links[0], "_blank");
            await appendLog("Link opened");
            chrome.storage.local.set({
              [ck(STORAGE_KEYS.IS_MONITORING)]: false,
            });
            return;
          } else {
            await sleep(delay);
            monitor(settings, serverName);
            return;
          }
        }
      }
    }
  });

  appendLog("Monitoring Discord");
  currentObserver.observe(document.body, { childList: true, subtree: true });
}

/** Removes Discord sidebar, subtitle bar, message form, and members panel to reduce distractions. Polls up to 10s per element. */
async function removeDomElements(): Promise<void> {
  const [sideBar, titleBar, formBar] = await Promise.all([
    waitForElement('[class^="sidebar_"]'),
    waitForElement('[class^="subtitleContainer_"]'),
    waitForElement('[class^="form_"]'),
  ]);
  sideBar?.remove();
  titleBar?.remove();
  formBar?.remove();
  document.querySelector('[class^="content_"] > [class^="container_"]')?.remove();
}

/**
 * Polls the DOM for an element every 100ms, up to 100 attempts (10s).
 *
 * @param selector - CSS selector to query
 * @returns The matched element, or null on timeout
 */
async function waitForElement(selector: string): Promise<Element | null> {
  for (let i = 0; i < 100; i++) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(50);
  }
  return null;
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Reads settings from chrome.storage.local. All task settings are stored per-channel
 * with a `channel:${url}:` prefix. Only webhookUrl is global.
 *
 * @returns The current extension settings as a typed Settings object
 */
async function getSettings(): Promise<Settings> {
  const channelKeys = [
    STORAGE_KEYS.REGEX_FILTER,
    STORAGE_KEYS.DELAY,
    STORAGE_KEYS.OPEN_ENABLED,
    STORAGE_KEYS.NOTIFY_ENABLED,
    STORAGE_KEYS.IS_MONITORING,
  ] as const;

  const keys = [...channelKeys.map(ck), STORAGE_KEYS.WEBHOOK_URL];
  const result = await chrome.storage.local.get(keys);

  return {
    regexFilter: (result[ck(STORAGE_KEYS.REGEX_FILTER)] as string) ?? "",
    delay: (result[ck(STORAGE_KEYS.DELAY)] as number) ?? 0,
    openEnabled: (result[ck(STORAGE_KEYS.OPEN_ENABLED)] as boolean) ?? true,
    notifyEnabled: (result[ck(STORAGE_KEYS.NOTIFY_ENABLED)] as boolean) ?? true,
    isMonitoring: (result[ck(STORAGE_KEYS.IS_MONITORING)] as boolean) ?? false,
    webhookUrl: (result[STORAGE_KEYS.WEBHOOK_URL] as string) ?? "",
  };
}
