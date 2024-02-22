const mongoose = require('mongoose');

const voiceSchema = mongoose.Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now } 
}, { timestamps: true });

const VoiceModel = mongoose.model('Voice', voiceSchema);

module.exports = VoiceModel;
