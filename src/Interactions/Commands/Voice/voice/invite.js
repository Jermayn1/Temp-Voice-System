const { Client, ChatInputCommandInteraction } = require("discord.js");

const { createInvite } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.invite",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        createInvite(interaction, client);
    }
}