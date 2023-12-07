require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { CommandHandler } = require("djs-commander");
const mongoose = require("mongoose")
const path = require("path");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, "events"),
  commandsPath: path.join(__dirname, "commands")
});

(async () => {
  await mongoose.connect(process.env.MONGODB_URL)
    .catch(err => console.log(`Could not connect to database: ${err}`));
  console.log("Connected to the database!");

  client.login(process.env.TOKEN);
})();