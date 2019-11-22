const passport = require("passport");
const passportJWT = require("passport-jwt");
const { User, Personal } = require("../model_app/user");
const config = require("./jwt_config");

const { ExtractJwt, Strategy } = passportJWT;
const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = () => {
  const strategy = new Strategy(options, async (payload, done) => {
    const user = await User.findById(payload.userAdd);
    const person = await Personal.findOne({ userAdd: payload.userAdd });
    if (person) {
      return done(null, {
        persAdd: person._id,
        admin: person.admin,
        name: person.name,
        email: person.email,
        emailCheck: person.emailCheck,
        phone_num: person.phone_num,

        useradd: user._id,
        id: user.id,
        password: user.password,
      });
    } else {
      return done(new Error("user not find"), null);
    }
  });
  passport.use(strategy);
  return {
    initiallze() {
      return passport.initialize();
    },
    authenticate() {
      return passport.authenticate("jwt", config.jwtSession);
    }
  };
};
