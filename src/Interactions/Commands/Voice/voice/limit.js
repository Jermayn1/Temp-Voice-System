const { Client, ChatInputCommandInteraction } = require("discord.js");

const { setLimit } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.limit",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.options.getInteger("limit");

        setLimit(interaction, client, output);
    }
}