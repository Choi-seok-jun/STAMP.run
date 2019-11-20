const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { Schema, model } = mongoose;

const personalSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone_num: { type: String, unique: true },
  admin: { type: Boolean, default: false },
  userAdd: { type: mongoose.Types.ObjectId, ref: "User" },
  emailAuth: { type: String, default: "" },
  emailCheck: { type: Boolean, default: false }
});
const userSchema = new Schema({
  id: { type: String, unique: true },
  password: String,
  persAdd: { type: mongoose.Types.ObjectId, ref: "Personal" }
});

const Personal = model("Personal", personalSchema);
const User = model("User", userSchema);

function validateUser(personal) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone_num: Joi.string(),
    userAdd: Joi.array().items(Joi.string()),
    emailAuth: Joi.string(),
    emailCheck: Joi.string()
  });
  return schema.validate(personal);
}
function validatePersonal(user) {
  const schema = Joi.object({
    id: Joi.string(),
    password: Joi.string(),
    persAdd: Joi.array().items(Joi.string())
  });
  return schema.validate(user);
}
module.exports = {
  User,
  Personal,
  validateUser,
  validatePersonal
};
