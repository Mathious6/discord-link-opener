import AppHeader from "@/components/AppHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function App() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <AppHeader />

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
