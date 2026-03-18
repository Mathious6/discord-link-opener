import { ActivityIcon, PlayIcon, Square } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { STORAGE_KEYS } from "@/config/constants";
import useSetting from "@/hooks/useSetting";

/** Monitoring controls: regex filter, delay, open/notify toggles, play/stop buttons, and live status. */
export default function SettingsTask() {
  const [regex, setRegex] = useSetting<string>(STORAGE_KEYS.REGEX_FILTER, "");
  const [delay, setDelay] = useSetting<number>(STORAGE_KEYS.DELAY, 0);
  const [openEnabled, setOpenEnabled] = useSetting<boolean>(STORAGE_KEYS.OPEN_ENABLED, true);
  const [notifyEnabled, setNotifyEnabled] = useSetting<boolean>(STORAGE_KEYS.NOTIFY_ENABLED, true);
  const [isMonitoring] = useSetting<boolean>(STORAGE_KEYS.IS_MONITORING, false);
  const [status] = useSetting<string>(STORAGE_KEYS.MONITORING_STATUS, "");

  const canStart = !isMonitoring && (openEnabled || notifyEnabled);

  const handleMonitor = async () => {
    if (!canStart) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith("https://discord.com/")) return;

    await chrome.storage.local.set({
      [STORAGE_KEYS.CHANNEL_URL]: tab.url,
      [STORAGE_KEYS.IS_MONITORING]: true,
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
      [STORAGE_KEYS.IS_MONITORING]: false,
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
          {isMonitoring && status && (
            <Alert className="border-green-600/30 bg-green-600/10">
              <ActivityIcon className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-400">{status}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
