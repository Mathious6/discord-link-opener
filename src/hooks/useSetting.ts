import { useCallback, useEffect, useState } from "react";

/**
 * Syncs a React state value with chrome.storage.local, bidirectionally.
 *
 * Flow: setValue() writes to chrome.storage → onChanged updates React state.
 * External writes (e.g. from content script) follow the same onChanged path.
 * No bounce-back possible because React state is never the source of writes.
 *
 * @param key - The storage key name (from STORAGE_KEYS)
 * @param defaultValue - Fallback value used until the stored value is loaded
 * @param prefix - Optional prefix for per-channel storage (e.g. `channel:${url}`)
 * @returns Tuple of [value, setValue]
 */
export default function useSetting<T>(
  key: string,
  defaultValue: T,
  prefix?: string
): [T, (value: T) => void] {
  const storageKey = prefix ? `${prefix}:${key}` : key;
  const [value, setLocal] = useState<T>(defaultValue);

  useEffect(() => {
    chrome.storage.local
      .get([storageKey])
      .then((result) => {
        if (result[storageKey] !== undefined) setLocal(result[storageKey] as T);
      })
      .catch((err) => console.error(`Failed to load ${storageKey}:`, err));

    const onChanged = (changes: { [k: string]: chrome.storage.StorageChange }) => {
      if (changes[storageKey]?.newValue !== undefined) {
        setLocal(changes[storageKey].newValue as T);
      }
    };
    chrome.storage.onChanged.addListener(onChanged);
    return () => chrome.storage.onChanged.removeListener(onChanged);
  }, [storageKey]);

  const setValue = useCallback(
    (newValue: T) => {
      setLocal(newValue);
      chrome.storage.local
        .set({ [storageKey]: newValue })
        .catch((err) => console.error(`Failed to save ${storageKey}:`, err));
    },
    [storageKey]
  );

  return [value, setValue];
}
