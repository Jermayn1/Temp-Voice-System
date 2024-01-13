const { Client, ChatInputCommandInteraction } = require("discord.js");
const { toggleLock } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.lock",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        toggleLock(interaction, client);
    }
}