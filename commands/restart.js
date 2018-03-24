module.exports = {
  name: 'restart',
  description: 'Restarts the bot service!',
  guildOnly: true,
  cooldown: 3,
  execute(message, args) {
    if(message.author.id === '189898772845690880') {
      process.exit();
    }
  },
};
