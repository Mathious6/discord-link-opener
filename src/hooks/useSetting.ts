import React, { useState, useEffect, useRef } from "react";

type SettingReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>, string | null];

/**
 * Syncs a React state value with chrome.storage.local, bidirectionally.
 * Listens for external storage changes (e.g. from content script) via onChanged.
 * Uses `isExternalUpdate` ref to prevent bounce-back writes when the change originated externally.
 *
 * @param key - The chrome.storage key to persist this setting under
 * @param defaultValue - Fallback value used until the stored value is loaded
 * @returns Tuple of [value, setValue, error]
 */
export default function useSetting<T>(key: string, defaultValue: T): SettingReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const isExternalUpdate = useRef(false);

  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        setError(null);

        const result = await chrome.storage.local.get([key]);
        if (result[key] !== undefined) setValue(result[key] as T);
        isInitialLoad.current = false;
      } catch (err) {
        console.error(`Failed to load ${key} from storage:`, err);
        setError(`Failed to load ${key} settings`);
        isInitialLoad.current = false;
      }
    };

    loadFromStorage();

    const onStorageChanged = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[key]?.newValue !== undefined) {
        isExternalUpdate.current = true;
        setValue(changes[key].newValue as T);
      }
    };
    chrome.storage.onChanged.addListener(onStorageChanged);

    return () => chrome.storage.onChanged.removeListener(onStorageChanged);
  }, [key]);

  useEffect(() => {
    if (isInitialLoad.current || isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }

    const saveToStorage = async () => {
      try {
        await chrome.storage.local.set({ [key]: value });
        setError(null);
      } catch (err) {
        console.error(`Failed to save ${key} to storage:`, err);
        setError(`Failed to save ${key} settings`);
      }
    };

    saveToStorage();
  }, [value, key]);

  return [value, setValue, error];
}
