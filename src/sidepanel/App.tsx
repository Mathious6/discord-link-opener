import AlertNotDiscord from "@/components/AlertNotDiscord";
import AppHeader from "@/components/AppHeader";
import SettingsGlobal from "@/components/SettingsGlobal";
import SettingsTask from "@/components/SettingsTask";
import { Separator } from "@/components/ui/separator";
import useIsDiscordActive from "@/hooks/useIsDiscordActive";
import { LoaderIcon } from "lucide-react";

function renderContent(isDiscord: boolean | null) {
  switch (isDiscord) {
    case null:
      return <LoaderIcon className="animate-spin" />;
    case false:
      return <AlertNotDiscord />;
    case true:
      return (
        <>
          <SettingsTask />
          <SettingsGlobal />
        </>
      );
    default:
      return null;
  }
}

export default function App() {
  const isDiscord: boolean | null = useIsDiscordActive();

  return (
    <div className="flex flex-col gap-4 p-4">
      <AppHeader />
      <Separator />

      {renderContent(isDiscord)}
    </div>
  );
}
