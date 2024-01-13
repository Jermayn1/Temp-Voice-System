const { PermissionFlagsBits, ModalSubmitInteraction, Client } = require("discord.js");
const { addFriend } = require("../../../Structures/Functions/tempVoice");

module.exports = {
    id: "friendVoice",
    permission: PermissionFlagsBits.Speak,
    /**
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const target = interaction.fields.getField("friend").value;

        addFriend(interaction, client, target);
    }
}