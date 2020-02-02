require('dotenv').config({ path: '../.env' });

const { scripts, ConfigManager } = require('@openzeppelin/cli');
const { add, push, update } = scripts;

async function deploy(options) {
  add({ contractsData: [{ name: 'IDRTCashV2', alias: 'IDRTCash' }] });
  await push(options);
  await update(Object.assign({ contractAlias: 'IDRTCash' }, options));
}

module.exports = async function(deployer, networkName, accounts) {
  deployer.then(async () => {
    const { network, txParams } = await ConfigManager.initNetworkConfiguration({ network: networkName, from: accounts[0]});

    await deploy({ network, txParams });
  })
}