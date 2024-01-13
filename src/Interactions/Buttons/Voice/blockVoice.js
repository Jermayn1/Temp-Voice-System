const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "blockVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        const inputField = new TextInputBuilder()
        .setCustomId('block')
        .setLabel('Username oder Id:')
        .setRequired(true)
        .setPlaceholder('Bitte gib den Username oder die ID des Mitglieds ein.')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1);

        const modalInputRow = new ActionRowBuilder()
        .addComponents(inputField);

        const modal = new ModalBuilder()
        .setCustomId("blockVoice")
        .setTitle("Mitglied Blockieren")
        .addComponents(modalInputRow);

        await interaction.showModal(modal);
    }
}