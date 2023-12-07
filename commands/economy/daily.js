const UserProfile = require("../../schemas/user-profile");

module.exports = {
  data: {
    name: "daily",
    description: "Collect your dailies!"
  },
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be executed inside a server.",
        ephemeral: true
      });
      return;
    }
    
    try {
      await interaction.deferReply();

      const dailyAmount = interaction.guild.id === "1164363292517605416" ? 500 * 1.5 : 500;

      let userProfile = await UserProfile.findOne({
        userId: interaction.user.id,
        guildId: interaction.guild.id
      });

      if (userProfile) {
        const lastDailyDate = userProfile.lastDaily?.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply("You've already collected your dailies today. Come back tomorrow for more.");
          return;
        }
      } else {
        userProfile = new UserProfile({
          userId: interaction.user.id,
          guildId: interaction.guild.id
        });
      }

      userProfile.balance += dailyAmount;
      userProfile.lastDaily = new Date();

      await userProfile.save();

      interaction.editReply(`$${dailyAmount} was added to your balance.\nNew balance: $${userProfile.balance}`);
    } catch (err) {
      console.log(`Error handling /daily: ${err}`);
    }
  }
};