import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONFIG } from "@/config/constants";
import { AlertCircleIcon } from "lucide-react";

export default function AlertNotDiscord() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Unable to open settings</AlertTitle>
      <AlertDescription>
        <p>
          Please open a{" "}
          <a
            href={CONFIG.DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-destructive underline underline-offset-4"
          >
            Discord channel
          </a>{" "}
          and try again.
        </p>
      </AlertDescription>
    </Alert>
  );
}
