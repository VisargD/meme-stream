const express = require("express");
const memesRouter = express.Router();
const Meme = require("../models/memes");

// Get 100 memes in reverse chronological order (Newest First)
memesRouter.get("/memes", async (req, res) => {
  const projection = '_id name url caption'
  const memes = await Meme.find().select(projection).sort({ timestamp: -1 }).limit(100);
  res.json(memes);
});

// Get Meme Post by ID
memesRouter.get("/memes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }
    res.json(meme);
  } catch (err) {
    res.sendStatus(404);
  }
});

// Post a new meme with caption and URL
memesRouter.post("/memes", async (req, res) => {
  try {
    const found = await Meme.find({
      $and: [
        { name: req.body.name },
        { url: req.body.url },
        { caption: req.body.caption },
      ],
    });
    if (found.length === 0) {
      const meme = new Meme({
        ...req.body,
        timestamp: new Date(),
        likes: [],
        dislikes: [],
        comments: [],
      });
      await meme.save();
      res.json({ id: meme._id });
    } else {
      throw new Error();
    }
  } catch (e) {
    res.sendStatus(409);
  }
});

// Delete a meme post by its ID
memesRouter.delete("/memes/:id", async (req, res) => {
  try {
    const del = await Meme.deleteOne({ _id: req.params.id });
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.sendStatus(404);
  }
});

// Edit a meme post by its ID
memesRouter.patch("/memes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    const found = await Meme.find({
      $and: [
        { url: req.body.url },
        { caption: req.body.caption },
        { _id: { $ne: req.params.id } },
        { name: meme.name },
      ],
    });
    if (found.length !== 0) {
      throw new Error("Duplicate");
    }
    await Meme.updateOne(
      { _id: req.params.id },
      {
        $set: {
          caption: req.body.caption,
          url: req.body.url,
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    if (err.message === "Duplicate") {
      res.sendStatus(409);
    } else {
      console.log(err);
      res.sendStatus(404);
    }
  }
});

module.exports = memesRouter;
