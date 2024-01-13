const { Client, ChatInputCommandInteraction } = require("discord.js");

const { deleteChannel } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.delete",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        deleteChannel(interaction, client);
    }
}