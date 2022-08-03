const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
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