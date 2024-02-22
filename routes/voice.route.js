const express = require('express');
const voiceRouter = express.Router();
const VoiceModel = require('../models/voice.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {auth} = require("../middlewares/auth");


voiceRouter.get("/", auth, async (req, res) => {
    try {
        const voices = await VoiceModel.find();

        if (!voices || voices.length === 0) {
            return res.status(404).json({ message: 'No voices found' });
        }

        res.status(200).json({ voices });
    } catch (error) {
        console.error('Error fetching voices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create a Multer instance
const upload = multer({ storage: storage });

voiceRouter.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const uploadedAudio = req.file;
        const audioUrl = `${req.protocol}://${req.get('host')}/audio/${uploadedAudio.filename}`;
        console.log(audioUrl);

        const newVoice = new VoiceModel({
            title: req.body.title,
            source: audioUrl,
            duration: req.body.duration
        });
        await newVoice.save();
        res.status(200).json({ url: newVoice });
    } catch (error) {
        console.error('Error uploading voice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

voiceRouter.get('/audio/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    console.log(filePath);
    console.log("audio is playing");
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Audio file not found.' });
        }

        res.sendFile(filePath);
    });
});


module.exports = voiceRouter;