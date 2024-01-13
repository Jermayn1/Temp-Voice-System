const { PermissionFlagsBits } = require("discord.js");

const { toggleChat } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "chatVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        toggleChat(interaction, client);
    }
}