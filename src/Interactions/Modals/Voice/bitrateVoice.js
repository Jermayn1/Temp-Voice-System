const { PermissionFlagsBits, ModalSubmitInteraction, Client } = require("discord.js");
const { setBitrate } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "bitrateVoice",
    permission: PermissionFlagsBits.Speak,
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.fields.getField("bitrate").value;

        setBitrate(interaction, client, output);
    }
}