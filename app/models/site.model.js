module.exports = (sequelize, Sequelize) => {
  const Site = sequelize.define("site", {
    siteName: {
      type: Sequelize.STRING,
    },
    IpfsHash: {
      type: Sequelize.STRING,
    },
    walletAddress: {
      type: Sequelize.STRING,
    },
    uuid: {
      type: Sequelize.STRING,
    },
    siteIndex: {
      type: Sequelize.INTEGER,
    },
  });

  return Site;
};
