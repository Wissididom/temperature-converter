import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  PermissionsBitField,
} from "discord.js";
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channels,
    Partials.GuildMemeber,
    Partials.Message,
    Partials.Reaction,
  ],
});
const token = process.env["TOKEN"];

async function handleApplicationCommand(interaction) {
  if (!interaction.isChatInputCommand()) return; // Not a chat input command. Needs to be revisited when we make message components or modals
  let temp = null;
  const { commandName } = interaction;
  switch (commandName) {
    case "temperatureconvert":
      await interaction.deferReply({ ephemeral: true });
      let sourceValue = interaction.options.getNumber("source");
      let sourceFormat = interaction.options.getString("srcformat");
      let targetFormat = interaction.options.getString("dstformat");
      switch (sourceFormat) {
        case "c":
          switch (targetFormat) {
            case "c":
              await interaction.editReply({
                content: `Converting ${sourceValue} °C to °C doesn't really make sense!`,
              });
              break;
            case "f":
              await interaction.editReply({
                content: `${sourceValue} °C is ${sourceValue * 1.8 + 32} °F!`,
              });
              break;
            case "k":
              await interaction.editReply({
                content: `${sourceValue} °C is ${sourceValue + 273.15} K!`,
              });
              break;
            default:
              await interaction.editReply({
                content: "This combination of formats is not supported!",
              });
              break;
          }
          break;
        case "f":
          switch (targetFormat) {
            case "c":
              await interaction.editReply({
                content: `${sourceValue} °F is ${(sourceValue - 32) / 1.8} °C!`,
              });
              break;
            case "f":
              await interaction.editReply({
                content: `Converting ${sourceValue} °F to °F doesn't really make sense!`,
              });
              break;
            case "k":
              await interaction.editReply({
                content: `${sourceValue} °F is ${
                  (sourceValue - 32) / 1.8 + 273.15
                } K!`,
              });
              break;
            default:
              await interaction.editReply({
                content: "This combination of formats is not supported!",
              });
              break;
          }
          break;
        case "k":
          switch (targetFormat) {
            case "c":
              await interaction.editReply({
                content: `${sourceValue} K is ${sourceValue - 273.15} °C!`,
              });
              break;
            case "f":
              await interaction.editReply({
                content: `${sourceValue} K is ${
                  (sourceValue - 273.15) * 1.8 + 32
                } °F!`,
              });
              break;
            case "k":
              await interaction.editReply({
                content: `Converting ${sourceValue} K to K doesn't really make sense!`,
              });
              break;
            default:
              await interaction.editReply({
                content: "This combination of formats is not supported!",
              });
              break;
          }
          break;
        default:
          await interaction.editReply({
            content: "This combination of formats is not supported!",
          });
          break;
      }
      break;
    default:
      await interaction.editReply({
        content: "Error: Command does not exist! How did you even execute it?",
        allowed_mentions: { parse: [] },
      });
      break;
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason, "Unhandled Rejection at Promise", promise);
});
process.on("uncaughtException", (err) => {
  console.error(err, "Uncaught Exception thrown", err.stack);
});

bot.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on(Events.InteractionCreate, async (interaction) =>
  handleApplicationCommand(interaction),
);

bot.login(token);
