const { ActivityType } = require("discord.js");

module.exports = (c) => {
  console.log(`Logged in as ${c.user.username}!`);

  const status = c.user.setPresence({
    status: "idle",
    activities: [{
      type: ActivityType.Playing,
      name: "Cuberquest.io"
    }]
  });
};