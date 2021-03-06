
const ERC20IDRTSample = artifacts.require("ERC20IDRTSample");
const Lighthouse = artifacts.require("Lighthouse");

module.exports = function(deployer, networkName) {
  switch(networkName) {
    case 'development':
      deployer.deploy(ERC20IDRTSample, "Rupiah Token Sample", "IDRTS", 2);
      deployer.deploy(Lighthouse);
      break;
    case 'rinkeby' || 'testnet':
      deployer.deploy(ERC20IDRTSample, "Rupiah Token Sample", "IDRTS", 2);
      break;
  }
}