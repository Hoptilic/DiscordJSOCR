const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with the status of the bot.'),
	async execute(interaction) {
        if (interaction.user.id != '159930767533670400'){
            await interaction.reply({ content: 'You may not run this command.', ephemeral: true });
            return;
        };
		await interaction.reply('Bot seems to be functioning normally.');
	},
};