const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const messageSchema = new Schema({
  user: {
    type: ObjectId,
    require: true,
    ref: "Account",
  },
  isPrivate: {
    type: Boolean,
    require: true,
    default: false,
  },
  toUser: {
    type: ObjectIdd,
    ref: "Account",
  },
  text: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
