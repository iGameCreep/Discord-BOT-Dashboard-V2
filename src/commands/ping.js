const config = require('../config/config.json');

module.exports.details = {
    name: 'ping',
    description: 'Ping / Pong!',
    author: 'LachlanDev#8014',
    icon: 'https://cdn.discordapp.com/avatars/365350852967399454/ce6e6e91fa887aa86e23ef356c9878fe',
    usage: `${config.prefix}ping`
};

module.exports.execute = (client, message, args) => {
    message.reply('Pong!');
};
