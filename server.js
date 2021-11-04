const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logs = require("./app/util/logs");
var bodyParser = require("body-parser");
const Sentry = require("@sentry/node");

dotenv.config();

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_KEY,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

const db = require("./app/models");
db.sequelize.sync();

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://app.yibanchen.com",
    "https://dev.yibanchen.com",
  ],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

logs.logger.log({
  level: "info",
  message: "Hello YibanChen!",
});

console.log(`Your port is ${process.env.PORT}`); // 5000
console.log(process.env.NODE_ENV);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to YibanChen." });
});

require("./app/routes/site.routes")(app);
require("./app/routes/note.routes")(app);
require("./app/routes/errorlog.routes")(app);

app.use(Sentry.Handlers.errorHandler());

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
