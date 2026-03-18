export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidRegex(value: string): boolean {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidNumber(value: string | number): boolean {
  return !isNaN(Number(value)) && Number(value) >= 0;
}
