import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONFIG } from "@/config/constants";

export default function AlertNotDiscord() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Unable to open settings</AlertTitle>
      <AlertDescription>
        <p>
          Please open a{" "}
          <a
            className="hover:text-destructive underline underline-offset-4"
            href={CONFIG.DISCORD_URL}
            rel="noreferrer"
            target="_blank"
          >
            Discord channel
          </a>{" "}
          and try again.
        </p>
      </AlertDescription>
    </Alert>
  );
}
