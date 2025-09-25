import { Github, RocketIcon } from "lucide-react";

import discordLogo from "@/assets/discord.svg";
import { Badge } from "@/components/ui/badge";
import { CONFIG } from "@/config/constants";

export default function AppHeader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center gap-12">
        <a href={CONFIG.DISCORD_URL} rel="noreferrer" target="_blank">
          <img
            alt="Discord"
            className="h-16 w-16 brightness-0 invert hover:drop-shadow-[0_0_1em_rgba(255,255,255,0.3)]"
            src={discordLogo}
          />
        </a>
      </div>

      <h1 className="text-2xl font-bold">Discord link-opener</h1>

      <div className="flex gap-2">
        <Badge className="inline-flex items-center gap-1" variant="secondary">
          <RocketIcon className="h-4 w-4" /> v{__APP_VERSION__}
        </Badge>
        <a href={CONFIG.GITHUB_URL} rel="noreferrer" target="_blank">
          <Badge className="inline-flex items-center gap-1" variant="secondary">
            <Github className="h-4 w-4" /> {CONFIG.GITHUB_REPO}
          </Badge>
        </a>
      </div>
    </div>
  );
}
