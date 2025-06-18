const express = require('express');
const multer = require('multer');  // Import multer
const Note = require('../models/Notes');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');

const router = express.Router();

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
}
const mongo = process.env.MONGO_URI;
// Multer configuration for file storage using GridFS
const storage = new GridFsStorage({
    url: mongo,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = Date.now() + '-' + file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'Images', // Collection name in GridFS
            };
            resolve(fileInfo);
        });
    }
});
let gfs;
mongoose.connection.once('open', () => {
    gfs = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'Images'  // Ensure this matches the bucket used in GridFSStorage
    });
    console.log('✅ GridFS initialized');
});

const ImageUpload = multer({ storage }); // ✅ Defined ImageUpload
router.post('/save', ImageUpload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    if (mongoose.connection.readyState !== 1) {  // Check if MongoDB is connected
        return res.status(500).json({ error: 'Database is not connected' });
    }

    try {
        const newNote = new Note({
            noteName: req.body.noteName,
            user: req.body.user,
            imageName: req.file.filename,
            extractText: req.body.extractText,
            cleanedText: req.body.cleanedText,
            time: new Date()
        });

        await newNote.save();
        res.status(200).json({ message: "File uploaded successfully", file: req.file });
    } catch (error) {
        res.status(500).json({ error: 'Error while saving the file', details: error.message });
    }
});

router.get('/files', async (req, res) => {
    try {
        if (!gfs) {
            return res.status(500).json({ error: 'GridFS is not initialized yet' });
        }

        const cursor = gfs.find({});
        const files = await cursor.toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files found' });
        }

        res.status(200).json(files.map(file => ({
            filename: file.filename,
            contentType: file.contentType,
            uploadDate: file.uploadDate
        })));
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: 'Error fetching files', details: error.message });
    }
});


router.get('/file/:filename', async (req, res) => {
    try {
        if (!gfs) {
            return res.status(500).json({ error: 'GridFS is not initialized yet' });
        }

        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        res.set('Content-Type', file[0].contentType);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'Error fetching file', details: error.message });
    }
});

module.exports = router;
