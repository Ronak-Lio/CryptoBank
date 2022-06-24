const CToken = artifacts.require("CToken");
const Eth = artifacts.require("Eth");
const WebToken = artifacts.require("WebToken");
const WebSwap = artifacts.require("WebSwap");
const BlockToken = artifacts.require("BlockToken");
const BlockSwap = artifacts.require("BlockSwap");


module.exports = async function (deployer) {
  await deployer.deploy(CToken, 100000000);
  const token = await CToken.deployed();

  await deployer.deploy(Eth, CToken.address);
  const eth = await Eth.deployed();

  await token.transfer(eth.address, 5000000);

  await deployer.deploy(WebToken, 100000000);
  const webToken = await WebToken.deployed();

  await deployer.deploy(WebSwap, WebToken.address ,CToken.address );
  const webSwap = await WebSwap.deployed();

  await webToken.transfer(webSwap.address, 100000000);

  await token.transfer(webSwap.address, 5000000);

  await deployer.deploy(BlockToken, 100000000);
  const blockToken = await BlockToken.deployed();

  await deployer.deploy(BlockSwap, BlockToken.address ,CToken.address );
  const blockSwap = await BlockSwap.deployed();

  await blockToken.transfer(blockSwap.address, 100000000);

  await token.transfer(blockSwap.address, 5000000);
};
