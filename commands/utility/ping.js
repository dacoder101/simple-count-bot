const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the bot's ping."),
    async execute(interaction) {
        const sent = await interaction.reply({
            content: "Pinging...",
            fetchReply: true,
        });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! Responded in ${timeDiff}ms`);
    },
};
