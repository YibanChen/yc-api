const expect = require("chai").expect;
const chai = require("chai");
const fs = require("fs");
const {
  uploadNoteToIpfs,
  deleteHashFromIpfs,
  uploadHtmlToIpfs,
} = require("../app/ipfs/ipfs");
chai.use(require("sinon-chai"));
const getFileObjectFromLocalPath = require("get-file-object-from-local-path");

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const SiteModel = require("../app/models/site.model");
const NoteModel = require("../app/models/note.model");

describe("src/models/site", () => {
  const Site = SiteModel(sequelize, dataTypes);
  const site = new Site();

  checkModelName(Site)("site");

  context("Properties", () => {
    ["siteName", "IpfsHash", "walletAddress", "uuid", "siteIndex"].forEach(
      checkPropertyExists(site)
    );
  });
});

describe("src/models/note", () => {
  const Note = NoteModel(sequelize, dataTypes);
  const note = new Note();

  checkModelName(Note)("note");

  context("Properties", () => {
    ["IpfsHash", "walletAddress", "uuid", "noteIndex"].forEach(
      checkPropertyExists(note)
    );
  });
});

describe("ipfs note upload", async () => {
  const noteToUpload = {
    note: "test message",
    subject: "test Subject",
    timestamp: "2021-08-25T17:28:12.888Z",
    encrypted: false,
    sender: { address: "5FyNFTsWZ8mZpR83rED6gc1gQD85jKbsR7d4SV5aiNAPvMGH" },
  };

  const hash = await uploadNoteToIpfs(noteToUpload);
  console.log("hash in test:", hash);
  it("returns the expected hash", () => {
    expect(hash).to.equal("QmWZPoPbxVpNhh2HZhzWFF7s4CRN7XLjGXyokN3sXqkNdj");
  });
});

describe("ipfs hash deletion", () => {
  const hash = "QmWZPoPbxVpNhh2HZhzWFF7s4CRN7XLjGXyokN3sXqkNdj";
  it("does not throw an error", () => {
    expect(() => deleteHashFromIpfs(hash)).to.not.throw();
  });
});

// TODO: get this test to work (issues with file reading/writing)
/* describe("ipfs html upload", () => {
  const data = new getFileObjectFromLocalPath.LocalFileData("./sample.html");
  data["filename"] = "sample";
  console.log("data: ", data);
  req = { file: data };

  it("does not throw an error", () => {
    expect(() => uploadHtmlToIpfs(req)).to.not.throw();
  });
});
 */
