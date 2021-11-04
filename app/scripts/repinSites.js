const Sequelize = require("sequelize");
const path = require("path");
const IPFS = require("ipfs");
const fs = require("fs");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "yibandb.sqlite"),
});
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testConnection();

const getAllSites = async () => {
  const ipfs = await IPFS.create();

  const sql_string = "SELECT * FROM sites";
  const query = await sequelize.query(sql_string);
  const allSites = query[0];
  for (const site of allSites) {
    fileHash = site.IpfsHash;

    try {
      for await (const buf of ipfs.get(fileHash, { archive: true })) {
        fs.writeFileSync(
          // temporarily write file to file system
          `ipfsData/newfile.zip`,
          JSON.stringify(buf),
          function (err) {
            if (err) {
              console.log("err:", err);
              return console.log(err);
            }
          }
        );
      }
    } catch (err) {
      console.log(`err: ${err}`);
    }

    process.exit(0);
  }
};
getAllSites();
