const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx').Transaction;

const app = express();

const ck = require('ckey');

const mailgun = require("mailgun-js");
const DOMAIN = ck.MAILGUN_DOMAIN;
const mg = mailgun({apiKey: ck.MAILGUN_API_KEY, domain: DOMAIN});

//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider(ck.WEB3_PROVIDER));

// Load in contracts
let boomerang = {};
let boomerangToken = {};
try {
    var fs = require('fs');
    var boomerangJSON = "../build/contracts/Boomerang.json";
    var boomerangTokenJSON = "../build/contracts/BoomerangToken.json";
    var parsedboomerangJSON = JSON.parse(fs.readFileSync(boomerangJSON));
    var parsedboomerangTokenJSON = JSON.parse(fs.readFileSync(boomerangTokenJSON));
    var boomerangABI = parsedboomerangJSON.abi;
    var boomerangTokenABI = parsedboomerangTokenJSON.abi;
    boomerang = new web3js.eth.Contract(boomerangABI, ck.BOOMERANG_ADDRESS);
    boomerangToken = new web3js.eth.Contract(boomerangTokenABI, ck.BOOMERANG_TOKEN_ADDRESS);
} catch (e) {
  console.log(e);
}

app.get('/sendtx',function(req,res){

    var myAddress = ck.EXAMPLE_PUBLIC_KEY;
    var privateKey = Buffer.from(ck.EXAMPLE_PRIVATE_KEY, 'hex')
    var toAddress = '0xB4DC65f8adE347d9D87D0d077F256aFC798c4dC6';

    var count;
    // get transaction count, later will used as nonce
    web3js.eth.getTransactionCount(myAddress).then(function(v){
        console.log("Count: "+v);
        count = v;
        var amount = web3js.utils.toHex(1e16);
        //creating raw tranaction
        //var rawTransaction = {"from":myAddress, "gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(210000),"to":toAddress,"value":"0xDE0B6B3A7640000","data":'',"nonce":web3js.utils.toHex(count)}
        var rawTransaction = {"from":myAddress, "gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(2100000),"to":ck.BOOMERANG_ADDRESS,"value":"0x0","data":boomerang.methods.requestBusinessReview('0x097ca5CBbCb44839625A3eD1e6aD649ce961B4A9', web3js.utils.toWei('10'), '10', 'Purchased microwave from online store').encodeABI(),"nonce":web3js.utils.toHex(count)}
        //var rawTransaction = {"from":myAddress, "gasPrice":web3js.utils.toHex(20* 1e9),"gasLimit":web3js.utils.toHex(210000),"to":ck.BOOMERANG_ADDRESS,"value":"0x0","data":boomerang.methods.addWorkerRequest('0x097ca5CBbCb44839625A3eD1e6aD649ce961B4A9').encodeABI(),"nonce":web3js.utils.toHex(count)}
        console.log(rawTransaction);
        //creating tranaction via ethereumjs-tx
        var transaction = new Tx(rawTransaction);
        //signing transaction with private key
        transaction.sign(privateKey);
        //sending transacton via web3js module
        web3js.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
        .on('transactionHash', console.log);
    })
    const data = {
        from: 'Boomerang Ratings and Reviews <auto@boomerang.reviews>',
        to: 'the.big.kb123@gmail.com',
        subject: "Frank's Hardware is requesting your feedback and wants to reward you!",
        text: "You recently had a transaction with Frank's Hardware. They want to obtain your feedback and to reward you 10 BOOM for your transaction! Visit Boomerang.Reviews to leave your feedback and claim your reward!"
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
});

app.get('/sendemail/:email',function(req,res){
    console.log(req.params.email);

    const data = {
        from: 'Boomerang Ratings and Reviews <auto@boomerang.reviews>',
        to: req.params.email,
        subject: 'Join Boomerang Ratings and Reviews!',
        text: "You recently had a transaction with Frank's Hardware. They want to obtain your feedback and to reward you for your future purchases! Sign up for Boomerang @ Boomerang.Reviews"
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
});

app.listen(3001, () => console.log('Infura backend listening on port 3001!'))