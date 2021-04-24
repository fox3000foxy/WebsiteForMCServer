const express = require('express')
const fs = require('fs')
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
const params = JSON.parse(fs.readFileSync("./serverConfig.json", "utf8"))
const mcData = require("minecraft-data")(params.version)
params["username"] = "InfosBot"
const bot = mineflayer.createBot(params)

app.get('/mcData', (req, res) => {
    res.send(mcData.itemsByName)
})

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/images/icon.png')
})

app.get('/avatarException', (req, res) => {
    const avatarException = JSON.parse(fs.readFileSync("./data/avatarException.json", 'utf8'));
    res.send(avatarException)
})

app.get('/disp/:type/:name', (req, res) => {
    res.sendFile(__dirname + "/disp/" + req.params.name + "." + req.params.type)
})


let COINBOARD_NAME = "Coins"
let taken = 0;

bot.on('spawn', () => {
    if (taken == 0)
        mineflayerViewer(bot, { port: 3001 })
    taken = 1
    console.log("Info bot ready !")
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/coins/:user', (req, res) => {
    let coins = bot.scoreboards[COINBOARD_NAME].itemsMap[req.params.user].value.toString()
    res.send(coins)
})

app.get('/players', (req, res) => {
    const playerList = Object.keys(bot.players)
    res.send(playerList)
})

app.get('/feedback', (req, res) => {
    let feedbackFile = fs.readFileSync("./data/feedback.json", () => { })
    res.send(feedbackFile.toString())
})

app.get('/staff', (req, res) => {
    let feedbackFile = fs.readFileSync("./data/staff.json", () => { })
    res.send(feedbackFile.toString())
})

app.get('/market', (req, res) => {
    let marketFile = fs.readFileSync("./data/market.json", () => { })
    res.send(marketFile.toString())
})

app.post('/feedback.html', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => { })
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => { })
    let file = fs.readFileSync("./public/feedback.html", () => { })
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
    feedPush(req.body)
})

app.post('/login.html', (req, res) => {
    let accountFile = JSON.parse(fs.readFileSync("./data/accounts.json", () => { }))
    let validated;
    for (i = 0; i < accountFile.length; i++) {
        if (req.body.user == accountFile[i].name && req.body.password == accountFile[i].pass) {
            res.send(`
            <script>
            document.cookie = "user=${accountFile[i].nameig}"
            location.href = "/login.html"
            </script>
            `)
            return;
        }
    }
    res.send(`
        <script>
        location.href = "/login.html"
        </script>
        `)
})

app.post('/signup', (req, res) => {
    let accountFile = JSON.parse(fs.readFileSync("./data/accounts.json", () => { }))
    accountFile.push({
        name: req.body.user,
        pass: req.body.password,
        nameig: req.body.nameig
    })
    fs.writeFile("./data/accounts.json", JSON.stringify(accountFile), () => { })
    res.send(`
    <script>
    document.cookie = "user=${req.body.nameig}"
    location.href = "/login.html"
    </script>
    `)
})

function feedPush(params) {
    let feedbackFile = fs.readFileSync("./data/feedback.json", () => { })
    let feedbackArray = JSON.parse(feedbackFile.toString())
    feedbackArray.push({
        name: params.name,
        feedback: params.feedback,
    })
    fs.writeFile("./data/feedback.json", JSON.stringify(feedbackArray), () => { })
}

app.get('/item/:item', (req, res) => {
    res.sendFile(__dirname + "/node_modules/prismarine-viewer/public/textures/1.16.4/items/" + req.params.item + ".png", () => { res.sendFile(__dirname + "/public/images/undefined_item.png") })
})

app.get('/', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => { })
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => { })
    let file = fs.readFileSync("./public/index.html", () => { })
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
})

app.get('/:page', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => { })
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => { })
    let file = fs.readFileSync("./public/" + req.params.page, () => { })
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
})

app.get('/buy/:item/:count/:cost/:user', (req, res) => {
    let marketFile = JSON.parse(fs.readFileSync("./data/market.json", () => { }))
    for (i = 0; i < marketFile.length; i++) {
        if (marketFile[i].name == req.params.item && marketFile[i].count == JSON.parse(req.params.count) && marketFile[i].cost == JSON.parse(req.params.cost)) {
            bot.chat(`/execute if score ${req.params.user} ${COINBOARD_NAME} matches ${req.params.cost}.. run give ${req.params.user} ${req.params.item} ${req.params.count}`)
            bot.chat(`/execute if score ${req.params.user} ${COINBOARD_NAME} matches ${req.params.cost}.. run scoreboard players remove ${req.params.user} ${COINBOARD_NAME} ${req.params.cost}`)
        }
    }
    res.send("Ok")
})

app.use(express.static('public'));