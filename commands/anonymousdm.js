const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('Anonymously DM a member on the server!')
        .addUserOption(option => option.setName('user').setDescription('The user you want to DM.').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message to send.').setRequired(true)),
	async execute(interaction) {
        if (interaction.user.bot) return;
            const message = interaction.options.getString('message');
            if(message.includes('https://') || message.includes('http://') || message.includes('nigg') || message.includes('fag') || message.includes('childp') || message.includes('cp') || message.length > 200){
                const blacklistedEmbed = new MessageEmbed()
                    .setColor('ff0000')
                    .setTitle('Error')
                    .setTimestamp()
                    .setDescription('Message contains blacklisted words and/or links.');
                await interaction.reply({embeds: [blacklistedEmbed], ephemeral: true });
                return;
            };
            const user = interaction.options.getUser('user');
            const sentEmbed = new MessageEmbed()
                .setColor('#000000')
                .setTitle('You`ve been anonymously praised.')
                .addFields({ name: 'The message: ', value: '> ' + message, inline: false})
                .setDescription('')
                .setTimestamp();
            const successEmbed = new MessageEmbed()
                .setColor('#66ff00')
                .setTitle('Success')
                .setDescription('Message sent successfully!');
            try {
                user.send({ embeds:[sentEmbed], ephemeral: true}).then(embedMessage => {embedMessage.react("📧")});	
                interaction.reply({ embeds:[successEmbed], ephemeral: true});
            } catch (err){
                console.log("err")
            };
	},
};