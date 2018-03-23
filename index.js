const fs = require('fs');
const Discord = require('discord.js');
const {prefix,token} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for(const file of commandFiles) {
  const command = require(`./commands/${file}`);
  //set a new item in the Collection
  //with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

//Add cooldowns
const cooldowns = new Discord.Collection();

//Log to the console to know the bot is online
client.on('ready', () => {
    console.log('Ready!');
});

//Message Event Listening - Commands in Commands Folder
client.on('message', message => {
  //Make sure message start with the prefix and that the author isn't a bot
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  //Seperate command and arguments for ease of use
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  //Check if command exists
  if(!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  //Check the message is sent in a server chat channel
  if(command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command in a DM!');
  }

  //check for cooldowns
  if(!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if(!timestamps.has(message.author.id)) {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }else {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command again!` );
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args);
  }
  catch(error) {
    console.log(error);
    message.reply('Your Ancient is under attack!');
  }
});

client.login(token);
