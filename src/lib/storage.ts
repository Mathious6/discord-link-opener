import { channelKey, STORAGE_KEYS } from "@/config/constants";

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
