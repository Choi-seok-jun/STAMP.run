const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone_num: String,
  admin: { type: Boolean, default: false }
});
const personalSchema = new Schema({
  id: String,
  password: String
});

const User = model("User", userSchema);
const Personal = model("Personal", personalSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone_num: Joi.string()
  });
  return schema.validate(user);
}
function validatePersonal(personal) {
  const schema = Joi.object({
    id: Joi.string(),
    password: Joi.string()
  });
  return schema.validate(personal);
}
module.exports = {
  User,
  Personal,
  validateUser,
  validatePersonal
};
