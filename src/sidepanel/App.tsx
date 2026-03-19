import { LoaderIcon } from "lucide-react";

import AlertNotDiscord from "@/components/AlertNotDiscord";
import AppHeader from "@/components/AppHeader";
import SettingsGlobal from "@/components/SettingsGlobal";
import SettingsTask from "@/components/SettingsTask";
import { Separator } from "@/components/ui/separator";
import useActiveTab from "@/hooks/useActiveTab";

export default function App() {
  const { isDiscord, tabUrl } = useActiveTab();

  return (
    <div className="flex flex-col gap-4 p-4">
      <AppHeader />
      <Separator />

      {isDiscord === null && <LoaderIcon className="animate-spin" />}
      {isDiscord === false && <AlertNotDiscord />}
      {isDiscord === true && (
        <>
          <SettingsTask tabUrl={tabUrl} />
          <SettingsGlobal />
        </>
      )}
    </div>
  );
}
