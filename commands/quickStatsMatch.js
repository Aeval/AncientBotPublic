module.exports = {
  name: 'match',
  description: 'Quick Stats by Match ID',
  guildOnly: true,
  cooldown: 3,
  execute(message, args) {
     const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
     const {body} = await snekfetch.get(`https://api.opendota.com/api/matches/${args[0]}`);

     if(body.error === 'Not Found') {
       return message.channel.send(`No match found with the ID: ${args[0]}! Please make sure you entered the right ID!`);
     }

     if(body.radiant_win === 'false'){
       let winner = 'Dire';
     }else{
       let winner = 'Radiant';
     }

     const embed = new Discord.RichEmbed()
        if(winner === 'Dire'){
          .setColor('#ff0000');
        }else{
          .setColor('#33cc33');
        }
        .setTitle(`Match: ${body.match_id} Winner: ` + winner)
        .setURL(body.replay_url)
        .addInlineField('Radiant:', `${body.radiant_score}`)
        .addInlineField('Dire:', `${body.dire_score} Kills`)
        .addField('First Blood', `At: ${body.first_blood_time} seconds!`)
        .addField('Game Duration:', `${body.duration} seconds!`)
        .addFooter('Brought to you by AncientBot!');

     message.channel.send(embed);
  },
};
