const express = require("express");
const likeDislikeRouter = express.Router();
const Meme = require("../models/memes");

/**
 * @swagger
 * tags:
 *   name: LikeDislike
 *   description: The Like/Dislike Manager
 */


/**
 * @swagger
 * /likes:
 *  get:
 *    description: Get the Like data for the recent 100 posts
 *    tags: [LikeDislike]
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing id and likes list containing usernames.
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
likeDislikeRouter.get("/likes", async (req, res) => {
  try {
    const projection = "_id likes";
    const memes = await Meme.find({})
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
 * /likes/{id}:
 *  put:
 *    description: Add a like to a post using ID.
 *                 If the user disliked the post then it is removed and a like is added instead.
 *    tags: [LikeDislike]
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
 *              name:
 *                type: string
 *                description: Name of the user
 *                example: 'User1'
 *    responses:
 *      '200':
 *        description: OK. Post Successfully liked by the mentioned user
 *      '409':
 *        description: Conflict. Post already liked by the mentioned user
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '400':
 *        description: Bad Request. The given name is either null or empty
 */
likeDislikeRouter.put("/likes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error();
    }

    if (meme.likes.includes(req.body.name)) {
      throw new Error("Duplicate");
    }

    if (req.body.name === null || req.body.name === "") {
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
      res.sendStatus(409);
    } else if (err.message === "Bad") {
      res.sendStatus(400);
    } else {
      res.sendStatus(404);
    }
  }
});

/**
 * @swagger
 * /likes/{id}:
 *  get:
 *    description: Get the Like data of a post using ID
 *    tags: [LikeDislike]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing total likes count and 
 *                     likes list containing usernames.
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '500':
 *        description: Internal Server Error due to database connectivity
 */
likeDislikeRouter.get("/likes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error("Not found");
    }
    res.json({ total: meme.likes.length, likedBy: meme.likes });
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
 * /dislikes:
 *  get:
 *    description: Get the Dislike data for the recent 100 posts
 *    tags: [LikeDislike]
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing id and dislikes list containing usernames.
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
likeDislikeRouter.get("/dislikes", async (req, res) => {
  try {
    const projection = "_id dislikes";
    const memes = await Meme.find({})
      .select(projection)
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(memes);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @swagger
 * /dislikes/{id}:
 *  put:
 *    description: Add a dislike to a post using ID. 
 *                 If the user liked the post then it is removed and a dislike is added instead.
 *    tags: [LikeDislike]
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
 *              name:
 *                type: string
 *                description: Name of the user
 *                example: 'User1'
 *    responses:
 *      '200':
 *        description: OK. Post Successfully disliked by the mentioned user
 *      '409':
 *        description: Conflict. Post already disliked by the mentioned user
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '400':
 *        description: Bad Request. The given name is either null or empty
 */
likeDislikeRouter.put("/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error("Meme Not Found");
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
      res.sendStatus(409);
    } else if (err.message === "Bad") {
      res.sendStatus(400);
    } else {
      res.sendStatus(404);
    }
  }
});

/**
 * @swagger
 * /dislikes/{id}:
 *  get:
 *    description: Get the Dislike data of a post using ID
 *    tags: [LikeDislike]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing total dislikes count and 
 *                     dislikes list containing usernames.
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '500':
 *        description: Internal Server Error due to database connectivity
 */
likeDislikeRouter.get("/dislikes/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (meme === null) {
      throw new Error("Not Found");
    }
    res.json({ total: meme.dislikes.length, dislikedBy: meme.dislikes });
  } catch (err) {
    if (err.message === "Not Found") {
      res.sendStatus(404);
    } else {
      res.sendStatus(500);
    }
  }
});

module.exports = likeDislikeRouter;
