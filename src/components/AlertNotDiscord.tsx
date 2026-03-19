import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONFIG } from "@/config/constants";

/** Shown when the active tab is not on discord.com. Prompts the user to navigate to Discord. */
export default function AlertNotDiscord() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Unable to open settings</AlertTitle>
      <AlertDescription>
        <p>
          Please open{" "}
          <a
            className="hover:text-destructive underline underline-offset-4"
            href={CONFIG.DISCORD_URL}
            rel="noreferrer"
            target="_blank"
          >
            Discord
          </a>{" "}
          and try again.
        </p>
      </AlertDescription>
    </Alert>
  );
}
