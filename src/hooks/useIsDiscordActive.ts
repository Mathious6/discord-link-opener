import { useEffect, useState } from "react";

import { isDiscordChannelUrl } from "@/lib/url";

/**
 * Custom React hook that monitors whether the currently active browser tab
 * is displaying a Discord channel page.
 *
 * This hook is designed for Chrome extension development and uses the Chrome
 * Tabs API to track tab changes and URL updates in real-time.
 *
 * @returns {boolean | null} The current Discord status:
 *   - `null`: Initial state, checking hasn't completed yet
 *   - `true`: The active tab is currently showing a Discord channel
 *   - `false`: The active tab is not showing a Discord channel
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
    const onUpdated = (
      _tabId: number,
      _info: chrome.tabs.OnUpdatedInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (tab.active) check();
    };

    check(); // Initial check when the hook mounts
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onUpdated.addListener(onUpdated);

    // Cleanup function: remove event listeners when component unmounts
    return () => {
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, []);

  return isDiscord;
}
