# IDRTCash - ERC721-based Rupiah Token Cryptocollectibles
## General Description
IDRT is a crypto-asset which represents the value of Indonesian Rupiah, issued by PT Rupiah Token Indonesia [1]. The currency in which it is based on, the Indonesian Rupiah, is denominated to various denominations i.e. Rp1, Rp50, Rp100, Rp200, Rp500, Rp1000, Rp2000, Rp5000, Rp10000, Rp20000, Rp50000, and Rp100000 [2]. IDRTCash is intended to mimic the rupiah denominations as ERC721 cryptocollectibles by locking the IDRT ERC20 in a smart contract and issue a corresponding ERC721 token with randomized unique token ID to it. This project is created for Consensys Academy's Blockchain Developer Online Bootcamp October 2019 final project.

## Features
[x] Mint IDRTCash from IDRT ERC20 to various IDR denominations 
[x] Burn IDRTCash to IDRT ERC20
[x] Transfer ERC721 IDRTCash to any Ethereum address
[x] Upgradable contract pattern using OpenZeppelin's SDK
[x] Collect IDRTCash with unique serial number/token ID

## Getting Started
```
git clone https://github.com/fengkiej/<project_name>
npm install
npm run start
```

## References
[1] https://rupiahtoken.com/whitepaper.pdf
[2] https://www.bi.go.id/id/sistem-pembayaran/instrumen/data-uang/Contents/Default.aspx
