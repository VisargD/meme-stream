const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Meme = require("./models/memes");

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

app.get("/memes", async (req, res) => {
  const memes = await Meme.find({}).sort({ timestamp: -1 }).limit(100);
  res.json(memes);
});

app.get("/memes/:id", async (req, res) => {
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

app.post("/memes", async (req, res) => {
  try {
    const found = await Meme.find({
      $or: [
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

app.delete("/memes/:id", async (req, res) => {
  try {
    const del = await Meme.deleteOne({ _id: req.params.id });
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.sendStatus(404);
  }
});

app.patch("/memes/:id", async (req, res) => {
  try {
    const found = await Meme.find({
      $and: [{ url: req.body.url }, { caption: req.body.caption }],
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
    }
    res.sendStatus(404);
  }
});

app.put("/memes/likes/:id", async (req, res) => {
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
          $pop: {
            dislikes: meme.dislikes.indexOf(req.body.name),
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

app.get("/memes/likes/:id", async (req, res) => {
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

app.put("/memes/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
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
          $pop: {
            likes: meme.dislikes.indexOf(req.body.name),
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

app.get("/memes/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }
    res.json({ total: meme.dislikes.length, likedBy: meme.dislikes });
  } catch (err) {
    res.sendStatus(404);
  }
});

app.listen(8081, () => {
  console.log("Server running on port 8081");
});
