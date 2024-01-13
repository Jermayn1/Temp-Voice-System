const { Client, ChatInputCommandInteraction } = require("discord.js");

const { kickAll } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.kick",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        kickAll(interaction, client);
    }
}