const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new verified user
exports.create = async (req, res) => {
    // Validate request
    if (req.body === {} || !req.body.isVerified) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    // Create Verified User
    const user = {
        isVerified: req.body.isVerified,
        walletAddress: req.body.walletAddress,
    };

    // Save User in the database
    User.create(user)
        .then((data) => {
            console.log("User Verified:", data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while verifing user",
            });
        });
};

// Find a verified User
exports.findOne = (req, res) => {
    const adress = req.params.address;

    User.findOne({ where: { walletAddress: adress } })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error! No User with address=" + adress,
            });
        });
};