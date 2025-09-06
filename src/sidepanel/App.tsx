import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DISCORD_URL, GITHUB_URL } from "@/config/constants";
import { AlertCircleIcon, Github, RocketIcon } from "lucide-react";

import discordLogo from "@/assets/discord.svg";
import { Badge } from "@/components/ui/badge";

export default function App() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-12">
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <img
            src={discordLogo}
            alt="Discord"
            className="h-16 w-16 brightness-0 invert hover:drop-shadow-[0_0_1em_rgba(255,255,255,0.3)]"
          />
        </a>
      </div>

      <h1 className="text-2xl font-bold">Discord link-opener</h1>

      <div className="flex gap-2">
        <Badge variant="secondary" className="inline-flex items-center gap-1">
          <RocketIcon className="h-4 w-4" /> v{__APP_VERSION__}
        </Badge>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <Badge variant="secondary" className="inline-flex items-center gap-1">
            <Github className="h-4 w-4" /> source code
          </Badge>
        </a>
      </div>

      <hr className="w-full" />

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unable to open settings</AlertTitle>
        <AlertDescription>
          <p>Please open a Discord channel and try again.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
