const STORAGE_KEYS = {
  CHANNEL_URL: "channelUrl",
  REGEX_FILTER: "regexFilter",
  DELAY: "delay",
  IS_MONITORING: "isMonitoring",
  MONITORING_STATUS: "monitoringStatus",
  OPEN_ENABLED: "openEnabled",
  NOTIFY_ENABLED: "notifyEnabled",
  WEBHOOK_URL: "webhookUrl",
} as const;

interface Settings {
  channelUrl: string;
  regexFilter: string;
  delay: number;
  isMonitoring: boolean;
  openEnabled: boolean;
  notifyEnabled: boolean;
  webhookUrl: string;
}

let currentObserver: MutationObserver | null = null;
let isProcessing = false;

function setStatus(message: string): void {
  chrome.storage.local.set({ [STORAGE_KEYS.MONITORING_STATUS]: message });
}

chrome.runtime.onMessage.addListener((request: { type: string }) => {
  if (request.type === "startMonitoring") {
    startMonitoring();
  }

  if (request.type === "stopMonitoring") {
    stopMonitoring();
  }
});

main().catch((error) => console.error("Error in main:", error));

async function main(): Promise<void> {
  const settings = await getSettings();
  if (
    settings.isMonitoring &&
    settings.channelUrl &&
    window.location.href === settings.channelUrl
  ) {
    await startMonitoring();
  }
}

async function startMonitoring(): Promise<void> {
  const settings = await getSettings();
  if (!settings.openEnabled && !settings.notifyEnabled) return;

  await removeDomElements();
  setStatus("Ready to monitor this channel");

  const tabTitle = document.querySelector("title");
  const serverName = tabTitle?.textContent?.split("|").pop()?.trim() ?? "Unknown";
  await sleep(1000);

  monitor(settings, serverName);
}

function stopMonitoring(): void {
  currentObserver?.disconnect();
  currentObserver = null;
  isProcessing = false;
  chrome.storage.local.set({
    [STORAGE_KEYS.IS_MONITORING]: false,
    [STORAGE_KEYS.MONITORING_STATUS]: "",
  });
  window.location.reload();
}

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

          if (notifyEnabled) {
            setStatus("Sending webhook");
            chrome.runtime.sendMessage({
              type: "sendWebhook",
              webhookUrl,
              serverName,
              regexFilter,
              delay,
              link: links[0],
            });
          }

          if (openEnabled) {
            await sleep(delay);
            setStatus("Opening link");
            chrome.runtime.sendMessage({ type: "speak", message: "Opening link..." });
            window.open(links[0], "_blank");
            chrome.storage.local.set({
              [STORAGE_KEYS.IS_MONITORING]: false,
              [STORAGE_KEYS.MONITORING_STATUS]: "",
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

  setStatus("Monitoring Discord");
  currentObserver.observe(document.body, { childList: true, subtree: true });
}

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

async function waitForElement(selector: string): Promise<Element | null> {
  for (let i = 0; i < 100; i++) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(100);
  }
  return null;
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function getSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(Object.values(STORAGE_KEYS), (result) =>
      resolve(result as unknown as Settings)
    );
  });
}
