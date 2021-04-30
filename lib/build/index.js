"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const client = new discord_js_1.Client();
const mineflayer_1 = require("mineflayer");
const fs_1 = require("fs");
//const config = JSON.parse(readFileSync("./data/config.json", 'utf8'));
dotenv_1.config();
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const MINEFLAYERCONFIG_USERNAME = process.env.MINEFLAYERCONFIG_USERNAME;
const params = JSON.parse(fs_1.readFileSync('../serverConfig.json', 'utf8'));
const avatarException = JSON.parse(fs_1.readFileSync("../data/avatarException.json", 'utf8'));
const bot = mineflayer_1.createBot({
    host: params.host,
    username: MINEFLAYERCONFIG_USERNAME,
    port: params.port,
    version: params.version
});
bot.on('login', () => {
    //For LapCorp Server : play.lapcorp.eu
    /* → */ bot.chat("/register IRCBot IRCBot");
    /* → */ bot.chat("/login IRCBot");
    //bot.chat("Hello there ! I'm the Discord IRC Bot ! Please don't tell me !");
    console.log("IRC Bot spawned");
});
//For vanilla server
bot.on('chat', (username, message) => {
    if (username === bot.username) {
        return;
    }
	let newUsername = username.indexOf("] ")!=-1?username.split("] ")[1]:username.split("]")[1]
    sendToDiscord(newUsername, "", message);
});

client.on('ready', () => {
    console.log("Discord Connected !");
    client.on('message', (message) => {
        if (!message.webhookID && message.channel.id == CHANNEL_ID && !message.author.bot)
            bot.chat('/tellraw @a ["",{"text":"[Discord] ' + message.author.username + '#' + message.author.discriminator + ' :","color":"yellow"},{"text":" ' + message.content + '","color":"gold"}]');
    });
});
async function sendToDiscord(username, grade, message) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel instanceof discord_js_1.TextChannel) {
        let webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.first();
        if (!webhook) {
            channel.createWebhook('IRC WebHook', {
                avatar: 'https://i.imgur.com/wSTFkRM.png',
            });
            setTimeout(() => { sendToDiscord(username, grade, message); }, 500);
            return;
        }
        let avatarURL = 'https://minotar.net/avatar/' + username + '.png';
        for (let i = 0; i < avatarException.length; i++) {
            if (avatarException[i].name === username) {
                avatarURL = avatarException[i].redirect;
            }
        }
        await webhook.send(message, {
            username: `${grade}${username}`,
            avatarURL: avatarURL
        });
    }
}
client.login(TOKEN);
//# sourceMappingURL=index.js.map