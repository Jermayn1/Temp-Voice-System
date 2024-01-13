const { PermissionFlagsBits } = require("discord.js");

const { toggleLock } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "lockVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        toggleLock(interaction, client);
    }
}