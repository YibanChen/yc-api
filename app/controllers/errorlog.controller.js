const db = require("../models");
const logs = require("../util/logs");
// const Errorlog = db.errorlogs;
const Op = db.Sequelize.Op;

// Create and Save a new Errorlog
exports.create = (req, res) => {
  console.log("error from front end: ", req.body.message);
  logs.reactLogger.log({
    level: "error",
    message: req.body.message,
    timestamp: new Date().toISOString(),
  });

  /* const errorlog = {
    IpfsHash: IpfsHash,
    walletAddress: req.body.sender.address,
    uuid: noteUuid,
  }; */

  /* Errorlog.create(errorlog)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Errorlog.",
      });
    }); */
};

// Retrieve all Errorlogs from the database.
/* exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Errorlog.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving errorlogs.",
      });
    });
};

// Find a single Errorlog with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Errorlog.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Errorlog with id=" + id,
      });
    });
};

// Update a Errorlog by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Errorlog.update(req.body, {
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Errorlog was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Errorlog with id=${id}. Maybe Errorlog was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Errorlog with id=" + id,
      });
    });
};

// Delete a Errorlog with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Errorlog.destroy({
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Errorlog was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Errorlog with id=${id}. Maybe Errorlog was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Errorlog with id=" + id,
      });
    });
};

/* // Delete all Errorlogs from the database.
exports.deleteAll = (req, res) => {
  Errorlog.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Errorlogs were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all errorlogs.",
      });
    });
}; */
