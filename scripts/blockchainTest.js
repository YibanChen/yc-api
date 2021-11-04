const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const chalk = require("chalk");
const assert = require("assert");
const performance = require("perf_hooks").performance;
const sleep = require("../app/util/util");

const log = console.log;
const WAITTIME = 6001;

const testNoteCreationAndTransfer = async (api) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");
  const BOB = keyring.addFromUri("//Bob");
  const NOTEHASH = "QmcHfmbkmRDwZX54cXXHSRSEj2An4sCjbG3sqCkEJPuZmC";

  txHash = await api.tx.note.create(NOTEHASH);

  const nextNoteIdObject = await api.query.note.nextNoteId();
  const noteId = nextNoteIdObject.words[0];

  // Transfer the note to the recipient
  let transfer = api.tx.note.transfer(BOB.address, noteId);

  // Sign and send these transacations as a batch so that password prompt only appears once
  txs = [txHash, transfer];

  await await api.tx.utility.batch(txs).signAndSend(ALICE);

  const notes = await api.query.note.notes.entries(BOB.address);

  let status = 0;

  notes.forEach(
    ([
      {
        args: [],
      },
      note,
    ]) => {
      if (note.toHuman() === NOTEHASH) {
        status = 1;
      }
    }
  );

  return status;
};

const testSiteCreation = async (api) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");

  const SITEHASH = "QmaUrqNzdmoaSUAVsUjg6hzHDbuQ2awuTyqZ1bbhdNPpjv";
  const SITENAME = "testname";
  const nextSiteIdObject = await api.query.site.nextSiteId();
  const siteId = nextSiteIdObject.words[0];
  await api.tx.site.create(SITEHASH, SITENAME).signAndSend(ALICE);
  await sleep(WAITTIME);

  const site = await api.query.site.sites(ALICE.address, siteId);
  const siteObject = JSON.parse(site.toString());
  if (siteObject.site_name === "testname") {
    return [1, siteId];
  }
  return [0, siteId];
};

const testSiteRetrieval = async (api, siteId) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");

  const site = await api.query.site.sites(ALICE.address, siteId);

  const siteObject = JSON.parse(site.toString());
  if (siteObject.site_name === "testname") {
    return 1;
  }
  return 0;
};

const testSiteModification = async (api, siteId) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");

  await api.tx.site.modify("new cid", "testname", siteId).signAndSend(ALICE);
  await sleep(WAITTIME);

  const site = await api.query.site.sites(ALICE.address, siteId);
  const siteObject = JSON.parse(site.toString());

  if (siteObject.ipfs_cid === "new cid") {
    return 1;
  }
  return 0;
};

const testSiteTransfer = async (api, siteId) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");
  const BOB = keyring.addFromUri("//Bob");

  await api.tx.site.transfer(BOB.address, siteId).signAndSend(ALICE);
  await sleep(WAITTIME);
  const site = await api.query.site.sites(BOB.address, siteId);
  await sleep(1000);
  const siteObject = JSON.parse(site.toString());
  if (siteObject.ipfs_cid === "new cid") {
    return 1;
  }

  return 0;
};

const testSiteListing = async (api) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");

  const SITEHASH = "QmaUrqNzdmoaSUAVsUjg6hzHDbuQ2awuTyqZ1bbhdNPpjv";
  const SITENAME = "SaleSite";
  const nextSiteIdObject = await api.query.site.nextSiteId();
  const siteId = nextSiteIdObject.words[0];

  await api.tx.site.create(SITEHASH, SITENAME).signAndSend(ALICE);
  await sleep(WAITTIME);
  await api.tx.site.listing(siteId, 3).signAndSend(ALICE);
  await sleep(WAITTIME);
  const sitePrice = await api.query.site.sitePrices(siteId);

  if (sitePrice.toJSON() === 3) {
    return [1, siteId];
  }
  return [0, siteId];
};

const testSitePurchase = async (api, siteId) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");
  const BOB = keyring.addFromUri("//Bob");

  await api.tx.site.buy(ALICE.address, siteId, 3).signAndSend(BOB);
  await sleep(WAITTIME);

  const site = await api.query.site.sites(BOB.address, siteId);
  if (JSON.parse(site.toString()).site_name === "SaleSite") {
    return 1;
  }
  return 0;
};

const testSiteBadListing = async (api) => {
  const keyring = new Keyring({ type: "sr25519" });
  const ALICE = keyring.addFromUri("//Alice");
  const BOB = keyring.addFromUri("//Bob");
  const SITEHASH = "QmaUrqNzdmoaSUAVsUjg6hzHDbuQ2awuTyqZ1bbhdNPpjv";
  const SITENAME = "BadListing";
  const nextSiteIdObject = await api.query.site.nextSiteId();
  const siteId = nextSiteIdObject.words[0];

  await api.tx.site.create(SITEHASH, SITENAME).signAndSend(ALICE);

  await sleep(WAITTIME);

  await api.tx.site.listing(siteId, 10).signAndSend(BOB);

  await sleep(WAITTIME);
  const sitePrice = await api.query.site.sitePrices(siteId);

  if (sitePrice.toJSON() === null) {
    return 1;
  }
  return 0;
};

const main = async () => {
  log(
    chalk.blueBright(` __   __  ___   _______  _______  __    _  _______  __   __  _______  __    _ 
  |  | |  ||   | |  _    ||   _   ||  |  | ||       ||  | |  ||       ||  |  | |
  |  |_|  ||   | | |_|   ||  |_|  ||   |_| ||       ||  |_|  ||    ___||   |_| |
  |       ||   | |       ||       ||       ||       ||       ||   |___ |       |
  |_     _||   | |  _   | |       ||  _    ||      _||       ||    ___||  _    |
    |   |  |   | | |_|   ||   _   || | |   ||     |_ |   _   ||   |___ | | |   |
    |___|  |___| |_______||__| |__||_|  |__||_______||__| |__||_______||_|  |__| \n \n Starting YibanChen blockchain tests...`)
  );

  const t0 = performance.now();

  const wsProvider = new WsProvider("wss://testnet.yibanchen.com:443");
  const api = await ApiPromise.create({
    // Create an API instance
    provider: wsProvider,
    types: {
      ClassId: "u32",
      ClassIdOf: "ClassId",
      TokenId: "u64",
      TokenIdOf: "TokenId",
      TokenInfoOf: {
        metadata: "CID",
        owner: "AccountId",
        data: "TokenData",
      },
      SiteIndex: "u32",
      Site: {
        ipfs_cid: "Text",
        site_name: "Text",
      },
      ClassInfoOf: {
        metadata: "string",
        totalIssuance: "string",
        owner: "string",
        data: "string",
      },
      Note: "Text",
      NoteIndex: "u32",
    },
  });

  let noteTransferTestResult = await testNoteCreationAndTransfer(api);
  assert.equal(noteTransferTestResult, 1);
  console.clear();
  log(chalk.green("Note Creation and Transfer Test Passed"));

  let [siteCreationTestResult, siteId] = await testSiteCreation(api);
  assert.equal(siteCreationTestResult, 1);
  log(chalk.green("- Site Creation Test Passed"));

  let siteRetrievalTestResult = await testSiteRetrieval(api, siteId);
  assert.equal(siteRetrievalTestResult, 1);
  log(chalk.green("- Site Retrieval Test Passed"));

  let siteModificationTestResult = await testSiteModification(api, siteId);
  assert.equal(siteModificationTestResult, 1);
  log(chalk.green("- Site Modification Test Passed"));

  let siteTransferTestResult = await testSiteTransfer(api, siteId);
  assert.equal(siteTransferTestResult, 1);
  log(chalk.green("- Site Transfer Test Passed"));

  let [siteListingTestResult, saleSiteId] = await testSiteListing(api);
  assert.equal(siteListingTestResult, 1);
  log(chalk.green("- Site Listing Test Passed"));

  let sitePurchaseTestResult = await testSitePurchase(api, saleSiteId);
  assert.equal(sitePurchaseTestResult, 1);
  log(chalk.green("- Site Purchase Test Passed"));

  let siteBadListingTestResult = await testSiteBadListing(api);
  assert.equal(siteBadListingTestResult, 1);
  log(chalk.green("- Site Bad Listing Test Passed"));

  log(chalk.green("OK"));
  const t1 = performance.now();
  log(`Blockchain tests took ${(t1 - t0) / 1000} seconds.`);
};

main()
  .catch(console.error)
  .finally(() => process.exit());
