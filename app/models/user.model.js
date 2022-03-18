module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        isVerified: {
            type: Sequelize.STRING,
        },
        walletAddress: {
            type: Sequelize.STRING,
        },
    });

    return User;
};
