module.exports = (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "hello") {
    msg.reply(`Hi ${msg.author.displayName}!`);
  }
};