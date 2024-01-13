const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "friendVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        const inputField = new TextInputBuilder()
        .setCustomId('friend')
        .setLabel("Username oder Id:")
        .setRequired(true)
        .setPlaceholder('Bitte gib den Username oder die ID des Mitglieds ein.')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1);

        const modalInputRow = new ActionRowBuilder()
        .addComponents(inputField);

        const modal = new ModalBuilder()
        .setCustomId("friendVoice")
        .setTitle("Freund Hinzufügen")
        .addComponents(modalInputRow);

        await interaction.showModal(modal);
    }
}