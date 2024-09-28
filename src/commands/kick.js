const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const prefix = require('../config/config.json');

module.exports.details = {
    name: 'kick',
    author: 'LachlanDev#8014',
    icon: 'https://cdn.discordapp.com/avatars/365350852967399454/ce6e6e91fa887aa86e23ef356c9878fe',
    description: 'Kicks a user from the server.',
    usage: `${prefix.prefix}kick {@user}`
};

module.exports.execute = async (client, message, args) => {
    const { member, mentions } = message;
    const kickMembersPermission = PermissionsBitField.Flags.KickMembers;

    if (message.guild.members.me.permissions.has(kickMembersPermission)) {
        if (member.permissions.has(kickMembersPermission)) {
            const target = mentions.users.first();
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id);
                try {
                    await targetMember.kick();
                    const kickEmbed = new EmbedBuilder()
                        .setColor('#eb9d17')
                        .setTitle('User Kicked')
                        .addFields(
                            { name: 'User', value: `${target} was kicked from the server!` },
                            { name: 'Moderator', value: `${member}` }
                        )
                        .setThumbnail(target.displayAvatarURL())
                        .setFooter({ text: 'Made by LachlanDev#8014', iconURL: 'https://cdn.discordapp.com/avatars/365350852967399454/ce6e6e91fa887aa86e23ef356c9878fe' });

                    await message.channel.send({ embeds: [kickEmbed] });
                } catch (error) {
                    console.error(error);
                    message.reply(`I was unable to kick that user.`);
                }
            } else {
                message.reply(`Please specify a user!`);
            }
        } else {
            message.reply(`You don't have permission.`);
        }
    } else {
        message.reply(`Sorry, I don't have permission to kick members!`);
    }
};
