function getImages() {
    const img = {
        tempVoiceControl: "https://raw.githubusercontent.com/Jermayn1/Assets-Husky-Bot/main/voice_options.png",
        tempVoiceSuccess: "https://raw.githubusercontent.com/Jermayn1/Assets-Husky-Bot/main/tempVoice%20Assets/success_spacer.png",
        tempVoiceCaution: "https://raw.githubusercontent.com/Jermayn1/Assets-Husky-Bot/main/tempVoice%20Assets/caution_spacer.png",
    };

    return img;
}

function getEmojis() {
    const emoji = {
        rename: "<:umbennen:1132778181661839501>",
        limit: "<:limitieren:1132777891290157056>",
        lock: "<:speeren:1132777896679837897>",
        bitrate: "<:bitrate:1132777879810351238>",
        invite: "<:einladen:1132777884264710335>",
        friend: "<:befreunden:1132777878933753926>",
        block: "<:blockieren:1132777882326945794>",
        kick: "<:kick:1132777890132545627>",
        chat: "<:thread:1132778258149158944>",
        delete: "<:lschen:1132777892133228546>"
    };

    return emoji;
}

module.exports = { getImages, getEmojis }