var mongoose = require('mongoose');
const Meme = require("../models/memes");

const checkId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const meme = await Meme.findById(id);
    if (meme === null) {
      throw new Error("Not Found");
    } else {
        return meme;
    }
  } else {
      throw new Error("Not Found");
  }
};

module.exports = checkId;
