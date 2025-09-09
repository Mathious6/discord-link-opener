import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export default function SettingsGlobal() {
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
              type="url"
              id="webhook"
              placeholder="https://discord.com/api/webhooks/123/abc"
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
