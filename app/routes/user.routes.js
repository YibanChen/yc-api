bodyParser = require("body-parser").urlencoded({ extended: true });


module.exports = (app) => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/", user.create);
    // Retrieve a single Site with id
    router.get("/:address", user.findOne);

    app.use("/api/user", router);
};
