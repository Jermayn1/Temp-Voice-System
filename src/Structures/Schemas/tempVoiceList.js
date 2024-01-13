const { model, Schema } = require("mongoose");

module.exports = model("tempVoiceList", new Schema({
    Guild: String,
    User: String,
    ChannelId: String
}));