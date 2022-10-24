const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};

/*
const PucCoinAddress = "0x07fBbB83C0b367B214D66A2376c59436c79a0D96";
const PucMarketplace = artifacts.require("PucMarketplace");

module.exports = function (deployer) {
  deployer.deploy(PucMarketplace, PucCoinAddress);
};
*/
