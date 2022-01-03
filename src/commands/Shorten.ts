import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { Command } from "src/cmd";
import { isValidHttpUrl } from "../utils";
import fetch from "node-fetch";
import FormData from "form-data";

export const ShortenCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("shorten")
    .setDescription("Shorten a link")
    .addStringOption((o) =>
      o.setName("link").setDescription("The link to shorten").setRequired(true)
    ),
  handler: async (i) => {
    const urlToShorten = i.options.getString("link");

    if (!urlToShorten) {
      const errorEmbed = new MessageEmbed()
        .addField("Error", "You must provide a link to shorten.")
        .setColor("#FF0000");

      i.reply({ embeds: [errorEmbed] });

      return;
    }

    if (!isValidHttpUrl(urlToShorten)) {
      const errorEmbed = new MessageEmbed()
        .addField("Error", "That link is not valid.")
        .setColor("#FF0000");

      i.reply({ embeds: [errorEmbed] });

      return;
    }

    const form = new FormData();
    form.append("url", urlToShorten);

    const res = await fetch(`https://cleanuri.com/api/v1/shorten`, {
      method: "POST",
      body: form,
    });

    const json = await res.json();

    if (!json.result_url) {
      const errorEmbed = new MessageEmbed()
        .addField("Error", "That link is not valid.")
        .setColor("#FF0000");

      i.reply({ embeds: [errorEmbed] });

      return;
    }

    const embed = new MessageEmbed()
      .setTitle("Shortened Link")
      .addField("Link:", json.result_url)
      .setFooter(`Shortened by ${i.user.username}`)
      .setThumbnail(i.user.avatarURL()!);

    i.reply({ embeds: [embed] });
  },
};
