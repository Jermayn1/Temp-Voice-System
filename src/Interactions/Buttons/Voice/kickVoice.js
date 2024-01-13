const { PermissionFlagsBits } = require("discord.js");

const { kickAll } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "kickVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        kickAll(interaction, client)
    }
}