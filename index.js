const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const snekfetch = require('./node_modules/discord.js/node_modules/snekfetch');


//Log to the console to know the bot is online
client.on('ready', () => {
  console.log('Ready!');
  let num = Math.floor(Math.random() * 9);
  if (num === 1) {
    client.user.setActivity('for last hits', { type: 'WATCHING' });
  }
  if (num === 2) {
    client.user.setActivity('Kevin Godec', { type: 'LISTENING' });
  }
  if (num === 3) {
    client.user.setActivity('your last match', { type: 'WATCHING' });
  }
  if (num === 4) {
    client.user.setActivity('bad callouts', { type: 'LISTENING' });
  }
  if (num === 5) {
    client.user.setActivity('for ward placement', { type: 'WATCHING' });
  }
  if (num === 6) {
    client.user.setActivity('you take high ground', { type: 'WATCHING' });
  }
  if (num === 7) {
    client.user.setActivity('the runes', { type: 'WATCHING' });
  }
  if (num === 8) {
    client.user.setActivity('you respawn...again', { type: 'WATCHING' });
  }
  if (num === 0) {
    client.user.setActivity('your draft picks', { type: 'WATCHING' });
  }
});

//Message Event Listening
client.on('message', async message => {

  //Make sure message start with the prefix and that the author isn't a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //Seperate command and arguments for ease of use
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '') return;

  if (command === "ping") {

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === 'match') {
    const { body } = await snekfetch.get(`https://api.opendota.com/api/matches/${args[0]}`);
    const durMinutes = Math.floor(body.duration / 60);
    const durSeconds = body.duration - durMinutes * 60;
    const fbMin = Math.floor(body.first_blood_time / 60);
    const fbSec = body.first_blood_time - fbMin * 60;


    if (body.error === 'Not Found') {
      return message.channel.send(`No match found with the ID: ${args[0]}! Please make sure you entered the right ID!`);
    }

    if (body.radiant_win === false) {

      const embed = new Discord.RichEmbed()
        .setColor('#ff0000')
        .setTitle(`Match: ${body.match_id}`)
        .setDescription('**Winner**: __Dire__')
        .setThumbnail('https://orig00.deviantart.net/1d5e/f/2016/320/9/1/dire_icon_appstyle_by_ellierebeccathorpe-daoloi7.png')
        .setURL(body.replay_url)
        .addField('Radiant:', `${body.radiant_score} Kills`, true)
        .addField('Dire:', `${body.dire_score} Kills`, true)
        .addField('First Blood', `At: ${fbMin} minutes and ${fbSec} seconds!`)
        .addField('Game Duration:', `${durMinutes} minutes and ${durSeconds} seconds!`)
        .setFooter('Brought to you by AncientBot!', 'https://i.pinimg.com/originals/c1/ec/da/c1ecda477bc92b6ecfc533b64d4a0337.png');

      message.channel.send(embed);

    } else {

      const embed = new Discord.RichEmbed()
        .setColor('#33cc33')
        .setTitle(`Match: ${body.match_id}`)
        .setDescription('**Winner**: __Radiant__')
        .setThumbnail('https://orig00.deviantart.net/2638/f/2016/320/7/c/radiant_icon_appstyle_by_ellierebeccathorpe-daolomc.png')
        .setURL(body.replay_url)
        .addField('Radiant:', `${body.radiant_score} Kills`, true)
        .addField('Dire:', `${body.dire_score} Kills`, true)
        .addField('First Blood', `At: ${fbMin} minutes and ${fbSec} seconds!`)
        .addField('Game Duration:', `${durMinutes} minutes and ${durSeconds} seconds!`)
        .setFooter('Brought to you by AncientBot!', 'https://i.pinimg.com/originals/c1/ec/da/c1ecda477bc92b6ecfc533b64d4a0337.png');

      message.channel.send(embed);

    }
    message.channel.send(`${body.match_id}`);

  }

  if (command === 'recent') {
    const body = await snekfetch.get(`https://api.opendota.com/api/search?q=${args[0]}`);
    const userJson = JSON.parse(body.text)
    const player = await snekfetch.get(`https://api.opendota.com/api/players/${userJson[0].account_id}`);
    const playerID = userJson[0].account_id;
    const playerJson = JSON.parse(player.text)
    const wl = await snekfetch.get(`https://api.opendota.com/api/players/${userJson[0].account_id}/wl?limit=20&date=30`);
    const matches = await snekfetch.get(`https://api.opendota.com/api/players/${userJson[0].account_id}/recentMatches`);
    const matchJson = JSON.parse(matches.text)
    const heroes = await snekfetch.get(`https://api.opendota.com/api/heroes`);
    const rank = playerJson.rank_tier;
    const winrate = Math.floor((wl.win / (wl.win + wl.lose)) * 100);
    var medalInd = Math.floor((rank / 1) % 10);
    var medal = '';
    switch (medalInd) {
      default:
        medal = "Uncalibrated";
        break;
      case 1:
        medal = "Herald";
        break;
      case 2:
        medal = "Guardian";
        break;
      case 3:
        medal = "Crusader";
        break;
      case 4:
        medal = "Archon";
        break;
      case 5:
        medal = "Legend";
        break;
      case 6:
        medal = "Ancient";
        break;
      case 7:
        medal = "Divine";
        break;
      case 8:
        medal = "Immortal";
    }

    if (body.error === '404 Not Found') {
      return message.channel.send(`No player found with the name: ${args[0]}! Please make sure you entered the right name!`);
    }

    for (var i = 0; i < 5; i++) {
      const winner = matchJson[i].radiant_win ? "Radiant" : "Dire";
      const matchid = matchJson[i].match_id;
      const heroID = matchJson[i].hero_id;
      const team = (matchJson[i].player_slot > 127) ? "Dire" : "Radiant";
      const icon = matchJson[i].radiant_win ? "https://orig00.deviantart.net/2638/f/2016/320/7/c/radiant_icon_appstyle_by_ellierebeccathorpe-daolomc.png" : "https://orig00.deviantart.net/1d5e/f/2016/320/9/1/dire_icon_appstyle_by_ellierebeccathorpe-daoloi7.png";
      const matchHero = getHero(heroID);
      var WorL = "";
      var color = "";
      if (winner == team) {
        WorL = "Victory!";
        color = "#33cc33";
      } else {
        WorL = "Defeat!";
        color = "#ff0000";
      }

      function getHero(heroID) {
        const heroesJson = JSON.parse(heroes.text);

        for (var i = 0; i < heroesJson.length; i++) {
          if (heroesJson[i].id == heroID){
            return heroesJson[i].localized_name
          }
        }
      }

      switch (matchJson[i].lane_role) {
        default:
          role = "No Lane";
          break;
        case 1:
          role = "Safe";
          break;
        case 2:
          role = "Mid";
          break;
        case 3:
          role = "Off";
          break;
        case 4:
          role = "Jungle";
      }
      switch (matchJson[i].skill) {
        default:
          skill = "Unknown";
          break;
        case 1:
          skill = "Normal";
          break;
        case 2:
          skill = "High";
          break;
        case 3:
          skill = "Very High";
      }

      const embed = new Discord.RichEmbed()
        .setColor(color)
        .setTitle(`Match: ${matchid}`)
        .setDescription(`**Player**: ${userJson[0].personaname}  **Solo Rank**: ${medal}`)
        .setThumbnail(userJson[0].avatarfull)
        .setURL(`https://www.opendota.com/matches/${matchJson[i].match_id}`)
        .addField('Your Team:', `${team}`, true)
        .addField('Result:', `${WorL}`, true)
        .addField('Hero:', `${matchHero}`, true)
        .addField('K/D/A', `${matchJson[i].kills}/${matchJson[i].deaths}/${matchJson[i].assists}`, true)
        .addField('XPM:', `${matchJson[i].xp_per_min}`, true)
        .addField('GPM:', `${matchJson[i].gold_per_min}`, true)
        .addField('Lane:', `${role}`, true)
        .addField('Skill:', `${skill}`, true)
        .setImage(icon)
        .setFooter('Brought to you by AncientBot!', 'https://i.pinimg.com/originals/c1/ec/da/c1ecda477bc92b6ecfc533b64d4a0337.png');

      message.channel.send(embed);

    }

  }
});

client.login(token);