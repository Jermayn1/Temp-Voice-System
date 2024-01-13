const { model, Schema } = require("mongoose");

module.exports = model("tempVoiceSettings", new Schema({
    Guild: String,
    User: String,
    Settings: Object,
    Friends: Array,
    Blocked: Array
}));