const Cooldown = require("../../schemas/cooldown");

module.exports = () => {
  setInterval(async () => {
    try {
      const cooldowns = Cooldown.find().select("endsAt");

      for (const cooldown in cooldowns) {
        if (Date.now() < cooldown.endsAt) return;

        await Cooldown.deleteOne({ _id: cooldown._id });
      }
    } catch (err) {
      console.log(`Error clearing cooldowns: ${err}`);
    }
  }, 1000);
};