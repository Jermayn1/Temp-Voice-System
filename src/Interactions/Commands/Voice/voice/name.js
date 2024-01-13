const { Client, ChatInputCommandInteraction } = require("discord.js");

const { setName } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.name",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.options.getString("name");

        setName(interaction, client, output);
    }
}