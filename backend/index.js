if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const memesRouter = require("./routes/memes");
const likeDislikeRouter = require("./routes/likeDislike");
const commentsRouter = require("./routes/comments");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/xmeme";
const port = process.env.PORT || 8081;

// MongoDB connection establishment
mongoose
  .connect(dbUrl, {
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

// Allow Cross Origin Request
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get("/", (req, res) => {
  res.redirect("/swagger-ui");
});

app.use(memesRouter); // Routes for /memes
app.use(likeDislikeRouter); // Routes for /likes and /dislikes
app.use(commentsRouter); // Routes for /comments

app.use((req, res, next) => {
  next(res.sendStatus(404));
});

// Starting server at port 8081
app.listen(port, () => {
  console.log("Server running on port 8081");
});
