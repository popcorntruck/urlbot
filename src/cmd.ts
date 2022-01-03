import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction } from "discord.js";
import { REST } from "@discordjs/rest";
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v9";

export type Command = {
  data: Partial<SlashCommandBuilder>;
  handler: (i: CommandInteraction) => void;
};

export const startSlashCommands = async (
  token: string,
  clientId: string,
  commands: Array<Command>,
  guildId?: string
) => {
  const builtCommandJson: Array<any> = [];

  console.log(`Building ${commands.length} command(s)`);

  for (const command of commands) {
    if (command.data.toJSON === undefined) {
      console.log("Failed to build command: " + command.data.name);
      return;
    }

    builtCommandJson.push(command.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(token);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: builtCommandJson,
    });
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: builtCommandJson,
  });

  console.log("Successfully built and reloaded application (/) commands.");
};

export const handleSlashCommand = async (
  interaction: Interaction,
  commands: Array<Command>
) => {
  if (!interaction.isCommand()) return;

  const command = commands.find((c) => {
    return c.data.name === interaction.commandName;
  });

  if (!command) {
    return console.log(
      `Failed to run (/) command "${interaction.commandName}"`
    );
  }

  command.handler(interaction as CommandInteraction);
};
