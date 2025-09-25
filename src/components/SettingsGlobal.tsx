import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useSetting from "@/hooks/useSetting";

export default function SettingsGlobal() {
  const [webhook, setWebhook] = useSetting<string>("webhook", "");

  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow-md">
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
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/123/abc"
              type="url"
              value={webhook}
            />
            <Button type="submit" variant="outline">
              <Bell />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
