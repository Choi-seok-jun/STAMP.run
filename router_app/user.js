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
    if (validatePersonal({ name, email, phone_num }).error) {
      //검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }
    if (validateUser({ password, id }).error) {
      //검증과정 통과 못하면
      res.status(400).json({ result: false });
      next();
      return;
    }

    const saltRound = 10;
    const hashedPW = await bcrypt.hash(password, saltRound);
    const personal = new Personal({
      name,
      email,
      phone_num
    });
    const saveResult = await personal.save();
    const user = new User({
      password: hashedPW,
      id,
      persAdd: personal._id
    });
    const saveResult2 = await user.save();

    await Personal.updateOne(
      { _id: personal._id },
      { $set: { userAdd: user._id } }
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
    const user = await User.findOne({ id: id });
    //뒤의 이메일은 사용자가 입력한것 앞의 것은 데이터베이스에 들어있는 값
    if (!user) {
      res.json({ msg: "아이디가 없습니다", result: false });
      next();
      return;
    }
    const result = await bcrypt.compare(password, user.password);
    //처음껀 입력한 비밀번호 , 2번째껀 DB에 들어있는 해쉬된 비밀번호 맞는것을 bcrypt가 비교해줌
    if (result) {
      //비밀번호가 맞는경우 토큰을 만들어줌!
      const token = jwt.sign(
        {
          id: user._id
        },
        jwtSecret,
        { expiresIn: "5m" }
      );
      res.json({ result: true, token });
      next();
    } else {
      res.json({ msg: "비밀번호가 맞지않습니다.", result: false });
      next();
    }
  })
);
router.get(
  "/id",
  wrapper(async (req, res, next) => {
    const id = req.query.id;
    console.log(id);
    const rs = await User.findOne({ id });
    if (rs) {
      res.json({ result: false }); //중복
    } else {
      res.json({ result: true });
    }
    next();
  })
);
router.get(
  "/phone_num",
  wrapper(async (req, res, next) => {
    const phone_num = req.query.phone_num;
    const rs = await Personal.findOne({ phone_num });
    if (rs) {
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
    const email = req.query.email;
    const rs = await Personal.findOne({ email });
    if (rs) {
      res.json({ result: false });
    } else {
      res.json({ result: true });
    }
    next();
  })
);

module.exports = router;
