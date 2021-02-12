const express = require("express");
const commentsRouter = express.Router();
const Meme = require("../models/memes");
const checkError = require("../helpers/checkError");
const checkId = require("../helpers/checkId");

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
 *                     Returns empty list if there are no posts.
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation
 */
commentsRouter.get("/comments", async (req, res) => {
  try {
    const projection = "_id comments";
    const memes = await Meme.find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .select(projection);
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
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '400':
 *        description: BAD REQUEST. The given name and/or comment is either null or empty
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation
 */
commentsRouter.put("/comments/:id", async (req, res) => {
  try {
    if (req.body.name === null || req.body.name === "") {
      throw new Error("Bad Request");
    }
    if (req.body.comment === null || req.body.comment === "") {
      throw new Error("Bad Request");
    }
    await checkId(req.params.id);

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
    checkError(err, res);
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
 *        description: INTERNAL SERVER ERROR. Cannot perform operation
 */
commentsRouter.get("/comments/:id", async (req, res) => {
  try {
    const meme = await checkId(req.params.id);
    res.json({ total: meme.comments.length, comments: meme.comments });
  } catch (err) {
    checkError(err, res);
  }
});

module.exports = commentsRouter;
