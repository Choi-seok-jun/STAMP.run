const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");
const app = express();
const main = require("./router_app/main");
const user = require("./router_app/user");
const read = require("./router_app/read");
const modify = require("./router_app/modify");
const missions = require("./router_app/missions");
const config = require("./common_app/jwt_config");
const auth = require("./common_app/auth")();
const emailAuth = require("./router_app/emailAuth");
const withdraw = require("./router_app/withdraw");

const dbURI = process.env.MONGODB_URI || " mongodb://localhost/stamp-run";

app.use(Helmet());
app.use((req, res, next) => {
  mongoose
    .connect(dbURI, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true
    })
    .then(() => next())
    .catch(e => next(e));
});
app.use(auth.initiallze());
app.use(express.json());
app.use("/auth", user);
app.use("/api/main", main);
app.use("/api/missions", missions);
app.use("/auth/read", read);
app.use("/auth/modify", modify);
app.use("/auth/emailAuth", emailAuth);
app.use("/auth/withdraw", withdraw);

app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
