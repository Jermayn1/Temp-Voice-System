const { Client, ChatInputCommandInteraction } = require("discord.js");

const { setBitrate } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.bitrate",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.options.getInteger("bitrate");

        setBitrate(interaction, client, output);
    }
}