const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "limitVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        const inputField = new TextInputBuilder()
        .setCustomId('limit')
        .setLabel("Neues Channel Limit:")
        .setRequired(true)
        .setPlaceholder("Gib eine Zahl zwischen 0 und 99 ein.")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(99);

        const modalInputRow = new ActionRowBuilder()
        .addComponents(inputField);

        const modal = new ModalBuilder()
        .setCustomId("limitVoice")
        .setTitle("Channel Limit")
        .addComponents(modalInputRow);

        await interaction.showModal(modal);
    }
}