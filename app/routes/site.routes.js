bodyParser = require("body-parser").urlencoded({ extended: true });
var multer = require("multer");
var upload = multer({ dest: "./ipfsData/" });

module.exports = (app) => {
  const sites = require("../controllers/site.controller.js");

  var router = require("express").Router();

  // Create a new Site
  router.post("/", upload.single("siteFile"), sites.create);

  // Retrieve all Sites
  router.get("/", sites.findAll);

  // Retrieve a single Site with id
  router.get("/:id", sites.findOne);

  // Update a Site with id
  router.put("/:id", sites.update);
  router.post("/fromindex/:id", upload.single("siteFile"), sites.updateFromIndex)

  // Delete a Site with id
  router.delete("/:id", sites.delete);

  router.delete("/fromindex/:id", sites.deleteByIndex);

  /*   // Delete all Sites
  router.delete("/", sites.deleteAll); */

  app.use("/api/sites", router);
};
