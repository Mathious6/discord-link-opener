import discordLogo from "@/assets/discord.svg";
import HelloWorld from "@/components/HelloWorld";
import "./App.css";

export default function App() {
  return (
    <div>
      <a
        href="https://discord.com/channels/@me"
        target="_blank"
        rel="noreferrer"
      >
        <img src={discordLogo} className="logo discord" alt="Discord logo" />
      </a>
      <HelloWorld msg="Discord link-opener" />
    </div>
  );
}
