const Cooldown = require("../../schemas/cooldown");
const UserProfile = require("../../schemas/user-profile");

function getRandomNumber(x, y) {
  let range = y - x + 1, num = Math.floor(Math.random() * range);
  return num + x;
}

module.exports = {
  data: {
    name: "beg",
    description: "Beg for money"
  },
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "This command can only be executed inside a server.",
        ephemeral: true
      });
      return;
    }

    try {
      await interaction.deferReply();

      const commandName = "beg";
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;

      let cooldown = await Cooldown.findOne({ userId, commandName, guildId });
      const coolDown = Date.now() + 120000;

      if (cooldown && Date.now() < cooldown.endsAt) {
        const { default: prettyMs } = await import("pretty-ms");

        await interaction.editReply(
          `You are on cooldown, come back after ${prettyMs(cooldown.endsAt - Date.now())}`
        );
        return;
      }

      if (!cooldown) {
        cooldown = new Cooldown({ userId, commandName, guildId });
      }

      const chance = getRandomNumber(0, 100);

      if (chance < 30) {
        await interaction.editReply("You didn't get anything. Try again later.");

        cooldown.endsAt = coolDown;
        await cooldown.save();
        return;
      }

      const result = getRandomNumber(50, 500);

      let userProfile = await UserProfile.findOne({ userId, guildId }).select("userId balance");

      if (!userProfile) {
        userProfile = new UserProfile({ userId, guildId });
      }

      userProfile.balance += result;
      cooldown.endsAt = coolDown;

      await Promise.all([cooldown.save(), userProfile.save()]);

      await interaction.editReply(`You got $${result}!\nNew balance: $${userProfile.balance}`);
    } catch (err) {
      console.log(`Error handling /beg: ${err}`);
    }
  }
};