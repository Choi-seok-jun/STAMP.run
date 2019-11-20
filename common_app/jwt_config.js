module.exports = {
  jwtSecret: process.env.TOKEN_KEY || "test",
  jwtSession: {
    session: false
  }
};
