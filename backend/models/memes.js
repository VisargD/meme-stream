const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Meme:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         name:
 *           type: string
 *           description: Name of the user who posted the meme
 *         url:
 *           type: string
 *           description: URL of the image used in the post
 *         timestamp:
 *           type: date
 *           description: Timestamp of creation
 *         likes:
 *           type: array
 *           description: List of usernames that liked the post
 *         dislikes:
 *           type: array
 *           description: List of usernames that disliked the post
 *         comments:
 *           type: array
 *           description: List of comments for a post that contains {name, comment} objects
 */
const memeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
  },
  likes: {
    type: Array,
  },
  dislikes: {
    type: Array,
  },
  comments: {
    type: Array,
  }
});

memeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});

const Meme = mongoose.model("Meme", memeSchema);

module.exports = Meme;
