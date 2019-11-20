const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const smtpPool = require("nodemailer-smtp-pool");
const { User } = require("../model_app/user");
const wrapper = require("../common_app/wrapper");
const password = process.env.EMAIL_PW || require("../mailConfig");
router.post(
  "/",
  wrapper(async (req, res, next) => {
    const inputEmail = req.body.email;
    const config = {
      mailer: {
        service: "Gmail",
        host: "fpemzkvpt0@gmail.com",
        user: "fpemzkvpt0",
        password
      }
    };
    const from = "STAMP < fpemzkvpt0@gmail.com >";
    const to = inputEmail;
    const subject = "STMAP 인증번호 안내입니다.";
    const authNo = Math.floor(Math.random() * 10000);
    const html = `<p>인증번호입니다</p> \n <p>인증번호는 ${authNo}</p>`;

    const mailOptions = {
      from,
      to,
      subject,
      html
    };

    const transporter = nodemailer.createTransport(
      smtpPool({
        service: config.mailer.service,
        host: config.mailer.host,
        port: config.mailer.port,
        auth: {
          user: config.mailer.user,
          pass: config.mailer.password
        },
        tls: {
          rejectUnauthorize: false
        },
        maxConnections: 5,
        maxMessages: 10
      })
    );

    // 메일을 전송하는 부분
    transporter.sendMail(mailOptions, async (err, res2) => {
      if (err) {
        console.log("failed... => ", err);
      } else {
        console.log("succeed... => ", res2);
        await User.updateOne(
          { email: inputEmail },
          { $set: { emailAuth: authNo } }
        );
        res.json({ result: true });
        next();
      }

      transporter.close();
    });
  })
);

module.exports = router;
//jlrhglgfgteghwla
