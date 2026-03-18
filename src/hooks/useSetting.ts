import React, { useState, useEffect, useRef } from "react";

type SettingReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>, string | null];

/**
 * Syncs a React state value with chrome.storage.local, bidirectionally.
 * Listens for external storage changes (e.g. from content script) via onChanged.
 * Uses `isExternalUpdate` ref to prevent bounce-back writes when the change originated externally.
 *
 * @param key - The storage key name (from STORAGE_KEYS)
 * @param defaultValue - Fallback value used until the stored value is loaded
 * @param prefix - Optional prefix for per-channel storage (e.g. `channel:${url}`)
 * @returns Tuple of [value, setValue, error]
 */
export default function useSetting<T>(
  key: string,
  defaultValue: T,
  prefix?: string
): SettingReturn<T> {
  const storageKey = prefix ? `${prefix}:${key}` : key;
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    isInitialLoad.current = true;

    const loadFromStorage = async () => {
      try {
        setError(null);
        const result = await chrome.storage.local.get([storageKey]);
        setValue(result[storageKey] !== undefined ? (result[storageKey] as T) : defaultValue);
        isInitialLoad.current = false;
      } catch (err) {
        console.error(`Failed to load ${storageKey} from storage:`, err);
        setError(`Failed to load settings`);
        isInitialLoad.current = false;
      }
    };

    loadFromStorage();

    const onStorageChanged = (changes: { [k: string]: chrome.storage.StorageChange }) => {
      if (changes[storageKey]?.newValue !== undefined) {
        isExternalUpdate.current = true;
        setValue(changes[storageKey].newValue as T);
      }
    };
    chrome.storage.onChanged.addListener(onStorageChanged);

    return () => chrome.storage.onChanged.removeListener(onStorageChanged);
  }, [storageKey]);

  useEffect(() => {
    if (isInitialLoad.current || isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }

    const saveToStorage = async () => {
      try {
        await chrome.storage.local.set({ [storageKey]: value });
        setError(null);
      } catch (err) {
        console.error(`Failed to save ${storageKey} to storage:`, err);
        setError(`Failed to save settings`);
      }
    };

    saveToStorage();
  }, [value, storageKey]);

  return [value, setValue, error];
}
