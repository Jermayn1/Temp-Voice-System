const { PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    id: "bitrateVoice",
    permission: PermissionFlagsBits.Speak,
    async execute(interaction, client) {
        const inputField = new TextInputBuilder()
        .setCustomId('bitrate')
        .setLabel("Neue Bitrate:")
        .setRequired(true)
        .setPlaceholder("Gib eine Zahl zwischen 8 und 96 ein.")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1);

        const modalInputRow = new ActionRowBuilder()
        .addComponents(inputField);

        const modal = new ModalBuilder()
        .setCustomId("bitrateVoice")
        .setTitle("Channel Bitrate")
        .addComponents(modalInputRow);

        await interaction.showModal(modal);
    }
}