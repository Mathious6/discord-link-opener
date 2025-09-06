import discordLogo from "@/assets/discord.svg";
import githubLogo from "@/assets/github.svg";
import "./Header.css";

const DISCORD_URL = "https://discord.com/channels/@me";
const GITHUB_URL = "https://github.com/Mathious6/discord-link-opener";

export default function Header() {
  return (
    <header>
      <a href={DISCORD_URL} target="_blank" rel="noreferrer">
        <img src={discordLogo} className="logo discord" alt="Discord logo" />
      </a>
      <a href={GITHUB_URL} target="_blank" rel="noreferrer">
        <img src={githubLogo} className="logo github" alt="GitHub logo" />
      </a>
      <h1>Discord link-opener</h1>
    </header>
  );
}
