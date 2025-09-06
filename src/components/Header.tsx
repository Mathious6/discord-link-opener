import discordLogo from "@/assets/discord.svg";
import githubLogo from "@/assets/github.svg";
import { DISCORD_URL, GITHUB_URL } from "@/config/constants";

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
