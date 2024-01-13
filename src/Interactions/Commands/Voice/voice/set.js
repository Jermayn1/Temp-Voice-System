const { PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const guildSettings = require("../../../../Structures/Schemas/guildSettings");

module.exports = {
    subCommand: "voice.set",
    permission: [PermissionFlagsBits.Administrator],
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel");

        let data = await guildSettings.findOne({ Guild: guild.id });
        if (!data) data = await guildSettings.create({
            Guild: guild.id,
            Settings: {
                tempVoiceChannel: channel.id
            }
        });
        else await data.updateOne({ "$set": { "Settings.tempVoiceChannel": channel.id }});

        const response = new EmbedBuilder()
        .setColor(client.config.color.normal)
        .setDescription(`Der Kanal für die Erstellung temporärer Kanäle wurde erfolgreich festgelegt: ${channel}`)

        interaction.reply({ 
            embeds: [response],
            ephemeral: true
        });
    }
}