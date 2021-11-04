const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const {
  uploadHtmlToIpfs,
  uploadZipToIpfs,
  deleteHashFromIpfs,
} = require("../ipfs/ipfs");
const Site = db.sites;
const Op = db.Sequelize.Op;

// Create and Save a new Site
exports.create = (req, res) => {
  console.log("req.file here:", req.file);
  // Validate request
  if (req.body === {}) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Validate filesize
  // if (req.file.size > 8e6) {
  //   // 8e6 = 1 MB
  //   res.status(400).send({ msg: "File too large" });
  // }

  // pin to IPFS
  let IpfsHash;

  if (req.body.fileType === "Zip") {
    IpfsHash = uploadZipToIpfs(req);
  } else if (req.body.fileType === "Html") {
    IpfsHash = uploadHtmlToIpfs(req);
  }

  // generate UUID
  const siteUuid = uuidv4();

  const site = {
    siteName: req.body.siteName,
    IpfsHash: IpfsHash,
    walletAddress: req.body.walletAddress,
    uuid: siteUuid,
  };

  console.log("HASH: ", IpfsHash);

  // Save Site in the database
  Site.create(site)
    .then((data) => {
      res.json(site);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Site.",
      });
    });
};

// Retrieve all Sites from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Site.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sites.",
      });
    });
};

// Find a single Site with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Site.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Site with id=" + id,
      });
    });
};

// Update a Site by the uuid in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Site.update(req.body, {
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Site was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Site with id=${id}. Maybe Site was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Site with id=" + id,
      });
    });
};

// Update a Site by the siteIndex in the request
exports.updateFromIndex = (req, res) => {
  console.log("req.file: ", req.file);
  console.log("req.body: ", req.body);
  console.log("req: ", req);
  const id = req.params.id;

  let IpfsHash;

  if (req.body.fileType === "Zip") {
    IpfsHash = uploadZipToIpfs(req);
  } else if (req.body.fileType === "Html") {
    IpfsHash = uploadHtmlToIpfs(req);
  }

  console.log("IPFS HASH", IpfsHash);

  Site.update(
    { IpfsHash: IpfsHash },
    {
      where: { siteIndex: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          IpfsHash: IpfsHash,
        });
      } else {
        res.send({
          message: `Cannot update Site with id=${id}. Maybe Site was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Site with id=" + id,
      });
    });
};

// Delete a Site with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  deleteHashFromIpfs(req.body.IpfsHash);

  Site.destroy({
    where: { uuid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Site was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Site with id=${id}. Maybe Site was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Site with id=" + id,
      });
    });
};

// Delete a Site with the specified id in the request
exports.deleteByIndex = (req, res) => {
  const id = req.params.id;
  console.log("ID:", id);

  deleteHashFromIpfs(req.body.IpfsHash);

  Site.destroy({
    where: { siteIndex: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Site was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Site with id=${id}. Maybe Site was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Site with id=" + id,
      });
    });
  console.log("DELETED FROM ID SUCCESSFULLY");
};

/* // Delete all Sites from the database.
exports.deleteAll = (req, res) => {
  Site.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Sites were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all sites.",
      });
    });
}; */
