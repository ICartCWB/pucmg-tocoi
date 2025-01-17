/*const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
*/

/*
// Para publicação na Goerli
const PucCoinAddress = "0x07fBbB83C0b367B214D66A2376c59436c79a0D96";
const PucMarketplace = artifacts.require("PucMarketplace");

module.exports = function (deployer) {
  deployer.deploy(PucMarketplace, PucCoinAddress);
};
*/

// Para publicação na Ganache 
const Tocoi = artifacts.require("Tocoi");
const TocoiMarket = artifacts.require("TocoiMarket");

module.exports = async function (deployer) {
  await deployer.deploy(Tocoi);
  await Tocoi.deployed();

  await deployer.deploy(TocoiMarket, Tocoi.address);
};
/*
const PucCoin = artifacts.require("PucCoin");
const PucMarketplace = artifacts.require("PucMarketplace");

module.exports = async function (deployer) {
  await deployer.deploy(PucCoin);
  await PucCoin.deployed();

  await deployer.deploy(PucMarketplace, PucCoin.address);
};
*/