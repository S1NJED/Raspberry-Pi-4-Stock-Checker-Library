const RaspberryPiNotif = require('./raspberryNotifFR');

const stockChecker = new RaspberryPiNotif();
const stores = stockChecker.stores;
const kubi = stores.kubi;
const delay = 2000;
const discordWebhookUrl = ""; // Discord webhook URL à ajouter

const red = "\x1b[31m";
const green = "\x1b[32m";
let messageState = false;

setInterval(async () => {

    const objs = await kubi();
    
    for (let obj of objs) {
        
        if (obj["stock"]) {
            console.log(green + "- STOCK [ " + obj["url"] + " ]");
            
            if (!messageState) {
                messageState = true;
                fetch(discordWebhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({content: "STOCK DISPONIBLE (" + obj["url"] + ")"})
                })
             }
        
        }
        else {
            console.log(red + "- HORS STOCK [ " + obj["url"] + " ]");
        }
    }

}, delay);

