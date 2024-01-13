const { Client, ChatInputCommandInteraction } = require("discord.js");

const { toggleChat } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.chat",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        toggleChat(interaction, client);
    }
}