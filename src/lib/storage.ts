import { channelKey, STORAGE_KEYS } from "@/config/constants";

export interface Settings {
  regexFilter: string;
  delay: number;
  isMonitoring: boolean;
  openEnabled: boolean;
  notifyEnabled: boolean;
  webhookUrl: string;
}

/**
 * Reads settings from chrome.storage.local. All task settings are stored per-channel
 * with a `channel:${url}:` prefix. Only webhookUrl is global.
 *
 * @param channelUrl - The Discord channel URL used to build per-channel storage keys
 * @returns The current extension settings as a typed Settings object
 */
export async function getSettings(channelUrl: string): Promise<Settings> {
  const ck = (key: string) => channelKey(channelUrl, key);

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

/**
 * Appends a timestamped log entry to the monitoring logs array in chrome.storage.
 *
 * @param channelUrl - The Discord channel URL used to build the per-channel storage key
 * @param message - Log message to append (e.g. "Monitoring Discord")
 */
export async function appendLog(channelUrl: string, message: string): Promise<void> {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
  const key = channelKey(channelUrl, STORAGE_KEYS.MONITORING_LOGS);
  const result = await chrome.storage.local.get([key]);
  const logs = (result[key] as string[]) ?? [];
  logs.push(`[${ts}] ${message}`);
  await chrome.storage.local.set({ [key]: logs });
}
