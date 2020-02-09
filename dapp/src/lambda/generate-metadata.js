import IDRTCashV1 from './../../../smart-contracts/build/contracts/IDRTCashV1.json';
require('dotenv').config();

const Web3 = require('web3-eth');
const Web3Utils = require('web3-utils');
const web3 = new Web3(`https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`||'ws://localhost:8545');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const path = require('path');

function generateImage(tokenId, tokenDenomId) {
  const sn = Web3Utils.toHex(tokenId).substring(2, 11);

  let template

  switch(tokenDenomId) {
    case '0':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/1k.svg`), "utf8");
      break;
    case '1':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/2k.svg`), "utf8");
      break;
    case '2':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/5k.svg`), "utf8");
      break;
    case '3':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/10k.svg`), "utf8");
      break;
    case '4':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/20k.svg`), "utf8");
      break;
    case '5':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/50k.svg`), "utf8");
      break;
    case '6':
      template = fs.readFileSync(path.resolve(`idrtcash-template-images/100k.svg`), "utf8");
      break;
  }
  
  const $ = cheerio.load(template,{ normalizeWhitespace: true, xmlMode: true});
  $('.tokenid').text(Web3Utils.toHex(tokenId))
  $('.sn').text(sn)

  const outputPath = path.resolve(`public/static/images/${tokenId}.svg`);
  fs.outputFileSync(outputPath, $.xml(), (err) => {if (err) throw err});
}

function generateJSON(tokenId) {
  const sn = Web3Utils.toHex(tokenId).substring(2, 11);

  // Metadata follows OpenSea's metadata standard, see https://docs.opensea.io/docs/metadata-standards
  const metadata = {
    "name": `IDRTCash #${ sn }`,
    "description": `IDRTCash #${ sn }`,
    "image": `${process.env.BASE_URI}/static/images/${ tokenId }.svg`,
    "attributes": [
      {
        "trait_type": "serial number", 
        "value": `${ sn }`
      }
    ]
  }
  const outputPath = path.resolve(`public/static/metadata/${tokenId}.json`);
  fs.outputFileSync(outputPath, JSON.stringify(metadata), (err) => {if (err) throw err});
}

exports.handler = async event => {
  const tokenId = event.queryStringParameters.tokenId;

  const networkId = await web3.net.getId();
  const contract = new web3.Contract(IDRTCashV1.abi, IDRTCashV1.networks[`${ networkId }`].address);

  let tokenDenomId = await contract.methods.tokenDenom(tokenId).call();
  let denominations = await contract.methods.denominations(tokenDenomId).call();

  generateImage(tokenId, tokenDenomId);
  generateJSON(tokenId);

  return {
    statusCode: 200,
    body: `{"success": true, "metadata_uri": "/static/metadata/${ tokenId }.json"}`
  }
}
