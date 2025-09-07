export function isDiscordUrl(raw?: string): boolean {
  if (!raw) return false;
  try {
    const { hostname } = new URL(raw);
    return hostname === "discord.com" || hostname.endsWith(".discord.com");
  } catch {
    return false;
  }
}
