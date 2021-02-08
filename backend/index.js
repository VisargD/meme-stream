const express = require("express");
const app = express();
const mongoose = require("mongoose");
const memesRouter = require("./routes/memes");
const likeDislikeRouter = require("./routes/likeDislike");

// MongoDB connection establishment
mongoose
  .connect("mongodb://localhost:27017/xmeme", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection successfull");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(memesRouter);
app.use(likeDislikeRouter);

// Starting server at port 8081
app.listen(8081, () => {
  console.log("Server running on port 8081");
});
