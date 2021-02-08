const express = require("express");
const likeDislikeRouter = express.Router();
const Meme = require("../models/memes");


likeDislikeRouter.put("/memes/likes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }

    if (meme.likes.includes(req.body.name)) {
      throw new Error("Duplicate");
    }

    if (req.body.name === null) {
      throw new Error("Bad");
    }

    if (meme.dislikes.includes(req.body.name)) {
      await Meme.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            dislikes: req.body.name,
          },
        }
      );
    }
    await Meme.updateOne(
      { _id: req.params.id },
      {
        $push: {
          likes: req.body.name,
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    if (err.message === "Duplicate") {
      res.send("Already liked by user").status(409);
    } else if (err.message === "Bad") {
      res.sendStatus(400);
    } else {
      res.sendStatus(404);
    }
  }
});

likeDislikeRouter.get("/memes/likes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }
    res.json({ total: meme.likes.length, likedBy: meme.likes });
  } catch (err) {
    res.sendStatus(404);
  }
});

likeDislikeRouter.put("/memes/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error('Meme Not Found');
    }

    if (meme.dislikes.includes(req.body.name)) {
      throw new Error("Duplicate");
    }

    if (req.body.name === null) {
      throw new Error("Bad");
    }

    if (meme.likes.includes(req.body.name)) {
      await Meme.updateOne(
        { _id: req.params.id },
        {
          $pull: {
            likes: req.body.name,
          },
        }
      );
    }

    await Meme.updateOne(
      { _id: req.params.id },
      {
        $push: {
          dislikes: req.body.name,
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    if (err.message === "Duplicate") {
      res.send(409, "Already disliked by user");
    } else if (err.message === "Bad") {
      res.sendStatus(400);
    } else {
      res.sendStatus(404);
    }
  }
});

likeDislikeRouter.get("/memes/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }
    res.json({ total: meme.dislikes.length, dislikedBy: meme.dislikes });
  } catch (err) {
    res.sendStatus(404);
  }
});

module.exports = likeDislikeRouter;