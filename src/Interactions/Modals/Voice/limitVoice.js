const { PermissionFlagsBits, ModalSubmitInteraction, Client } = require("discord.js");
const { setLimit } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "limitVoice",
    permission: PermissionFlagsBits.Speak,
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.fields.getField("limit").value;

        setLimit(interaction, client, output);
    }
}