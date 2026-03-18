export function isDiscordChannelUrl(raw?: string): boolean {
  if (!raw) return false;
  try {
    const { hostname } = new URL(raw);
    return hostname === "discord.com";
  } catch {
    return false;
  }
}
