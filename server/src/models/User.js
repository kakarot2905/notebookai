const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    user:{type:String},
    password:{type:String},
    
})

const Note = mongoose.model('Note', noteschema)