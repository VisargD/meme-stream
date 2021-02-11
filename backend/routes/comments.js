const express = require("express");
const commentsRouter = express.Router();
const Meme = require("../models/memes");


/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments Manager
 */


/**
 * @swagger
 * /comments:
 *  get:
 *    description: Get the Comment data for the recent 100 posts
 *    tags: [Comments]
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing id and 
 *                     comments list containing username and comment.
 *      '500':
 *        description: Internal Server Error due to Database connectivity
 */
commentsRouter.get("/comments", async (req, res) => {
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

/**
 * @swagger
 * /comments/{id}:
 *  put:
 *    description: Add a comment to a post using ID.
 *                 It takes a username and a comment in the request body.
 *    tags: [Comments]
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
 *              comment:
 *                type: string
 *                description: Comment done by the user
 *                example: 'Random Comment'
 *    responses:
 *      '200':
 *        description: OK. Post Successfully liked by the mentioned user
 *      '500':
 *        description: Internal Server Error due to database connectivity
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '400':
 *        description: Bad Request. The given name and/or comment is either null or empty
 */
commentsRouter.put("/comments/:id", async (req, res) => {
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

/**
 * @swagger
 * /comments/{id}:
 *  get:
 *    description: Get the Comment data of a post using ID
 *    tags: [Comments]
 *    parameters:
 *    - in: path
 *      name: id
 *      description: ID of the Meme post
 *    responses:
 *      '200':
 *        description: OK. Returns a JSON response containing total comment count and 
 *                     comments list containing username and comment.
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '500':
 *        description: Internal Server Error due to database connectivity
 */
commentsRouter.get("/comments/:id", async (req, res) => {
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
