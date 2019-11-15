const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone_num: String,
  admin: { type: Boolean, default: false },
  persAdd: { type: mongoose.Types.ObjectId, ref: "Personal" }
});
const personalSchema = new Schema({
  id: String,
  password: String,
  userAdd: { type: mongoose.Types.ObjectId, ref: "User" }
});

const User = model("User", userSchema);
const Personal = model("Personal", personalSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone_num: Joi.string(),
    persAdd: Joi.array().items(Joi.string())
  });
  return schema.validate(user);
}
function validatePersonal(personal) {
  const schema = Joi.object({
    id: Joi.string(),
    password: Joi.string(),
    userAdd: Joi.array().items(Joi.string())
  });
  return schema.validate(personal);
}
module.exports = {
  User,
  Personal,
  validateUser,
  validatePersonal
};
