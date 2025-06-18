require('dotenv').config(); // Load environment variables

const express = require('express');

const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require('mongoose');
const multer = require('multer'); 
const { GridFsStorage } = require('multer-gridfs-storage');


const Grid = require('gridfs-stream');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require("child_process");
const dataRoutes = require('./routes/dataRoutes');

dotenv.config();

// EXPRESS API
const app = express();
app.use(express.static(path.join(__dirname, "dist")))
app.use(express.json());
app.use(cors("*"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("Error: MONGO_URI is not set in .env file");
    process.exit(1);
}

// MONGO CONNECTION
const connection = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop app if DB fails
});



const conn = mongoose.connection; // Use default connection
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("Images");
    console.log("GridFS initialized");
});


// CONFIGURATION FOR IMAGE STORAGE GRIDFS 
const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'Images', // ✅ Fixed casing
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// Routes
app.use('/api/data', dataRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
