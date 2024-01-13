const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "renameVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        const inputField = new TextInputBuilder()
        .setCustomId('rename')
        .setLabel("Neuer Channel Name:")
        .setRequired(true)
        .setPlaceholder("")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(99);

        const modalInputRow = new ActionRowBuilder()
        .addComponents(inputField);

        const modal = new ModalBuilder()
        .setCustomId("renameVoice")
        .setTitle("Channel Umbennen")
        .addComponents(modalInputRow);

        await interaction.showModal(modal);
    }
}