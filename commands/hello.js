module.exports = {
  data: {
    name: "hello",
    description: "Replies with Hi!"
  },
  run: ({ interaction }) => {
    interaction.reply("Hi!");
  }, deleted: true
};