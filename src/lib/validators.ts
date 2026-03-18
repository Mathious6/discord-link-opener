/**
 * Validates URL format using the URL constructor. Requires a scheme (e.g. `https://`).
 *
 * @param value - The string to validate
 * @returns `true` if the string is a valid URL
 */
export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a URL belongs to discord.com. Used by useIsDiscordActive to gate the side panel UI.
 *
 * @param raw - The URL string to check
 * @returns `true` if the hostname is discord.com
 */
export function isDiscordUrl(raw?: string): boolean {
  if (!raw) return false;
  try {
    const { hostname } = new URL(raw);
    return hostname === "discord.com";
  } catch {
    return false;
  }
}

/**
 * Tests whether the string compiles as a valid RegExp without throwing.
 *
 * @param value - The regex pattern string to validate
 * @returns `true` if the string is a valid regular expression
 */
export function isValidRegex(value: string): boolean {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}
