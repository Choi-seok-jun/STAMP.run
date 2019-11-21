const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../model_app/user");
const { Personal, validatePersonal } = require("../model_app/user");
const { jwtSecret } = require("../common_app/jwt_config");
const wrapper = require("../common_app/wrapper");

// 객체로 보내주는것은 객체로 받아야함 객체를 req.body에 담았어도 따로따로 받으려면 객체로 받아서 객체 담겨진것을 불러와야함.
router.post(
  "/join",
  wrapper(async (req, res, next) => {
    const { name, email, password, id, phone_num } = req.body;
    if (validateUser({ name, email, phone_num }).error) {
      //검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }
    if (validatePersonal({ password, id }).error) {
      //검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }

    const saltRound = 10;
    const hashedPW = await bcrypt.hash(password, saltRound);
    const user = new User({
      name,
      email,
      phone_num
    });
    const saveResult = await user.save();
    const personal = new Personal({
      password: hashedPW,
      id,
      userAdd: user._id
    });
    const saveResult2 = await personal.save();

    await User.updateOne(
      { _id: personal.userAdd },
      { $set: { persAdd: personal._id } }
      //User를 만들고 난뒤에 업데이트를 하는데  personal 이 만들어질떄 user에있는_id가  userAdd 로 들어가는데
      //그이후에 personal 에 있는 userAdd와 User 에 있는 원본이랑 비교해서 같으면
      //personal이 만들어질때 생긴 _id가 userAdd로 들어간다.
      // await Personal.updateOne(user._id).toString();
    );
    res.json({ result: true });
    next();
  })
);

router.post(
  "/login",
  wrapper(async (req, res, next) => {
    const { id, password } = req.body;
    const personal = await Personal.findOne({ id: id });
    //뒤의 이메일은 사용자가 입력한것 앞의 것은 데이터베이스에 들어있는 값
    if (!personal) {
      res.json({ result: false });
      next();
      return;
    }
    const result = await bcrypt.compare(password, personal.password);
    //처음껀 입력한 비밀번호 , 2번째껀 DB에 들어있는 해쉬된 비밀번호 맞는것을 bcrypt가 비교해줌
    if (result) {
      //비밀번호가 맞는경우 토큰을 만들어줌!
      const token = jwt.sign(
        {
          id: personal._id,
          name: personal.name,
          email: personal.email,
          phone_num: personal.phone_num,
          admin: personal.admin
        },
        jwtSecret,
        { expiresIn: "5m" }
      );
      res.json({ result: true, token, admin: personal.admin });
      next();
    } else {
      res.json({ result: false });
      next();
    }
  })
);
router.get(
  "/id",
  wrapper(async (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    const personal = await Personal.findOne({ id });
    if (personal) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
    next();
  })
);
router.get(
  "/phone_num",
  wrapper(async (req, res, next) => {
    const phone_num = req.params.phone_num;
    const user = await User.findOne({ phone_num });
    if (user) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
    next();
  })
);
router.get(
  "/email",
  wrapper(async (req, res, next) => {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (user) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
    next();
  })
);

module.exports = router;
