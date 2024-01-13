const { PermissionFlagsBits, ModalSubmitInteraction, Client } = require("discord.js");
const { setName } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "renameVoice",
    permission: PermissionFlagsBits.Speak,
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const output = interaction.fields.getField("rename").value;

        setName(interaction, client, output);
    }
}