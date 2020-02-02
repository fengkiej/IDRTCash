import ERC20IDRTSample from './../../smart-contracts/build/contracts/ERC20IDRTSample.json'
import IDRTCashV1 from './../../smart-contracts/build/contracts/IDRTCashV1.json'
import Lighthouse from './../../smart-contracts/build/contracts/Lighthouse.json'


const options = {
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://localhost:8545'
    }
  },
  contracts: [
    ERC20IDRTSample, IDRTCashV1, Lighthouse
  ],
  polls: {
    accounts: 1500,
  },
  syncAlways: true,
  events: {
    // IDRTCashV1: [{
    //   eventName: 'Transfer'
    //   }
    // ]
  },
};

export default options;