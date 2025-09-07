import AlertNotDiscord from "@/components/AlertNotDiscord";
import AppHeader from "@/components/AppHeader";
import useIsDiscordActive from "@/hooks/useIsDiscordActive";
import { LoaderIcon } from "lucide-react";

export default function App() {
  const isDiscord = useIsDiscordActive();

  return (
    <div className="flex flex-col gap-4 p-4">
      <AppHeader />
      <hr className="w-full" />

      {isDiscord == null && <LoaderIcon className="animate-spin" />}
      {isDiscord == false && <AlertNotDiscord />}
    </div>
  );
}
