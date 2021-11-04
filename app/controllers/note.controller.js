const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { uploadNoteToIpfs, deleteHashFromIpfs } = require("../ipfs/ipfs");
const Note = db.notes;
const Op = db.Sequelize.Op;

// Create and Save a new Note
exports.create = async (req, res) => {
  // Validate request
  if (req.body === {}) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  console.log("req.body: ", req.body);

  // Create a Note

  let IpfsHash = await uploadNoteToIpfs(req.body);
  console.log(`ipfsHash: ${IpfsHash}`);

  const noteUuid = uuidv4();

  const note = {
    IpfsHash: IpfsHash,
    walletAddress: req.body.sender.address,
    uuid: noteUuid,
  };

  // Save Note in the database
  Note.create(note)
    .then((data) => {
      console.log("IpfsHash: ", IpfsHash);
      res.json({ IpfsHash: IpfsHash, uuid: noteUuid });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      });
    });
};

// Retrieve all Notes from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Note.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

// Find a single Note with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Note.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Note with id=" + id,
      });
    });
};

// Update a Note by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Note.update(req.body, {
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Note was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Note with id=${id}. Maybe Note was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Note with id=" + id,
      });
    });
};

// Delete a Note with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  deleteHashFromIpfs(req.body.IpfsHash);

  Note.destroy({
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Note was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Note with id=${id}. Maybe Note was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Note with id=" + id,
      });
    });
};

// Delete a Note with the specified id in the request
exports.deleteByIndex = (req, res) => {
  const id = req.params.id;
  console.log("ID:", id);

  deleteHashFromIpfs(req.body.IpfsHash);

  Note.destroy({
    where: { noteIndex: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Note was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Note with id=${id}. Maybe Note was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Note with id=" + id,
      });
    });
  console.log("DELETED FROM ID SUCCESSFULLY");
};

/* // Delete all Notes from the database.
exports.deleteAll = (req, res) => {
  Note.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Notes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all notes.",
      });
    });
}; */
