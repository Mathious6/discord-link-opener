import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DISCORD_URL, GITHUB_URL } from "@/config/constants";
import { AlertCircleIcon } from "lucide-react";

import discordLogo from "@/assets/discord.svg";
import githubLogo from "@/assets/github.svg";

export default function App() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-center gap-12">
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">
          <img
            src={discordLogo}
            alt="Discord"
            className="h-24 w-24 brightness-0 invert hover:drop-shadow-[0_0_1em_rgba(255,255,255,0.3)]"
          />
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <img
            src={githubLogo}
            alt="Github"
            className="h-24 w-24 brightness-0 invert hover:drop-shadow-[0_0_1em_rgba(255,255,255,0.3)]"
          />
        </a>
      </div>

      <h1 className="text-2xl font-bold">Discord link-opener</h1>

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
