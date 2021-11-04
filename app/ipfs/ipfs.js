var AdmZip = require("adm-zip");
var path = require("path");
const axios = require("axios");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET_KEY);

// Test authentication

pinata
  .testAuthentication()
  .then((result) => {
    //handle successful authentication here
    console.log(result);
  })
  .catch((err) => {
    //handle error here
    console.log(err);
  });

const uploadZipToIpfs = (req) => {
  let siteFile = req.file;

  console.log("size: ", siteFile.size);

  fs.writeFileSync(
    // temporarily write file to file system
    `ipfsData/${siteFile.filename}.zip`,
    JSON.stringify(siteFile),
    function (err) {
      if (err) {
        console.log("err:", err);
        return console.log(err);
      }
    }
  );
  // get name of the directory

  let dirName = siteFile.originalname.split(".")[0];

  // reading archives
  var zip = new AdmZip(`ipfsData/${siteFile.filename}`);

  // create a random number for the directory to work in, so no threading conflicts ever arise
  const dirNumber = Math.floor(Math.random() * 100000).toString();

  // extracts everything
  zip.extractAllTo(/*target path*/ `ipfsData/${dirNumber}`, /*overwrite*/ true);

  // spawn process to upload directory to our IPFS node
  var child_process = require("child_process");

  // NOTE: Objects added through ipfs add are pinned recursively by default
  var child = child_process.spawnSync(
    "ipfs",
    ["add", "-r", `ipfsData/${dirNumber}/${dirName}`],
    {
      encoding: "utf8",
    }
  );

  console.log("Process finished.");

  if (child.error) {
    console.log("ERROR: ", child.error);
  }

  // split up stdout into different lines
  const lines = child.stdout.split("\n");

  // get the line containing the hash
  const words = lines[lines.length - 2].split(" ");

  // get the hash from the line containing the hash
  const IpfsHash = words[1];
  console.log(`hash: ${IpfsHash}`);

  try {
    // Delete files from file system
    fs.unlinkSync(`ipfsData/${siteFile.filename}`);
    fs.unlinkSync(`ipfsData/${siteFile.filename}.zip`);
    fs.rmdirSync(`ipfsData/${dirNumber}`, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  return IpfsHash;
};

const uploadHtmlToIpfs = (req) => {
  const fs = require("fs");

  let siteFile = req.file;

  fs.writeFileSync(
    // temporarily write file to file system
    `ipfsData/${siteFile.filename}.html`,
    JSON.stringify(siteFile),
    function (err) {
      if (err) {
        console.log("err:", err);
        return console.log(err);
      }
    }
  );

  var child_process = require("child_process");

  var child = child_process.spawnSync(
    "ipfs",
    ["add", "-r", `ipfsData/${siteFile.filename}`],
    {
      encoding: "utf8",
    }
  );

  console.log("Process finished.");

  if (child.error) {
    console.log("ERROR: ", child.error);
  }

  // split up stdout into different lines
  const lines = child.stdout.split("\n");

  // get the line containing the hash
  const words = lines[lines.length - 2].split(" ");

  // get the hash from the line containing the hash
  const IpfsHash = words[1];
  console.log(`hash: ${IpfsHash}`);

  try {
    // Delete files from file system
    fs.unlinkSync(`ipfsData/${siteFile.filename}`);
    fs.unlinkSync(`ipfsData/${siteFile.filename}.html`);
  } catch (err) {
    console.log(err);
  }
  return IpfsHash;
};

const uploadNoteToIpfs = async (req) => {
  const JSONBody = req;

  const options = {
    pinataMetadata: {
      keyvalues: {
        customKey: "customValue",
        customKey2: "customValue2",
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };
  res = await pinata
    .pinJSONToIPFS(JSONBody, options)
    .then((result) => {
      //handle results here
      console.log("result: ", result);
      return result.IpfsHash;
    })
    .catch((err) => {
      //handle error here
      console.log(err);
    });

  console.log("RES: ", res);
  return res;
};

const deleteHashFromIpfs = (hash) => {
  var child_process = require("child_process");

  // NOTE: Objects added through ipfs add are pinned recursively by default
  var child = child_process.spawnSync("ipfs", ["pin", "rm", `${hash}`], {
    encoding: "utf8",
  });

  console.log("Process finished.");
  console.log(child.stdout);
};

module.exports = {
  uploadHtmlToIpfs,
  uploadZipToIpfs,
  uploadNoteToIpfs,
  deleteHashFromIpfs,
};
