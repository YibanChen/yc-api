const path = require("path");

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "123456",
  DB: "testdb",
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "yibandb.sqlite"),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
