import discordLogo from "@/assets/discord.svg";
import githubLogo from "@/assets/github.svg";
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
      <a
        href="https://github.com/Mathious6/discord-link-opener"
        target="_blank"
        rel="noreferrer"
      >
        <img src={githubLogo} className="logo github" alt="GitHub logo" />
      </a>
      <h1>Discord link-opener</h1>
      <HelloWorld />
    </div>
  );
}
