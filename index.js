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
 
 const localtunnel = require('localtunnel');
(async () => {
  const tunnel = await localtunnel({ port: 3000 , subdomain:params.subdomain});
  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  tunnel.url;

  tunnel.on('close', () => {
    // tunnels are closed
  });
})();
 
 
const electron = require('electron');
const { Tray, Menu } = require('electron');

params["username"] = "LegniaWeb"
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
	bot.chat("/register WebMDP WebMDP")
	bot.chat("/login WebMDP")
	setInterval(()=>{bot.chat("Notre site est https://"+params.subdomain+".loca.lt/")},60000)
	// bot.on('message',(mess)=>{
		// if (mess.extra)
			// if (mess.extra.length == 7)
				// console.log(mess.extra[6].text.split(" $")[1])
			// else console.log(mess)
	// })
	// setTimeout(()=>{bot.chat('/money _Fox3000_')},1000)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} and on https://${params.subdomain}.loca.lt`)
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
    let feedbackFile = fs.readFileSync("./data/feedback.json", () => {})

    res.send(feedbackFile.toString())
})

app.get('/staff', (req, res) => {
    let feedbackFile = fs.readFileSync("./data/staff.json", () => {})

    res.send(feedbackFile.toString())
})

app.get('/market', (req, res) => {
    let marketFile = fs.readFileSync("./data/market.json", () => {})

    res.send(marketFile.toString())
})

app.post('/feedback.html', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => {})
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => {})
    let file = fs.readFileSync("./public/feedback.html", () => {})
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
    feedPush(req.body)
})

app.post('/market.html', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => {})
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => {})
    let file = fs.readFileSync("./public/market.html", () => {})
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
			// if (bot.scoreboards[COINBOARD_NAME].itemsMap[req.body.user].value >= req.params.cost){
				// bot.chat(`/scoreboard players add ${req.body.render} ${COINBOARD_NAME} ${req.body.numberOf}`)
				// bot.chat(`/scoreboard players remove ${req.body.user} ${COINBOARD_NAME} ${req.body.numberOf}`)
			// }
})

app.post('/login.html', (req, res) => {
    let accountFile = JSON.parse(fs.readFileSync("./data/accounts.json", () => {}))
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
    let accountFile = JSON.parse(fs.readFileSync("./data/accounts.json", () => {}))
    accountFile.push({
        name: req.body.user,
        pass: req.body.password,
        nameig: req.body.nameig
    })
    fs.writeFile("./data/accounts.json", JSON.stringify(accountFile), () => {})

    res.send(`
    <script>
    document.cookie = "user=${req.body.nameig}"
    location.href = "/login.html"
    </script>
    `)
})

function feedPush(params) {
    let feedbackFile = fs.readFileSync("./data/feedback.json", () => {})
    let feedbackArray = JSON.parse(feedbackFile.toString())
    feedbackArray.push({
        name: params.name,
        feedback: params.feedback,
    })
    fs.writeFile("./data/feedback.json", JSON.stringify(feedbackArray), () => {})
}

app.get('/item/:item', (req, res) => {
    res.sendFile(__dirname + "/imgException/" + req.params.item + ".png", () => {
        res.sendFile(__dirname + "/node_modules/prismarine-viewer/public/textures/1.16.4/items/" + req.params.item + ".png", () => {
            res.sendFile(__dirname + "/public/images/undefined_item.png")
        })
    })
})

app.get('/', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => {})
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => {})
    let file = fs.readFileSync("./public/index.html", () => {})
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
})

app.get('/:page', (req, res) => {
    let tempStart = fs.readFileSync("./template/templateStart.html", () => {})
    let tempEnd = fs.readFileSync("./template/templateEnd.html", () => {})
    let file = fs.readFileSync("./public/" + req.params.page, () => {})
    let final = file.toString().replace("{tempStart}", tempStart)
    final = final.toString().replace("{tempEnd}", tempEnd)
    res.send(final)
})

app.get('/buy/:item/:count/:cost/:user', (req, res) => {
    let marketFile = JSON.parse(fs.readFileSync("./data/market.json", () => {}))
    for (i = 0; i < marketFile.buyList.length; i++) {
        if (marketFile.buyList[i].name == req.params.item && marketFile.buyList[i].count == JSON.parse(req.params.count) && marketFile.buyList[i].cost == JSON.parse(req.params.cost)) {
            let tags;
            if (JSON.stringify(marketFile.buyList[i].tags))
                tags = JSON.stringify(marketFile.buyList[i].tags)
            else
                tags = ""
			if (bot.scoreboards[COINBOARD_NAME].itemsMap[req.params.user].value >= req.params.cost){
            bot.chat(`/give ${req.params.user} ${req.params.item}${tags} ${req.params.count}`)
            bot.chat(`/scoreboard players remove ${req.params.user} ${COINBOARD_NAME} ${req.params.cost}`)
			}
			
        }
    }

    res.send("Ok")
})
app.get('/sell/:item/:count/:cost/:user', (req, res) => {
    let marketFile = JSON.parse(fs.readFileSync("./data/market.json", () => {}))
    for (i = 0; i < marketFile.sellList.length; i++) {
        if (marketFile.sellList[i].name == req.params.item && marketFile.sellList[i].count == JSON.parse(req.params.count) && marketFile.sellList[i].cost == JSON.parse(req.params.cost)) {
            bot.chat(`/clear ${req.params.user} ${req.params.item} ${req.params.count}`)
            bot.chat(`/scoreboard players add ${req.params.user} ${COINBOARD_NAME} ${req.params.cost}`)
        }
    }

    res.send("Ok")
})

app.use(express.static('public'));