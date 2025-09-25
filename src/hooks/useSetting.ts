import React, { useState, useEffect, useRef } from "react";

type SettingReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>, string | null];

/**
 * Generic custom hook for managing any setting with Chrome storage persistence.
 *
 * @param key - The storage key to use for this setting
 * @param defaultValue - Default value to use if no stored value exists
 * @returns Array containing [value, setValue, error]
 */
export default function useSetting<T>(key: string, defaultValue: T): SettingReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        setError(null);

        const result = await chrome.storage.local.get([key]);
        if (result[key] !== undefined) setValue(result[key]);
        isInitialLoad.current = false;
      } catch (err) {
        console.error(`Failed to load ${key} from storage:`, err);
        setError(`Failed to load ${key} settings`);
        isInitialLoad.current = false;
      }
    };

    loadFromStorage();
  }, [key]);

  useEffect(() => {
    if (isInitialLoad.current) return;

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
