import { useEffect, useState } from "react";

import { isDiscordUrl } from "@/lib/validators";

interface ActiveTab {
  isDiscord: boolean | null;
  tabUrl: string;
}

/**
 * Tracks the active tab's URL and Discord status in real-time via chrome.tabs API.
 * Listens to onActivated and onUpdated events for live updates on tab switch and navigation.
 *
 * @returns Object with `isDiscord` (null while loading) and `tabUrl` (empty string while loading)
 */
export default function useActiveTab(): ActiveTab {
  const [state, setState] = useState<ActiveTab>({ isDiscord: null, tabUrl: "" });

  useEffect(() => {
    const update = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab?.url ?? tab?.pendingUrl ?? "";
        setState({ isDiscord: isDiscordUrl(url), tabUrl: url });
      } catch {
        setState({ isDiscord: false, tabUrl: "" });
      }
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

  return state;
}
