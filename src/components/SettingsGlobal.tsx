import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CONFIG, STORAGE_KEYS } from "@/config/constants";
import useSetting from "@/hooks/useSetting";
import { isValidUrl } from "@/lib/validators";

/** Webhook URL configuration with a test button that sends a sample embed to verify the webhook works. */
export default function SettingsGlobal() {
  const [webhookUrl, setWebhookUrl] = useSetting<string>(STORAGE_KEYS.WEBHOOK_URL, "");
  const [regex] = useSetting<string>(STORAGE_KEYS.REGEX_FILTER, "");
  const [delay] = useSetting<number>(STORAGE_KEYS.DELAY, 0);

  const handleTestWebhook = () => {
    if (!webhookUrl) return;

    chrome.runtime.sendMessage({
      type: "sendWebhook",
      webhookUrl,
      serverName: "Test Server",
      regexFilter: regex,
      delay,
      link: CONFIG.GITHUB_URL,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border shadow-md">
      <div className="h-full">
        <div className="container flex items-center justify-between py-2">
          <h2 className="text-lg font-semibold">Global settings</h2>
        </div>
        <Separator />
        <div className="container grid h-full w-full items-center gap-3 py-4">
          <Label htmlFor="webhook">Webhook URL</Label>
          <div className="flex gap-2">
            <Input
              id="webhook"
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/123/abc"
              type="url"
              value={webhookUrl}
            />
            <Button
              disabled={!isValidUrl(webhookUrl)}
              onClick={handleTestWebhook}
              variant="outline"
            >
              <Bell />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
