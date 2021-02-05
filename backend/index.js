const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Meme = require('./models/memes');


mongoose.connect('mongodb://localhost:27017/xmeme', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDB connection successfull');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB');
        console.log(err);
    })


app.get('/memes', async (req, res) => {
    const memes = await Meme.find({}).sort({timestamp: -1}).limit(100);    
    res.json(memes);
})

app.get('/memes/:id', async (req, res) => {
    try {
        const meme = await Meme.findById(req.params.id);        
        res.json(meme);        
    } catch(err) {
       res.sendStatus(404);
    }
})

app.listen(8081, () => {
    console.log('Server running on port 8081');
})