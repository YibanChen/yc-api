bodyParser = require("body-parser").urlencoded({ extended: true });

module.exports = (app) => {
  const errorlogs = require("../controllers/errorlog.controller.js");

  var router = require("express").Router();

  // Create a new Errorlog
  router.post("/", errorlogs.create);

  /*  // Retrieve all Errorlogs
  router.get("/", errorlogs.findAll);

  // Retrieve a single Errorlog with id
  router.get("/:id", errorlogs.findOne);

  // Update a Errorlog with id
  router.put("/:id", errorlogs.update);

  // Delete a Errorlog with id
  router.delete("/:id", errorlogs.delete); */

  /*   // Delete all Errorlogs
  router.delete("/", errorlogs.deleteAll); */

  app.use("/api/errorlogs", router);
};
