import "dotenv/config";
import { REST, Routes, SlashCommandBuilder } from "discord.js";

const token = process.env["TOKEN"];

const rest = new REST().setToken(token);

let commands = [
  new SlashCommandBuilder()
    .setName("temperatureconvert")
    .setDescription("convert between different temperature formats")
    .addNumberOption((option) =>
      option
        .setName("source")
        .setDescription("The source value as double between -2^53 and 2^53")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("srcformat")
        .setDescription("The source format to use")
        .setRequired(true)
        .addChoices(
          { name: "°C", value: "c" },
          { name: "°F", value: "f" },
          { name: "K", value: "k" },
        ),
    )
    .addStringOption((option) =>
      option
        .setName("dstformat")
        .setDescription("The target format to use")
        .setRequired(true),
    ),
];

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );
    const userData = await rest.get(Routes.user());
    const userId = userData.id;
    const data = await rest.put(Routes.applicationCommands(userId), {
      body: commands,
    });
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (err) {
    console.error(err);
  }
})();
