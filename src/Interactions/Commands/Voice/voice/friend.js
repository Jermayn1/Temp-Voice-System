const { Client, ChatInputCommandInteraction } = require("discord.js");

const { addFriend } = require("../../../../Structures/Functions/tempVoice");

module.exports = {
    subCommand: "voice.friend",
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = interaction.options.getUser("mitglied");
        addFriend(interaction, client, target);
    }
}