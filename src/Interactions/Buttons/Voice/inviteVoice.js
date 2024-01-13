const { PermissionFlagsBits } = require("discord.js");

const { createInvite } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "inviteVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        createInvite(interaction, client);
    }
}