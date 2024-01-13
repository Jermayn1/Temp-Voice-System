const { PermissionFlagsBits, ModalSubmitInteraction, Client } = require("discord.js");
const { addBlock } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "blockVoice",
    permission: PermissionFlagsBits.Speak,
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = interaction.fields.getField("block").value;

        addBlock(interaction, client, target);
    }
}