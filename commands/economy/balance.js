const { ApplicationCommandOptionType } = require("discord.js");
const UserProfile = require("../../schemas/user-profile");

module.exports = {
  data: {
    name: "balance",
    description: "Check your balance",
    options: [
      {
        name: "target-user",
        description: "The user whose balance you want to see.",
        type: ApplicationCommandOptionType.User
      }
    ]
  },
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server.",
        ephemeral: true
      });
      return;
    }

    const targetUserId = interaction.options.getUser("target-user")?.id || interaction.user.id;

    await interaction.deferReply();

    try {
      let userProfile = await UserProfile.findOne({ userId: targetUserId, guildId: interaction.guild.id });

      if (!userProfile) {
        if (targetUserId === interaction.user.id) await interaction.editReply({
          content: "No user profile found.\nCreating new user profile..."
        });

        userProfile = new UserProfile({ userId: targetUserId, guildId: interaction.guild.id });
      }

      interaction.editReply(
        targetUserId === interaction.user.id ? `Your balance is: $${userProfile.balance}` : `<@${targetUserId}>'s balance is: $${userProfile.balance}`
      );
    } catch (err) {
      console.log(`Error handling /balance: ${err}`);
    }
  }
}