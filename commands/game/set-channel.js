const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Sets the channel for counting."),
    async execute(interaction) {
        const channel = interaction.channel;
        await interaction.client.channels.cache.set(
            "counting-channel",
            channel.id
        );
        await interaction.reply(`Counting channel set to ${channel}.`);
    },
};
