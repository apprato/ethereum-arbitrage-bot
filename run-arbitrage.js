require('dotenv').config();
const Web3 = require('web3');
// Connect to ethereum using websocket
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFRA_URL)
);