const express = require("express");
const commentsRouter = express.Router();
const Meme = require("../models/memes");

commentsRouter.get("/memes/comments", async (req, res) => {
  try {
    const projection = "_id comments";
    const memes = await Meme.find({})
      .select(projection)
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(memes);
  } catch (err) {
    res.sendStatus(500);
  }
});

commentsRouter.put("/memes/comments/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error("Not Found");
    }

    if (req.body.name === null || req.body.name === "") {
      throw new Error("Bad");
    }
    if (req.body.comment === null || req.body.comment === "") {
      throw new Error("Bad");
    }

    await Meme.updateOne(
      { _id: req.params.id },
      {
        $push: {
          comments: { name: req.body.name, comment: req.body.comment },
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    if (err.message === "Bad") {
      res.sendStatus(400);
    } else if (err.message === "Not Found") {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  }
});

commentsRouter.get("/memes/comments/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error("Not Found");
    }
    res.json({ total: meme.comments.length, comments: meme.comments });
  } catch (err) {
    if (err.message === "Not Found") {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
    
  }
});

module.exports = commentsRouter;
