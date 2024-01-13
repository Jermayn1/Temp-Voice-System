const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("voice")
    .setDescription("Alle Befehle für das temporäre Channel-System.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Speak)
    .addSubcommand(subCommand => subCommand
        .setName("set")
        .setDescription("Legt den Channel fest, der zur Erstellung der temporären Kanäle verwendet wird.")
        .addChannelOption((channel) => channel
            .setName("channel")
            .setDescription("Bitte wähle einen geeigneten Kanal aus, der für temporäre Channel bestimmt ist.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)
        )
    ).addSubcommand(subCommand => subCommand
        .setName("message")
        .setDescription("Sendet eine Nachricht, mit der Benutzer ihren eigenen temporären Kanal einfach einstellen können.")
    ).addSubcommand((subCommand) => subCommand
        .setName("name")
        .setDescription("Ändert den Namen deines temporären Voice-Channels.")
        .addStringOption((string) => string
            .setName("name")
            .setDescription("Gib den neuen Namen für deinen temporären Channel ein.")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(99)
        )
    ).addSubcommand((subCommand) => subCommand
        .setName("limit")
        .setDescription("Ändert das Limit deines temporären Voice-Channels.")
        .addIntegerOption((integer) => integer
            .setName("limit")
            .setDescription("Gib das neue Limit für deinen temporären Channel ein.")
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(99)
        )
    ).addSubcommand((subCommand) => subCommand
        .setName("lock")
        .setDescription("Sperrt oder entsperrt deinen temporären Voice-Channel.")
    ).addSubcommand((subCommand) => subCommand
        .setName("bitrate")
    .setDescription("Ändert die Bitrate deines temporären Voice-Channels.")
        .addIntegerOption((integer) => integer
            .setName("bitrate")
            .setDescription("Gib die neue Bitrate für deinen temporären Channel ein.")
            .setRequired(true)
            .setMinValue(8)
            .setMaxValue(96)
        )
    ).addSubcommand((subCommand) => subCommand
        .setName("invite")
        .setDescription("Erstellt eine Einladungsnachricht für deinen Voice-Channel.")
    ).addSubcommand((subCommand) => subCommand
        .setName("friend")
        .setDescription("Fügt ein Mitglied deiner Freundesliste hinzu und gewährt ihm Zugriff auf deinen temporären Channel.")
        .addUserOption((user) => user
            .setName("mitglied")
            .setDescription("Wähle das Mitglied aus, das du als Freund hinzufügen möchtest.")
            .setRequired(true)
        )
    ).addSubcommand((subCommand) => subCommand
        .setName("block")
        .setDescription("Fügt ein Mitglied deiner Blockliste hinzu und verhindert den Zugriff auf deinen temporären Channel.")
        .addUserOption((user) => user
            .setName("mitglied")
            .setDescription("Wähle das Mitglied aus, das du blockieren möchtest.")
            .setRequired(true)
        )
    ).addSubcommand((subCommand) => subCommand
        .setName("kick")
        .setDescription("Entferne alle Mitglieder außer deine Freunde aus deinem temporären Channel.")
    ).addSubcommand((subCommand) => subCommand
        .setName("chat")
        .setDescription("Sperrt oder entsperrt den Chat in deinem temporären Channel.")
    ).addSubcommand((subCommand) => subCommand
        .setName("delete")
        .setDescription("Löscht deinen temporären Channel.")
    )
}