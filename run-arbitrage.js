require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3( // Connect to ethereum using websocket
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);


// Emit event data when there is a new block and run async callback
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
        console.log(`New block received. Block #${block.number}`);
    })
    .on('event', error => {
        console.log(error);
    });
