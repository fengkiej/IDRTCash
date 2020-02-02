require('dotenv').config({ path: '../.env' });

const { scripts, ConfigManager } = require('@openzeppelin/cli');
const { add, push, create } = scripts;

const ERC20IDRTSample = artifacts.require("ERC20IDRTSample");
const Lighthouse = artifacts.require("Lighthouse");

let denoms = JSON.parse(process.env.DENOMS);
let ERC20IDRTAddress;
let LighthouseAddress;

async function deploy(options) {
  add({ contractsData: [{ name: 'IDRTCashV1', alias: 'IDRTCash' }] });
  await push(options);
  await create(Object.assign({ contractAlias: 'IDRTCash', methodName: 'initialize', methodArgs: [denoms, ERC20IDRTAddress, LighthouseAddress, process.env.BASE_URI] }, options));

  if(options.network == 'development') {
    const lighthouse = await Lighthouse.deployed()
    await lighthouse.write(0,0);
  }
}

module.exports = async function(deployer, networkName, accounts) {
  switch(networkName) {
    case 'development':
      ERC20IDRTAddress = ERC20IDRTSample.address;
      LighthouseAddress = Lighthouse.address;
      break;
    case 'testnet':
      ERC20IDRTAddress = ERC20IDRTSample.address;
      LighthouseAddress = process.env.LIGHTHOUSE_ADDRESS;
      break;
    case 'mainnet':
      ERC20IDRTAddress = process.env.ERC20_ADDRESS;
      LighthouseAddress = process.env.LIGHTHOUSE_ADDRESS;
      break;  
  }

  await deployer.then(async () => {
    const { network, txParams } = await ConfigManager.initNetworkConfiguration({ network: networkName, from: accounts[0]});

    await deploy({ network, txParams })
  });
}