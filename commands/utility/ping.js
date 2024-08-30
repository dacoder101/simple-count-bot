const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("tells you thomas is gay and how bad your internet is"),
    async execute(interaction) {
        await interaction.reply(
            "thomas is gay. your ping is " +
                (Date.now() - interaction.createdTimestamp) +
                "ms, your probably using a potato as a router"
        );
    },
};
