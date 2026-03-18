import { PlayIcon, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { channelKey, STORAGE_KEYS } from "@/config/constants";
import useSetting from "@/hooks/useSetting";
import { isValidRegex } from "@/lib/validators";

/** Monitoring controls: regex filter, delay, open/notify toggles, play/stop buttons, and terminal log. */
export default function SettingsTask({ tabUrl }: { tabUrl: string }) {
  const prefix = `channel:${tabUrl}`;

  const [regex, setRegex] = useSetting<string>(STORAGE_KEYS.REGEX_FILTER, "", prefix);
  const [delay, setDelay] = useSetting<number>(STORAGE_KEYS.DELAY, 0, prefix);
  const [openEnabled, setOpenEnabled] = useSetting<boolean>(
    STORAGE_KEYS.OPEN_ENABLED,
    true,
    prefix
  );
  const [notifyEnabled, setNotifyEnabled] = useSetting<boolean>(
    STORAGE_KEYS.NOTIFY_ENABLED,
    true,
    prefix
  );
  const [isMonitoring] = useSetting<boolean>(STORAGE_KEYS.IS_MONITORING, false, prefix);
  const [logs] = useSetting<string[]>(STORAGE_KEYS.MONITORING_LOGS, [], prefix);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 500);
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const hasValidRegex = regex === "" || isValidRegex(regex);
  const canStart = !isMonitoring && (openEnabled || notifyEnabled) && hasValidRegex;

  const handleMonitor = async () => {
    if (!canStart) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith("https://discord.com/")) return;

    await chrome.storage.local.set({
      [channelKey(tabUrl, STORAGE_KEYS.IS_MONITORING)]: true,
      [channelKey(tabUrl, STORAGE_KEYS.MONITORING_LOGS)]: [],
    });

    try {
      await chrome.tabs.sendMessage(tab.id, { type: "startMonitoring" });
    } catch {
      chrome.tabs.reload(tab.id);
    }
  };

  const handleStop = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    await chrome.storage.local.set({
      [channelKey(tabUrl, STORAGE_KEYS.IS_MONITORING)]: false,
    });

    try {
      await chrome.tabs.sendMessage(tab.id, { type: "stopMonitoring" });
    } catch {
      /* content script already gone */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border shadow-md">
      <div className="h-full">
        <div className="container flex items-center justify-between py-2">
          <h2 className="text-lg font-semibold">Task settings</h2>
          <div className="flex space-x-2">
            <Button
              className="bg-green-500/20 text-green-500 hover:bg-green-500/40 hover:text-green-600"
              disabled={!canStart}
              onClick={handleMonitor}
              size="icon"
            >
              <PlayIcon />
            </Button>
            <Button
              className="bg-red-500/20 text-red-500 hover:bg-red-500/40 hover:text-red-600"
              disabled={!isMonitoring}
              onClick={handleStop}
              size="icon"
            >
              <Square />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="container grid h-full w-full items-center gap-3 py-4">
          <Label htmlFor="regex">Regex filter</Label>
          <Input
            className={regex && !isValidRegex(regex) ? "border-red-500" : ""}
            id="regex"
            onChange={(e) => setRegex(e.target.value)}
            placeholder="ldlc.com"
            type="text"
            value={regex}
          />
          <Label htmlFor="delay">Delay (ms)</Label>
          <Input
            id="delay"
            onChange={(e) => setDelay(Number(e.target.value))}
            placeholder="0"
            type="number"
            value={delay}
          />
          <div className="flex gap-2 pt-1">
            <Button
              className={
                openEnabled
                  ? "flex-1 bg-green-600 text-white hover:bg-green-700"
                  : "bg-muted text-muted-foreground flex-1 hover:bg-green-600 hover:text-white"
              }
              onClick={() => setOpenEnabled(!openEnabled)}
              variant="secondary"
            >
              Open
            </Button>
            <Button
              className={
                notifyEnabled
                  ? "flex-1 bg-green-600 text-white hover:bg-green-700"
                  : "bg-muted text-muted-foreground flex-1 hover:bg-green-600 hover:text-white"
              }
              onClick={() => setNotifyEnabled(!notifyEnabled)}
              variant="secondary"
            >
              Notify
            </Button>
          </div>
          <div
            className="overflow-y-auto rounded-md bg-zinc-950 p-2 font-mono text-xs leading-5 text-green-400"
            style={{ height: "calc(5 * 1.25rem + 1rem)" }}
          >
            {logs.length === 0 && <span className="text-zinc-600">No activity yet.</span>}
            {logs.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
            {isMonitoring && <div className="text-green-600">waiting{dots}</div>}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
