const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../model_app/user");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");

router.post(
  "/",
  wrapper(async (req, res, next) => {
    const inputId = req.body.id;
    const inputEmail = req.body.email;
    const saltRound = 10;
    const hashedPW = await bcrypt.hash(password, saltRound);
    const aa = await Personal.updateOne(
      { id: inputId },
      { $set: { password: hashedPW } }
    );
    console.log(aa);
    res.json({ result: true });
    next();
  })
);

module.exports = router;
