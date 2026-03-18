export const CONFIG = {
  DISCORD_URL: "https://discord.com/channels/@me",
  GITHUB_URL: "https://github.com/Mathious6/discord-link-opener",
  GITHUB_REPO: "mathious6/discord-link-opener",
} as const;

export const STORAGE_KEYS = {
  CHANNEL_URL: "channelUrl",
  REGEX_FILTER: "regexFilter",
  DELAY: "delay",
  IS_MONITORING: "isMonitoring",
  MONITORING_STATUS: "monitoringStatus",
  OPEN_ENABLED: "openEnabled",
  NOTIFY_ENABLED: "notifyEnabled",
  WEBHOOK_URL: "webhookUrl",
} as const;
