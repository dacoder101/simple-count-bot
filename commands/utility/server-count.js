const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-count")
        .setDescription("Replies with the number of servers the bot is in."),
    async execute(interaction) {
        const serverCount = interaction.client.guilds.cache.size;
        await interaction.reply(
            `count bot is in ${serverCount} ${
                serverCount === 1 ? "server" : "servers"
            }.`
        );
    },
};
