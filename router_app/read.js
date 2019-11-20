const express = require("express");
const router = express.Router();
const { User } = require("../model_app/user");
const { Personal } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");

router.post(
  "/",
  wrapper(async (req, res, next) => {
    const inputEmail = req.body.email;
    const inputId = req.body.id;

    const personalRead = await Personal.find(
      { email: inputEmail },
      { _id: 0, email: 1, phone_num: 1, name: 1 }
    );
    const userRead = await User.find({ id: inputId }, { _id: 0, password: 1 });
    console.log(userRead);
    console.log(personalRead);
    res.json({ result: true });
    next();
  })
);

module.exports = router;
