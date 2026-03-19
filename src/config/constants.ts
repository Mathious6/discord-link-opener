export const CONFIG = {
  DISCORD_URL: "https://discord.com/channels/@me",
  GITHUB_URL: "https://github.com/Mathious6/discord-link-opener",
  GITHUB_REPO: "mathious6/discord-link-opener",
} as const;

export const STORAGE_KEYS = {
  REGEX_FILTER: "regexFilter",
  DELAY: "delay",
  IS_MONITORING: "isMonitoring",
  MONITORING_LOGS: "monitoringLogs",
  OPEN_ENABLED: "openEnabled",
  NOTIFY_ENABLED: "notifyEnabled",
  WEBHOOK_URL: "webhookUrl",
} as const;

/**
 * Builds a per-channel storage key by prefixing with the channel URL.
 *
 * @param url - The Discord channel URL
 * @param key - The storage key name from STORAGE_KEYS
 * @returns Prefixed key, e.g. `channel:https://discord.com/channels/1/2:regexFilter`
 */
export const channelKey = (url: string, key: string): string => `channel:${url}:${key}`;
