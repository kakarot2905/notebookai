const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    noteName: {type:String},
    user: { type: String },
    imageName: {type:String},
    extractText: {type:String},
    cleanedText: {type:String},
    time: {type:Date},
    
})

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;