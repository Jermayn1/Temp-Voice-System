const { PermissionFlagsBits } = require("discord.js");

const { deleteChannel } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "deleteVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        deleteChannel(interaction, client);
    }
}