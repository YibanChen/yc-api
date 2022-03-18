const dbConfig = require("../config/db.config.js");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "yibandb.sqlite"),
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testConnection();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sites = require("./site.model.js")(sequelize, Sequelize);
db.notes = require("./note.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;
