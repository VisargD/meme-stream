const express = require("express");
const likeDislikeRouter = express.Router();
const Meme = require("../models/memes");
const checkId = require("../helpers/checkId");
const checkError = require("../helpers/checkError");
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
 *                     Returns empty list if there are no posts.
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation
 */
likeDislikeRouter.get("/likes", async (req, res) => {
  try {
    const projection = "_id likes";
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
 *        description: CONFLICT. Post already liked by the mentioned user
 *      '404':
 *        description: NOT FOUND. ID not found
 *      '400':
 *        description: BAD REQUEST. The given name is either null or empty
 *      '403':
 *        description: FORBIDDEN. Owner trying to like their own post
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation.
 */
likeDislikeRouter.put("/likes/:id", async (req, res) => {
  try {
    if (req.body.name === null || req.body.name === "") {
      throw new Error("Bad Request");
    }

    const meme = await checkId(req.params.id);
    if (req.body.name === meme.name) {
      throw new Error("Forbidden");
    }

    if (meme.likes.includes(req.body.name)) {
      throw new Error("Duplicate");
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
    checkError(err, res);
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
 *        description: INTERNAL SERVER ERROR. Cannot perform operation.
 */
likeDislikeRouter.get("/likes/:id", async (req, res) => {
  try {
    const meme = await checkId(req.params.id);
    res.json({ total: meme.likes.length, likedBy: meme.likes });
  } catch (err) {
    checkError(err, res);
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
 *                     Returns empty list if there are no posts.
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation.
 */
likeDislikeRouter.get("/dislikes", async (req, res) => {
  try {
    const projection = "_id dislikes";
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
 *      '403':
 *        description: FORBIDDEN. Owner trying to dislike their own post
 *      '500':
 *        description: INTERNAL SERVER ERROR. Cannot perform operation.
 */
likeDislikeRouter.put("/dislikes/:id", async (req, res) => {
  try {
    if (req.body.name === null || req.body.name === "") {
      throw new Error("Bad Request");
    }
    const meme = await checkId(req.params.id);

    if (req.body.name === meme.name) {
      throw new Error("Forbidden");
    }
    if (meme.dislikes.includes(req.body.name)) {
      throw new Error("Duplicate");
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
    checkError(err, res);
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
 *        description: INTERNAL SERVER ERROR. Cannot perform operation.
 */
likeDislikeRouter.get("/dislikes/:id", async (req, res) => {
  try {
    const meme = checkId(req.params.id);
    res.json({ total: meme.dislikes.length, dislikedBy: meme.dislikes });
  } catch (err) {
    checkError(err, res);
  }
});

module.exports = likeDislikeRouter;
