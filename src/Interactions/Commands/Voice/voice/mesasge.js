const { PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const style = require("../../../../Structures/Style/tempVoice");

module.exports = {
    subCommand: "voice.message",
    permission: [PermissionFlagsBits.Administrator],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        try {
        const { channel } = interaction;
        const img = style.getImages();
        const emoji = style.getEmojis();

        const response = new EmbedBuilder()
        .setColor(client.config.color.normal)
        .setDescription("Die Verwaltungsnachricht für deinen temporären Kanal wurde erfolgreich erstellt.");

        const embed = new EmbedBuilder()
        .setColor(client.config.color.normal)
        .setTitle("Personalisiere deinen temporären Channel")
        .setDescription("Mit diesem Embed kannst du ganz einfach deinen temporären Channel bearbeiten. Alternativ kannst du auch die **/voice** Befehlen verwenden.")
        .setImage(img.tempVoiceControl)
        .setFooter({ text: "Nutze die Knöpfe, um Änderungen vorzunehmen." });

        const components = await getComponents(emoji);

        await channel.send({
            embeds: [embed],
            components: components
        });
        interaction.reply({
            embeds: [response], 
            ephemeral: true 
        });
        } catch(err) { console.log(err)}
    }
}

async function getComponents(emoji) {
    // Row 1
    const rename = new ButtonBuilder()
    .setCustomId("renameVoice")
    .setEmoji(emoji.rename)
    .setStyle(ButtonStyle.Secondary);

    const limit = new ButtonBuilder()
    .setCustomId("limitVoice")
    .setEmoji(emoji.limit)
    .setStyle(ButtonStyle.Secondary);

    const lock = new ButtonBuilder()
    .setCustomId("lockVoice")
    .setEmoji(emoji.lock)
    .setStyle(ButtonStyle.Secondary);

    const bitrate = new ButtonBuilder()
    .setCustomId("bitrateVoice")
    .setEmoji(emoji.bitrate)
    .setStyle(ButtonStyle.Secondary);

    const invite = new ButtonBuilder()
    .setCustomId("inviteVoice")
    .setEmoji(emoji.invite)
    .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder()
    .addComponents(rename, limit, lock, bitrate, invite);

    // Row 2
    const friend = new ButtonBuilder()
    .setCustomId("friendVoice")
    .setEmoji(emoji.friend)
    .setStyle(ButtonStyle.Secondary);

    const block = new ButtonBuilder()
    .setCustomId("blockVoice")
    .setEmoji(emoji.block)
    .setStyle(ButtonStyle.Secondary);

    const kick = new ButtonBuilder()
    .setCustomId("kickVoice")
    .setEmoji(emoji.kick)
    .setStyle(ButtonStyle.Secondary);

    const chat = new ButtonBuilder()
    .setCustomId("chatVoice")
    .setEmoji(emoji.chat)
    .setStyle(ButtonStyle.Secondary);

    const del = new ButtonBuilder()
    .setCustomId("deleteVoice")
    .setEmoji(emoji.delete)
    .setStyle(ButtonStyle.Secondary);

    const row2 = new ActionRowBuilder()
    .addComponents(friend, block, kick, chat, del)

    return [row1, row2];
}