module.exports = {
  jwtSecret: process.env.TOKEN_KEY || "stamp.run",
  jwtSession: {
    session: false
  }
};
