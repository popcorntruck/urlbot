import "dotenv-safe/config";
import "reflect-metadata";
import { Client } from "discord.js";
import { handleSlashCommand, startSlashCommands } from "./cmd";
import { ShortenCommand } from "./commands/Shorten";

const commands = [ShortenCommand];

export const main = async () => {
  const bot = new Client({
    intents: ["GUILDS"],
  });

  bot.on("ready", async () => {
    console.log(`Logged in as ${bot.user?.username}!`);

    await startSlashCommands(
      process.env.DISCORD_TOKEN!,
      process.env.DISCORD_CLIENT_ID!,
      commands,
      process.env.DISCORD_GUILD_ID!
    );
  });

  bot.on("interactionCreate", (i) => {
    handleSlashCommand(i, commands);
  });

  await bot.login(process.env.DISCORD_TOKEN!);
};

main().catch((err) => console.error(err));
