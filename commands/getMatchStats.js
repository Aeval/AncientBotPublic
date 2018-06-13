module.exports = {
    name: 'stats',
    description: 'Quick stats by match ID',
    guildOnly: true,
    cooldown: 3,
    async(message, args) {
        const {body} = await request.get(`https://api.opendota.com/api/matches/${args[0]}`);

        const trim = (str, max) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;

        if(body.error === 'Not Found') {
            return message.channel.send(`No match found with the ID: ${args[0]}! Please make sure you entered the right ID!`);
          }
        
          message.channel.send(body.radiant_win);
    }
};