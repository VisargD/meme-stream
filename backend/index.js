const express = require("express");
const app = express();
const mongoose = require("mongoose");
const memesRouter = require("./routes/memes");
const likeDislikeRouter = require("./routes/likeDislike");
const commentsRouter = require("./routes/comments");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
app.use(commentsRouter);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Xmeme API",
      description:
        "Xmeme API can be used to perform various operations like posting, liking/disliking, commenting, fetching Meme Posts",
      contact: {
        name: "Visarg Desai",
      },
    },
    servers: [
      {
        url: "http://localhost:8081",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/memes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  next(res.sendStatus(404));
});

// Starting server at port 8081
app.listen(8081, () => {
  console.log("Server running on port 8081");
});
