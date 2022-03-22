const { ethers } = require("ethers")
const erc20_abi = require("./erc20_abi.json");
const Ad_abi = require("./Ad_abi.json");
require("dotenv").config()
var default_key = process.env.DEFAULT_KEY
const url = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const ERC20_contract = "0xa7f2ec11b16612769043ddde66f0cdcf3248a6ef"
const Ad_contract = "0xeb77b43f007fd5e1039adc1c466dd474ea90e0b4" 

const provider = new ethers.providers.JsonRpcProvider(url, {
    name: "Binance Smart Chain",
    chainId: 97,
});

const default_wallet = new ethers.Wallet(default_key, provider);

exports.createWallet = async function createWallet() {
    let random = ethers.Wallet.createRandom()
    let result = {}
    result["Wallet Address"] = random.address;
    result["Private Key"] = random.privateKey;
    return result;
}

exports.deposit = async function deposit(private_key, amt) {
    let wallet_instance = new ethers.Wallet(private_key, provider)
    let tx = {
        to: Ad_contract,
        value: ethers.utils.parseEther(amt)
    }
    await wallet_instance.signTransaction(tx)
    let send = await wallet_instance.sendTransaction(tx)
    let stat = (await send.wait()).status
    let status;
    let hash = (await send.wait()).transactionHash
    stat == 1? status = "SUCCESS": stat == 0 ? status = "FAILED" : status = undefined;
    let details = {}
    details["status"] = status
    details["Transaction Hash"] = hash
    return details
}

async function contract_bal() {
    let contract = new ethers.Contract(Ad_contract, Ad_abi, default_wallet)
    let bal = await contract.contract_bal()
    console.log(ethers.utils.formatEther(bal))
}

async function trans80(addr) {
    let contract = new ethers.Contract(ERC20_contract, erc20_abi, default_wallet)
    let bal = await contract.trans80(addr)
    console.log(bal.toString())
}
exports.get_balances =  async function get_balances(private_key) {
    let wallet_instance = new ethers.Wallet(private_key, provider)
    let addr = await wallet_instance.getAddress()
    let bnb_bal = ethers.utils.formatEther(await wallet_instance.getBalance())
    let contract = new ethers.Contract(ERC20_contract, erc20_abi, wallet_instance)
    let dec = await contract.decimals()
    let bal = await contract.balanceOf(addr)/ 10 ** dec;
    let balances = {}
    balances["BnB Balance"] = bnb_bal
    balances["ADT Balances"] = bal
    return balances;
}

exports.createAd = async function createAd(private_key, amt) {
    let wallet_instance = new ethers.Wallet(private_key, provider)
    let contract = new ethers.Contract(ERC20_contract, erc20_abi, wallet_instance)
    let dec = await contract.decimals()
    let transfer = await contract.transfer(Ad_contract, amt * (10 ** dec))
    let stat = (await transfer.wait()).status
    let status;
    let hash = (await transfer.wait()).transactionHash
    stat == 1? status = "SUCCESS": stat == 0 ? status = "FAILED" : status = undefined;
    let details = {}
    details["status"] = status
    details["Transaction Hash"] = hash
    return details
}

exports.withdraw = async function withdraw(addr, amt) {
    let contract = new ethers.Contract(Ad_contract, Ad_abi, default_wallet)
    let withdraw = await contract.withdraw(addr, amt)
    let stat = (await withdraw.wait()).status
    let status;
    let hash = (await withdraw.wait()).transactionHash
    stat == 1? status = "SUCCESS": stat == 0 ? status = "FAILED" : status = undefined;
    let details = {}
    details["status"] = status
    details["Transaction Hash"] = hash
    return details
}

async function change_rate(rate) {
    let contract = new ethers.Contract(Ad_contract, Ad_abi, default_wallet)
    let c_rate = await contract.change_rate(rate)
    console.log(c_rate)
}

async function change_vault(addr) {
    let contract = new ethers.Contract(Ad_contract, Ad_abi, default_wallet)
    let vault = await contract.change_vault(addr)
    console.log(vault)
}

exports.get_rate = async function get_rate() {
    let contract = new ethers.Contract(Ad_contract, Ad_abi, default_wallet)
    let rate = await contract.rate()
    let rate_val = rate.toNumber()
    let final = rate/1000000000000000000
    return {"Rate": final}
}
