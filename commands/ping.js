const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        if (interaction.user.id != '159930767533670400'){
            await interaction.reply({ content: 'You may not run this command.', ephemeral: true });
            return;
        };
		await interaction.reply('Pong!');
	},
};