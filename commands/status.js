const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with the status of the bot.'),
	async execute(interaction) {
		await interaction.reply('Bot seems to be functioning normally.');
	},
};