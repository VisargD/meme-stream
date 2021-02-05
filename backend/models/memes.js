const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date
    },   
})

memeSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { 
      ret.id = ret._id;
      delete ret.__v;  
      delete ret._id; 
      delete ret.timestamp; 
    }
});

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;