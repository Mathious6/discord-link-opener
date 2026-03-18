import { useEffect, useState } from "react";

/**
 * Tracks the active tab's URL in real-time via chrome.tabs API.
 * Updates on tab switch and in-tab navigation.
 *
 * @returns The current tab URL, or empty string while loading
 */
export default function useActiveTabUrl(): string {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const update = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      setUrl(tab?.url ?? "");
    };

    const onActivated = () => update();
    const onUpdated = (_tabId: number, _info: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
      if (tab.active) update();
    };

    update();
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, []);

  return url;
}
