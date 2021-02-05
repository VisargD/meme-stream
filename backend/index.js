const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/xmeme', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('MongoDB connection successfull');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB');
        console.log(err);
    })


app.listen(8081, () => {
    console.log('Server running on port 8081');
})