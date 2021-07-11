require('dotenv').config();
const Web3 = require('web3');
const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');

const web3 = new Web3( // Connect to ethereum using websocket
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

const kyber = new web3.eth.Contract(
    abis.kyber.kyberNetworkProxy,
    addresses.kyber.kyberNetworkProxy
);

const AMOUNT_ETH = 100;
const RECENT_ETH_PRICE = 230; // @TODO - Update this regularly.
const AMOUNT_ETH_WEI = web3.utils.toWei(AMOUNT_ETH.toString());
const AMOUNT_DAI_WEI = web3.utils.toWei((AMOUNT_ETH * RECENT_ETH_PRICE).toString()); // Convert to string as sometimes this exceeds javascripts length for numbers



// Emit event data when there is a new block and run async callback
web3.eth.subscribe('newBlockHeaders')
  .on('data', async block => {
    console.log(`New block received. Block # ${block.number}`);

    const kyberResults = await Promise.all([ // 2 requests at one time, Read only calls are free, transactions are not.
        kyber
          .methods
          .getExpectedRate(
            addresses.tokens.dai, // source token
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // destinatin token
            AMOUNT_DAI_WEI
          )
          .call(),
        kyber
          .methods
          .getExpectedRate(
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // destinatin token
            addresses.tokens.dai, // source token
            AMOUNT_ETH_WEI
          )
          .call()
    ]);
    console.log('DAI -> ETH');
    console.log('ETH -> DAI');
    console.log(kyberResults);
  })
  .on('error', error => {
    console.log(error);
  });