const express = require("express")
const bodyParser = require("body-parser")
const { deposit, createWallet, get_balances, createAd, withdraw } = require("./Factory.js")

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get("/Wallet", (req, res) => {
    createWallet().then((e) => res.send(e))
})

app.get("/balances/:key/", (req, res) => {
    let { key } = req.params
    get_balances(key).then(e => res.send(e))
})

app.get("/deposit/:key/:amt", (req, res) => {
    let { key, amt } = req.params
    deposit(key, amt).then(e => res.send(e))
})

app.get("/createAd/:key/:amt", (req, res) => {
    let { key, amt } = req.params
    createAd(key, amt).then(e => res.send(e))
})

app.get("/withdraw/:addr/:amt", (req, res) => {
    let { addr, amt } = req.params
    withdraw(addr, amt).then(e => res.send(e))
})

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`))