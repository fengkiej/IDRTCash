
const ERC20IDRTSample = artifacts.require("ERC20IDRTSample");
const Lighthouse = artifacts.require("Lighthouse");

module.exports = function(deployer, networkName) {
  switch(networkName) {
    case 'development':
      deployer.deploy(ERC20IDRTSample);
      deployer.deploy(Lighthouse);
      break;
    case 'testnet':
      deployer.deploy(ERC20IDRTSample);
      break;
  }
}