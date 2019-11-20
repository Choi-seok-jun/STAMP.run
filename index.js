const express = require("express");
const mongoose = require("mongoose");
const Helmet = require("helmet");
const app = express();
const main = require("./router_app/main");
const user = require("./router_app/user");
const modify = require("./router_app/modify");
const missions = require("./router_app/missions");
const config = require("./common_app/jwt_config");
const auth = require("./common_app/auth")();
const emailAuth = require("./router_app/emailAuth");

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
app.use("/api/modify", modify);
app.use("/api/emailAuth", emailAuth);

app.use(() => mongoose.disconnect());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
