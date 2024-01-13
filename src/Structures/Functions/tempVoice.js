const userSettings = require("../Schemas/tempVoiceSettings");
const channelList = require("../Schemas/tempVoiceList")
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Speak, Connect, SendMessages } = PermissionFlagsBits;

const color = require("../../config.json").color;
const img = require("../Style/tempVoice.js").getImages;

async function setName(interaction, client, output) {
    try {
        const { member, guild } = interaction;

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (!output) return errorMessage("umbennen deines Channels", interaction, client, err);

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({ 
            Guild: guild.id, 
            User: member.user.id, 
            Settings: { 
                Name: output || `${member.nickname || member.displayName}'s Channel`, 
                Limit: 0,
                Bitrate: 64000,
                Locked: false,
                Region: null,
                Chat: false
            },
            Friends: [],
            Blocked: []
        }); 
        else if (data.Settings.Name == output) return interaction.reply({
            embeds: [response.setDescription(`Der eingegebene Name entspricht bereits dem aktuellen Namen deines temporären Channels. Bitte gib einen anderen Namen ein.`)],
            ephemeral: true
        });
        else await data.updateOne({ "$set": { "Settings.Name": output }});

        try {
            const chnlData = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            if (chnlData) await guild.channels.cache.get(chnlData.ChannelId).setName(output);
        } catch(x) {  }

        response
        .setDescription(`Du hast deinen Channel erfolgreich in "${output}" umbenannt.`)
        .setImage(img.tempVoiceSuccess); 

        interaction.reply({ embeds: [ response ], ephemeral: true });
    } catch (err) { errorMessage("umbennen deines Channels", interaction, client, err) }
};

async function setLimit(interaction, client, output) {
    try {
        const { member, guild } = interaction;

        const number = parseInt(output);

        if (!number && number !== 0) return errorMessage("limitieren deines Channels", interaction, client);

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (isNaN(number)) return interaction.reply({
            embeds: [ response
                .setDescription(`Die eingegebene Wert (${number}) ist keine gültige Zahl. Bitte gib eine numerische Zahl als Limit für den temporären Channel ein.`)
            ], ephemeral: true
        });

        if (number > 99 || number < 0) return interaction.reply({
            embeds: [ response
                .setDescription(`Die eingegebene Zahl ist zu ${number > 99 ? "groß" : "klein" }. Bitte gib ein Limit ein, das ${number > 99 ? "kleiner" : "größer" } oder gleich dem ${number > 99 ? "maximal" : "minimal" }  zulässigen Wert ist.`)
            ], ephemeral: true
        });

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({ 
            Guild: guild.id, 
            User: member.user.id, 
            Settings: { 
                Name: `${member.nickname || member.displayName}'s Channel`, 
                Limit: number,
                Bitrate: 64000,
                Locked: false,
                Region: null,
                Chat: false
            },
            Friends: [],
            Blocked: []
        }); 
        else if (data.Settings.Limit == number) return interaction.reply({
            embeds: [response.setDescription(`Das eingegebene Limit entspricht bereits dem aktuellen Limit deines temporären Channels. Bitte gib ein anderes Limit ein.`)],
            ephemeral: true
        });
        else await data.updateOne({ "$set": { "Settings.Limit": number }});

        try {
            const chnlData = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            if (chnlData) await guild.channels.cache.get(chnlData.ChannelId).setUserLimit(number);
        } catch(x) {  }

        response
        .setDescription(`Das Limit für deinen temporären Channel wurde erfolgreich auf ${number} gesetzt.`)
        .setImage(img.tempVoiceSuccess);

        interaction.reply({ embeds: [ response ], ephemeral: true });
    } catch (err) { errorMessage("limitieren deines Channels", interaction, client, err) }
}

async function toggleLock(interaction, client) {
    try {
        const { member, guild } = interaction;

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({ 
            Guild: guild.id, 
            User: member.user.id, 
            Settings: { 
                Name: `${member.nickname || member.displayName}'s Channel`, 
                Limit: 0,
                Bitrate: 64000,
                Locked: true,
                Region: null,
                Chat: false
            },
            Friends: [],
            Blocked: []
        });
        else await data.updateOne({ "$set": { "Settings.Locked": data.Settings.Locked == true ? false : true }});
        
        try {
            let c = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            const channel = await client.channels.cache.get(c.ChannelId);

            const { Friends, Blocked } = data;
            const channelPerms = [];

            if (data.Settings.Locked) channelPerms.push({
                id: guild.roles.everyone,
                deny: [Speak, Connect, SendMessages]
            }); else channelPerms.push({
                id: guild.roles.everyone,
                allow: [Speak, Connect, SendMessages]
            });

            channelPerms.push({
                id: member.user.id,
                allow: [Speak, Connect, SendMessages]
            });

            Friends.forEach(async (friend) => {
                if(!guild.members.cache.get(friend)) return;
                if(Blocked.includes(friend)) return;
                channelPerms.push({
                    id: friend,
                    allow: [Speak, Connect, SendMessages]
                });
            });
        
            Blocked.forEach(async (blocked) => {
                if(!guild.members.cache.get(blocked)) return;
                channelPerms.push({
                    id: blocked,
                    deny: [Speak, Connect, SendMessages]
                });
            });

            await channel.permissionOverwrites.set(channelPerms);
        } catch(x) {  }


        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceSuccess)
        .setDescription(`Dein Channel wurde erfolgreich ${data.Settings.Locked ? "gesperrt" : "entsperrt"}. Andere Mitglieder ${data.Settings.Locked ? "haben nun keine Zugriffsberechtigung mehr" : "können nun wieder darauf zugreifen" }.`);

        interaction.reply({
            embeds: [ response ],
            ephemeral: true
        });
    } catch(err) { errorMessage("sperren/entsperrt deines Channels", interaction, client, err) }
}

async function setBitrate(interaction, client, output) {
    try {
        const { member, guild } = interaction;

        const bitrate = parseInt(output);

        if (!bitrate) return errorMessage("ändern der Bitrate deines Channels", interaction, client);

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (isNaN(bitrate)) return interaction.reply({
            embeds: [ response
                .setDescription(`Die eingegebene Wert (${bitrate}) ist keine gültige Zahl. Bitte gib eine numerische Zahl als Bitrate für den temporären Channel ein.`)
            ], ephemeral: true
        });

        if (bitrate > 96 || bitrate < 8) return interaction.reply({
            embeds: [ response
                .setDescription(`Die eingegebene Zahl ist zu ${bitrate > 96 ? "groß" : "klein" }. Bitte gib eine Bitrate ein, welche ${bitrate > 96 ? "kleiner" : "größer" } oder gleich dem ${bitrate > 96 ? "maximal" : "minimal" }  zulässigen Wert ist.`)
            ], ephemeral: true
        });

        const longBitrate = bitrate * 1000;

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({ 
            Guild: guild.id, 
            User: member.user.id, 
            Settings: { 
                Name: `${member.nickname || member.displayName}'s Channel`, 
                Limit: 0,
                Bitrate: longBitrate,
                Locked: false,
                Region: null,
                Chat: false
            },
            Friends: [],
            Blocked: []
        }); 
        else if (data.Settings.Bitrate == longBitrate) return interaction.reply({
            embeds: [response.setDescription(`Die eingegebene Bitrate entspricht bereits der aktuellen Bitrate deines temporären Channels. Bitte gib ein andere Bitrate ein.`)],
            ephemeral: true
        });
        else await data.updateOne({ "$set": { "Settings.Bitrate": longBitrate }});

        try {
            const chnlData = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            if (chnlData) await guild.channels.cache.get(chnlData.ChannelId).setBitrate(longBitrate);
        } catch(x) {  }

        response
        .setDescription(`Die Bitrate für deinen temporären Channel wurde erfolgreich auf ${bitrate}kbps gesetzt.`)
        .setImage(img.tempVoiceSuccess);

        interaction.reply({ embeds: [ response ], ephemeral: true });

    } catch (err) { errorMessage("ändern der Bitrate deines Channels", interaction, client, err) }
}

async function createInvite(interaction, client) {
    try {
        const { member, guild } = interaction;
        
        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution)
        .setDescription("Du musst in deinen temporären Channel sein, um eine Einladungsnachricht zu erstellen.");

        let isChannel = false;
        let voiceLink;
        try {
            let data = await channelList.findOne({ Guild: guild.id, User: member.user.id, ChannelId: member.voice.channel.id });
            const channel = client.channels.cache.get(data.ChannelId);
            voiceLink = await channel.createInvite({
                maxAge: 0,
                maxUses: 0
            });
            if (data && channel) isChannel = true;
        } catch (x) {  }

        if (!isChannel) return interaction.reply({ embeds: [response], ephemeral: true });

        voiceLink = voiceLink.url;
        let msgContent = `>>> **Einladung zum Voice-Channel:**\n\nHey! Ich habe einen Voice-Channel auf dem ${guild.name} Server erstellt und lade dich herzlich ein, daran teilzunehmen.\n\nKlicke auf den folgenden Link, um beizutreten:\n${voiceLink}\n\nIch freue mich drauf dich, dort zu sehen!`

        response
        .setDescription(`Die Einladungsnachricht für deinen temporären Channel wurde erfolgreich erstellt.\n\nKopiere die unten stehende Nachricht aus dem Codeblock und sende sie an deine Freunde.`)
        .setImage(img.tempVoiceSuccess);

        const copyEmbed = new EmbedBuilder()
        .setColor(color.normal)
        .setDescription("```\n" + msgContent + "\n```");

        interaction.reply({ embeds: [ response, copyEmbed ], ephemeral: true });

    } catch (err) { errorMessage("erstellen deiner Einladungsnachricht", interaction, client, err) }
}

async function addFriend(interaction, client, target) {
    try {
        const { member, guild } = interaction;

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (target.id) target = target.id;

        let user;
        let removed = false;

        try {
            user = guild.members.cache.get(target);
            if (!user) {
                let u = await guild.members.search({ limit: 1, query: target});
                user = guild.members.cache.get(u.firstKey())
            }
        } catch (x) {  }

        if (!user) return interaction.reply({ embeds: [ response.setDescription(`Ich konnte keinen User mit dem Name/Id ${target} finden.`) ], ephemeral: true });

        let userId = user.id;

        if (userId == interaction.user.id) return interaction.reply({ embeds: [ response.setDescription(`Du kannst dich nicht selbst zu deiner Freundesliste hinzufügen.`) ], ephemeral: true });

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({
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
            Friends: [`${userId}`],
            Blocked: []
        });
        else if (data.Blocked.includes(`${userId}`)) return interaction.reply({ embeds: [ response.setDescription(`Du kannst ${user} nicht als Freund hinzufügen, da du ihn blockiert hast.`) ], ephemeral: true });
        else if (data.Friends.includes(`${userId}`)) { await data.updateOne({ "$pull": { "Friends": userId }}); removed = !removed }
        else await data.updateOne({ "$push": { "Friends": userId }});

        try {
            let c = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            const channel = client.channels.cache.get(c.ChannelId);

            data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });

            const { Friends, Blocked } = data;
            const channelPerms = [];

            if (data.Settings.Locked) channelPerms.push({
                id: guild.roles.everyone,
                deny: [Speak, Connect, SendMessages]
            }); else channelPerms.push({
                id: guild.roles.everyone,
                allow: [Speak, Connect, SendMessages]
            });

            channelPerms.push({
                id: member.user.id,
                allow: [Speak, Connect, SendMessages]
            });

            Friends.forEach(async (friend) => {
                if(!guild.members.cache.get(friend)) return;
                if(Blocked.includes(friend)) return;
                channelPerms.push({
                    id: friend,
                    allow: [Speak, Connect, SendMessages]
                });
            });
        
            Blocked.forEach(async (blocked) => {
                if(!guild.members.cache.get(blocked)) return;
                channelPerms.push({
                    id: blocked,
                    deny: [Speak, Connect, SendMessages]
                });
            });

            await channel.permissionOverwrites.set(channelPerms);
        } catch(x) {  }

        response
        .setImage(img.tempVoiceSuccess)
        .setDescription(removed ? `${user} wurde erfolgreich aus deiner Freundesliste entfernt.` : `${user} wurde erfolgreich zu deiner Freundesliste hinzugefügt.`);

        interaction.reply({ embeds: [ response ], ephemeral: true });
    } catch (err) { errorMessage("hinzufügen eines Freundes", interaction, client, err) }
}

async function addBlock(interaction, client, target) {
    try {
        const { member, guild } = interaction;

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (target.id) target = target.id;

        let user;
        let removed = false;

        try {
            user = guild.members.cache.get(target);
            if (!user) {
                let u = await guild.members.search({ limit: 1, query: target});
                user = guild.members.cache.get(u.firstKey())
            }
        } catch (x) {  }

        if (!user) return interaction.reply({ embeds: [ response.setDescription(`Ich konnte keinen User mit dem Name/Id ${target} finden.`) ], ephemeral: true });

        let userId = user.id;

        if (userId == interaction.user.id) return interaction.reply({ embeds: [ response.setDescription(`Du kannst dich nicht selbst blockieren.`) ], ephemeral: true });

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({
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
            Blocked: [`${userId}`]
        });
        else if (data.Friends.includes(`${userId}`)) return interaction.reply({ embeds: [ response.setDescription(`Du kannst ${user} nicht blockieren, da du mit ihm befreundet bist.`) ], ephemeral: true });
        else if (data.Blocked.includes(`${userId}`)) { await data.updateOne({ "$pull": { "Blocked": userId }}); removed = !removed }
        else await data.updateOne({ "$push": { "Blocked": userId }});

        try {
            let c = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            const channel = client.channels.cache.get(c.ChannelId);

            data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });

            const { Friends, Blocked } = data;
            const channelPerms = [];

            if (data.Settings.Locked) channelPerms.push({
                id: guild.roles.everyone,
                deny: [Speak, Connect, SendMessages]
            }); else channelPerms.push({
                id: guild.roles.everyone,
                allow: [Speak, Connect, SendMessages]
            });

            channelPerms.push({
                id: member.user.id,
                allow: [Speak, Connect, SendMessages]
            });

            Friends.forEach(async (friend) => {
                if(!guild.members.cache.get(friend)) return;
                if(Blocked.includes(friend)) return;
                channelPerms.push({
                    id: friend,
                    allow: [Speak, Connect, SendMessages]
                });
            });
        
            Blocked.forEach(async (blocked) => {
                if(!guild.members.cache.get(blocked)) return;
                channelPerms.push({
                    id: blocked,
                    deny: [Speak, Connect, SendMessages]
                });
            });

            await channel.permissionOverwrites.set(channelPerms);
        } catch(x) {  }

        response
        .setImage(img.tempVoiceSuccess)
        .setDescription(removed ? `${user} wurde erfolgreich entblockiert.` : `${user} wurde erfolgreich blockiert.`);

        interaction.reply({ embeds: [ response ], ephemeral: true });
    } catch (err) { errorMessage("blockieren eines Mitglieds", interaction, client, err) }
}

async function kickAll(interaction, client) {
    try {
        const { member, guild } = interaction;
        
        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution);

        if (!member.voice) return interaction.reply({ embeds: [ response.setDescription("Du befindest dich nicht in deinem temporären Voice-Channel.") ], ephemeral: true });

        let data = await channelList.findOne({ Guild: guild.id, User: member.user.id, ChannelId: member.voice.channel.id });
        if (!data) return interaction.reply({ embeds: [ response.setDescription("Du befindest dich nicht in deinem temporären Voice-Channel.") ], ephemeral: true });

        const channel = await client.channels.cache.get(data.ChannelId);
        if (!channel) return interaction.reply({ embeds: [ response.setDescription("Du befindest dich nicht in deinem temporären Voice-Channel.") ], ephemeral: true });

        if (channel.id != member.voice.channel.id) return interaction.reply({ embeds: [ response.setDescription("Du befindest dich nicht in deinem temporären Voice-Channel.") ], ephemeral: true });

        let settings = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!settings) settings = await userSettings.create({ 
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

        const Friends = settings.Friends;

        await channel.members.forEach(async (m) => {
            try {
                console.log(m)
                if (m.user.id == member.user.id) return;
                if (Friends.includes(m.user.id)) return;
                m.voice.disconnect();
            } catch (x) { console.log(x) }
        });

        response
        .setImage(img.tempVoiceSuccess)
        .setDescription(`Alle Mitglieder wurden erfolgreich aus deinem temporären Voice-Channel getrennt.`);

        interaction.reply({ embeds: [ response ], ephemeral: true });

    } catch (err) { errorMessage("kicken aller Mitglieder", interaction, client, err) }
}

async function toggleChat(interaction, client) {
    try {
        const { member, guild } = interaction;

        let data = await userSettings.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return data = await userSettings.create({ 
            Guild: guild.id, 
            User: member.user.id, 
            Settings: { 
                Name: `${member.nickname || member.displayName}'s Channel`, 
                Limit: 0,
                Bitrate: 64000,
                Locked: true,
                Region: null,
                Chat: false
            },
            Friends: [],
            Blocked: []
        });
        else await data.updateOne({ "$set": { "Settings.Chat": data.Settings.Chat == true ? false : true }});
        
        try {
            let c = await channelList.findOne({ Guild: guild.id, User: member.user.id });
            const channel = await client.channels.cache.get(c.ChannelId);

            const { Friends, Blocked } = data;
            const channelPerms = [];

            if (data.Settings.Locked) channelPerms.push({
                id: guild.roles.everyone,
                deny: [Speak, Connect, SendMessages]
            }); else channelPerms.push({
                id: guild.roles.everyone,
                allow: [Speak, Connect, SendMessages]
            });

            channelPerms.push({
                id: member.user.id,
                allow: [Speak, Connect, SendMessages]
            });

            Friends.forEach(async (friend) => {
                if(!guild.members.cache.get(friend)) return;
                if(Blocked.includes(friend)) return;
                channelPerms.push({
                    id: friend,
                    allow: [Speak, Connect, SendMessages]
                });
            });
        
            Blocked.forEach(async (blocked) => {
                if(!guild.members.cache.get(blocked)) return;
                channelPerms.push({
                    id: blocked,
                    deny: [Speak, Connect, SendMessages]
                });
            });

            await channel.permissionOverwrites.set(channelPerms);
        } catch(x) {  }


        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceSuccess)
        .setDescription(`Der Chat wurde erfolgreich ${data.Settings.Chat ? "gesperrt" : "entsperrt"}. Andere Mitglieder ${data.Settings.Chat ? "haben nun keine Zugriffsberechtigung mehr" : "können nun wieder darauf zugreifen" }.`);

        interaction.reply({
            embeds: [ response ],
            ephemeral: true
        });
    } catch(err) { errorMessage("sperren/entsperrt des Chats", interaction, client, err) }
}

async function deleteChannel(interaction, client) {
    try {
        const { member, guild } = interaction;

        const response = new EmbedBuilder()
        .setColor(color.normal)
        .setImage(img.tempVoiceCaution)
        .setDescription("Du befindest dich nicht in deinem temporären Voice-Channel.");

        if (!member.voice) return interaction.reply({ embeds: [response], ephemeral: true });

        let data = await channelList.findOne({ Guild: guild.id, User: member.user.id });
        if (!data) return interaction.reply({ embeds: [response], ephemeral: true });

        const channel = await client.channels.cache.get(data.ChannelId);
        if (!channel) return interaction.reply({ embeds: [response], ephemeral: true});

        if (channel.id != member.voice.channel.id) return interaction.reply({ embeds: [response], ephemeral: true });

        await channel.delete();
        await channelList.deleteOne({ ChannelId: data.ChannelId });

        response
        .setImage(img.tempVoiceSuccess)
        .setDescription(`Dein temporärer Voice-Channel wurde erfolgreich gelöscht.`);

        interaction.reply({ embeds: [response], ephemeral: true });

    } catch (err) { errorMessage("löschen deines Channels", interaction, client, err) }
}

module.exports = { setName, setLimit, toggleLock, setBitrate, createInvite, addFriend, addBlock, kickAll, toggleChat, deleteChannel };

async function errorMessage(str, interaction, client, err) {
    const reponse = new EmbedBuilder()
    .setColor(color.normal)
    .setDescription(`Etwas ist schief gelaufen beim ${str}.`)
    .setImage(img.tempVoiceCaution);

    interaction.reply({ embeds: [reponse], ephemeral: true });
}