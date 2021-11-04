module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define("note", {
    IpfsHash: {
      type: Sequelize.STRING,
    },
    walletAddress: {
      type: Sequelize.STRING,
    },
    uuid: {
      type: Sequelize.STRING,
    },
    noteIndex: {
      type: Sequelize.INTEGER,
    },
  });

  return Note;
};
