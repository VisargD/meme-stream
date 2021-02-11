const express = require("express");
const memesRouter = express.Router();
const Meme = require("../models/memes");
const isImageURL = require("image-url-validator").default;

/**
 * @swagger
 * tags:
 *   name: Memes
 *   description: The Meme Post manager
 */

// Routes
/**
 * @swagger
 * /memes:
 *  get:
 *    description: Get the recent 100 meme posts in reverse chronological order
 *    tags: [Memes]
 *    responses:
 *      '200':
 *        description: OK. Meme Posts fetched successfully
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */

memesRouter.get("/memes", async (req, res) => {
  try {
    const projection = "_id name url caption";
    const memes = await Meme.find()
      .select(projection)
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(memes);
  } catch (err) {
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /memes/{id}:
 *  get:
 *    description: Get the meme post by its ID
 *    tags: [Memes]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing id, name, url and caption
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
memesRouter.get("/memes/:id", async (req, res) => {
  try {
    const projection = "_id name url caption";
    const meme = await Meme.findById(req.params.id).select(projection);
    if (meme === null) {
      throw new Error("Not Found");
    }
    res.json(meme);
  } catch (err) {
    if (err.message === "Not Found") {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  }
});

/**
 * @swagger
 * /memes:
 *  post:
 *    description: Creates a new meme post
 *    tags: [Memes]
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the user
 *                example: 'User1'
 *              url:
 *                type: string
 *                description: URL of the image
 *                example: 'https://ichef.bbci.co.uk/images/ic/704xn/p072ms6r.jpg'
 *              caption:
 *                type: string
 *                description: Caption of the post
 *                example: 'Random Meme Caption'
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing id.
 *      '409':
 *        description: CONFLICT. Duplicate post by the same user
 *      '422':
 *        description: UNPROCESSABLE ENTITY. Invalid image URL.
 *      '400':
 *        description: BAD REQUEST. The body contains null or empty values
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
memesRouter.post("/memes", async (req, res) => {
  try {
    if (!(await isImageURL(req.params.url))) {
      throw new Error("Invalid URL");
    }

    if (
      req.body.name === null ||
      req.body.ur === null ||
      req.body.caption === null
    ) {
      throw new Error("Bad Request");
    }
    if (req.body.name === "" || req.body.ur === "" || req.body.caption === "") {
      throw new Error("Bad Request");
    }
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
      throw new Error("Duplicate");
    }
  } catch (err) {
    if (err.message === "Duplicate") {
      res.sendStatus(409);
    } else if (err.message === "Invalid URL") {
      res.sendStatus(422);
    } else if (err.message === "Bad Request") {
      res.sendStatus(400);
    } else {
      res.sendStatus(500);
    }
  }
});

/**
 * @swagger
 * /memes/{id}:
 *  delete:
 *    description: Delete the post using ID
 *    tags: [Memes]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    responses:
 *      '200':
 *        description: OK. Post Deleted Successfully
 *      '404':
 *        description: NOT FOUND. ID not found
 */
memesRouter.delete("/memes/:id", async (req, res) => {
  try {
    const del = await Meme.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(404);
  }
});

/**
 * @swagger
 * /memes/{id}:
 *  patch:
 *    description: Edits a meme post
 *    tags: [Memes]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                description: New URL of the image
 *                example: 'https://ichef.bbci.co.uk/images/ic/704xn/p072ms6r.jpg'
 *              caption:
 *                type: string
 *                description: New Caption of the post
 *                example: 'Random Meme Caption'
 *    responses:
 *      '200':
 *        description: OK. Post Edited Successfully.
 *      '409':
 *        description: CONFLICT. Duplicate post by the same user
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '422':
 *        description: UNPROCESSABLE ENTITY. Invalid image URL.
 *      '400':
 *        description: BAD REQUEST. The body contains null or empty values
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
memesRouter.patch("/memes/:id", async (req, res) => {
  try {
    if (!(await isImageURL(req.params.url))) {
      throw new Error("Invalid URL");
    }
    if (req.body.ur === null || req.body.caption === null) {
      throw new Error("Bad Request");
    }
    if (req.body.ur === "" || req.body.caption === "") {
      throw new Error("Bad Request");
    }
    if (!(await Meme.findById(req.params.id))) {
      throw new Error("Not Found");
    }
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
    } else if (err.message === "Invalid URL") {
      res.sendStatus(422);
    } else if (err.message === "Bad Request") {
      res.sendStatus(400);
    } else if (err.message === "Not Found") {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  }
});

module.exports = memesRouter;
