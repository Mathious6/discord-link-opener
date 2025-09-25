import { PlayIcon, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useSetting from "@/hooks/useSetting";

export default function SettingsTask() {
  const [regex, setRegex] = useSetting<string>("regexFilter", "");
  const [delay, setDelay] = useSetting<number>("openDelay", 1000);

  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow-md">
      <div className="h-full">
        <div className="container flex items-center justify-between py-2">
          <h2 className="text-lg font-semibold">Task settings</h2>
          <div className="flex space-x-2">
            <Button
              className="bg-green-500/20 text-green-500 hover:bg-green-500/40 hover:text-green-600"
              size="icon"
            >
              <PlayIcon />
            </Button>
            <Button
              className="bg-red-500/20 text-red-500 hover:bg-red-500/40 hover:text-red-600"
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
          <Label htmlFor="delay">Open delay (ms)</Label>
          <Input
            id="delay"
            onChange={(e) => setDelay(Number(e.target.value))}
            placeholder="1000"
            type="number"
            value={delay}
          />
        </div>
      </div>
    </div>
  );
}
