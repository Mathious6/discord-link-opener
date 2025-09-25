export function isDiscordChannelUrl(raw?: string): boolean {
  if (!raw) return false;
  try {
    const { hostname, pathname } = new URL(raw);
    return (
      hostname === "discord.com" && pathname.includes("/channels/") && !pathname.includes("/@me")
    );
  } catch {
    return false;
  }
}
