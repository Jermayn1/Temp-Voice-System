const { Client, ChatInputCommandInteraction } = require("discord.js");

const { addBlock } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.block",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = interaction.options.getUser("mitglied");
        addBlock(interaction, client, target);
    }
}