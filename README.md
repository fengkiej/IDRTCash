# IDRTCash - ERC721-based Rupiah Token Cryptocollectibles
## General Description ##
IDRT is a crypto-asset which represents the value of Indonesian Rupiah, issued by PT Rupiah Token Indonesia [1]. The currency in which it is based on, the Indonesian Rupiah, is denominated to various denominations i.e. Rp1000, Rp2000, Rp5000, Rp10000, Rp20000, Rp50000, and Rp100000 [2]. 

IDRTCash is intended to mimic the rupiah denominations as ERC721 cryptocollectibles by locking the IDRT ERC20 in a smart contract and issue a corresponding ERC721 token with randomized unique token ID to it. This project is created for Consensys Academy's Blockchain Developer Online Bootcamp October 2019 final project.

## Features ##
* Mint IDRTCash from IDRT ERC20 to various IDR denominations.
* Burn IDRTCash to IDRT ERC20
* Transfer ERC721 IDRTCash to any Ethereum address
* Upgradable contract pattern using OpenZeppelin's SDK
* Collect IDRTCash with unique serial number/token ID

## Preview ##
Rinkeby: http://139.162.168.113:8000/
![IDRTCash](https://user-images.githubusercontent.com/14020439/73609794-b85a6700-4603-11ea-9509-1371a8e86500.gif)

## Running on Local ##
1. Clone the repository
```
git clone https://github.com/fengkiej/IDRTCash.git
cd IDRTCash
```

2. Navigate to `smart-contracts` folder and install dependecies, and add .env variables.
```
cd smart-contracts
npm install
```
`.env:`
```
BASE_URI=localhost:8000/static/metadata
DENOMS=[1000,2000,5000,10000,20000,50000,100000]
LIGHTHOUSE_ADDRESS=0x613D2159db9ca2fBB15670286900aD6c1C79cC9a
```

3. Run local Ganache instance.
```
npx ganache-cli -d
```

4. Run Truffle migrate
```
npx truffle migrate --network development
```

5. Navigate to `dapp` folder and install dependencies.
```
cd ../dapp
npm install
node node_modules/node-sass/scripts/install.js
npm rebuild node-sass
```

6. Serve dapp by running:
```
npm run start
```

7. Import Ganache's deterministic wallet.
```
Mnemonic: myth like bonus scare over problem client lizard pioneer submit female collect

OR

First account private key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

8. Go to `localhost:8000` to start interacting with IDRTCash or `139.162.168.113:8000` for Rinkeby version.

## Possible Improvements ##
- Host the metadata and image at IPFS.
- Frontend revamping.
- Develop for possible use with Plasma Cash.

## References ##
1. https://rupiahtoken.com/whitepaper.pdf
2. https://www.bi.go.id/id/sistem-pembayaran/instrumen/data-uang/Contents/Default.aspx
