import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlayIcon, Square } from "lucide-react";

export default function TaskSettings() {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow-md">
      <div className="h-full">
        <div className="container flex items-center justify-between py-4">
          <h2 className="text-lg font-semibold">Task settings</h2>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              className="bg-green-500/20 text-green-500 hover:bg-green-500/40 hover:text-green-600"
            >
              <PlayIcon />
            </Button>
            <Button
              size="icon"
              className="bg-red-500/20 text-red-500 hover:bg-red-500/40 hover:text-red-600"
            >
              <Square />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="container grid h-full w-full items-center gap-3 py-6">
          <Label htmlFor="regex">Regex filter</Label>
          <Input
            type="text"
            id="regex"
            placeholder="^https?:\/\/(?:[\w-]+\.)*ldlc\.com(?:\/\S*)?$"
          />
          <Label htmlFor="delay">Open delay (ms)</Label>
          <Input type="number" id="delay" placeholder="1000" />
        </div>
      </div>
    </div>
  );
}
