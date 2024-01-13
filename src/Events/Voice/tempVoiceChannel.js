const { Client, VoiceState, ChannelType, PermissionFlagsBits } = require("discord.js");
const GuildSettings = require("../../Structures/Schemas/guildSettings");
const UserSettings = require("../../Structures/Schemas/tempVoiceSettings");
const TempChannels = require("../../Structures/Schemas/tempVoiceList");

module.exports = {
    name: "voiceStateUpdate",
    /**
     * @param {VoiceState} before 
     * @param {VoiceState} after 
     * @param {Client} client 
     * @returns 
     */
    async execute(before, after, client) {
        if(before.channel === after.channel) return;

        const data = await GuildSettings.findOne({ Guild: after.guild.id });
        if(!data || !data.Settings.tempVoiceChannel) return;

        if(after.channel && after.channel == data.Settings.tempVoiceChannel) return joinedChannel(after, client);

        if(before.channel && !after.channel || before.channel !== after.channel) return leftChannel(before, client);
    }
}

async function joinedChannel(after, client) {
    const { guild, member, channel } = after;

    const data = await TempChannels.findOne({ Guild: guild.id, User: member.user.id });

    if (data) try {
        const tmpChannel = await client.channels.cache.get(data.ChannelId);
        if (tmpChannel) return member.voice.setChannel(tmpChannel.id);
        else await TempChannels.deleteOne({ ChannelId: data.ChannelId });
    } catch(error) {
        console.log(`Temp Voice joinedChannel: ${error}`);
    }

    let userData = await UserSettings.findOne({ Guild: guild.id, User: member.user.id });
    if (!userData) userData = await UserSettings.create({ 
        Guild: guild.id, 
        User: member.user.id, 
        Settings: { 
            Name: `${member.nickname || member.displayName}'s Channel`, 
            Limit: 0,
            Bitrate: 64000,
            Locked: false,
            Region: null,
            Chat: false
        },
        Friends: [],
        Blocked: []
    });

    const { Name, Limit, Bitrate, Locked, Region } = userData.Settings;
    const { Friends, Blocked } = userData;
    const { Speak, Connect, SendMessages } = PermissionFlagsBits;

    const channelPerms = [];

    await channelPerms.push({
        id: guild.roles.everyone,
        allow: Locked ? [] : [Speak, Connect, SendMessages],
        deny: Locked ? [Speak, Connect, SendMessages] : []
    }, {
        id: member.user.id,
        allow: [Speak, Connect, SendMessages]
    });

    await Friends.forEach(async (friend) => {
        if(!guild.members.cache.get(friend)) return;
        if(Blocked.includes(friend)) return;
        await channelPerms.push({
            id: friend,
            allow: [Speak, Connect, SendMessages]
        });
    });

    await Blocked.forEach(async (blocked) => {
        if(!guild.members.cache.get(blocked)) return;
        await channelPerms.push({
            id: blocked,
            deny: [Speak, Connect, SendMessages]
        });
    });

    try {
        const tempChannel = await guild.channels.create({
            name: Name,
            type: ChannelType.GuildVoice,
            userLimit: Limit,
            bitrate: Bitrate,
            parent: channel.parent.id,
            rtcRegion: Region || null,
            permissionOverwrites: channelPerms
        });

        member.voice.setChannel(tempChannel.id);
        
        await TempChannels.create({
            Guild: guild.id,
            User: member.user.id,
            ChannelId: tempChannel.id
        });
    } catch (error) {
        console.error(`Temp Voice joinedChannel: ${error}`)
    }
}

async function leftChannel(before, client) {
    let data = await TempChannels.findOne({ Guild: before.guild.id, User: before.member.user.id });

    if (!data) return;

    try {
        const tmpChannel = await client.channels.cache.get(data.ChannelId);
        if (!tmpChannel) return await TempChannels.deleteOne({ ChannelId: data.ChannelId });
        if (tmpChannel.members.size > 0) return;
        await tmpChannel.delete();
        await TempChannels.deleteOne({ ChannelId: data.ChannelId });
    } catch(error) {
        console.log(`Temp Voice leftChannel: ${error}`);
    }
}