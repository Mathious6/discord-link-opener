import { useEffect, useState } from "react";

import { isDiscordChannelUrl } from "@/lib/url";

/**
 * Tracks whether the active tab is on discord.com via chrome.tabs API.
 * Listens to onActivated and onUpdated events for real-time updates.
 *
 * @returns `null` while checking, `true` if on Discord, `false` otherwise
 */
export default function useIsDiscordActive(): boolean | null {
  const [isDiscord, setIsDiscord] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const url = tab?.url ?? tab?.pendingUrl;
        setIsDiscord(isDiscordChannelUrl(url));
      } catch {
        setIsDiscord(false);
      }
    };

    const onActivated = () => check();
    const onUpdated = (_tabId: number, _info: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
      if (tab.active) check();
    };

    check();
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, []);

  return isDiscord;
}
