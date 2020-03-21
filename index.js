const express = require("express");
const mongoose = require("mongoose");
var app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const passport = require("passport");
//Middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");
const linuxquestion = require("./routes/api/linuxquestion");
//mongoDB configuration
const db = require("./setup/myurl").mongoURL;

//Attempt to connect to db
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected successfully"))
  .catch(err => console.log(err));
//Passport middlewares
app.use(passport.initialize());

//COnfig for jwt strategy
require("./strategies/jsonwtStrategy")(passport);

//just for testing -> routes
app.get("/", (req, res) => {
  res.send("<h1>hello there</h1>");
});

//actual routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/question", question);
app.use("/api/linuxquestion", linuxquestion);
app.listen(port, () => console.log("So far so good"));
