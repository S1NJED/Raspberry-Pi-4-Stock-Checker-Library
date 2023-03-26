const RaspberryPiNotif = require('./raspberryNotifFR');

async function timer(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    })
}

(async () => {
    const notifier = new RaspberryPiNotif();
    const discordWebhookUrl = ""; // <-- Your discord webhook URL go here
    let hour = 1;
    let delay = hour * (3600 * 1000); // Time in ms, here 1 hour (3600000 ms)

    while (true) {
        let objects = await notifier.checkStockGB(8);

        for (let object of objects) {
            console.log(object);
            if (object["stock"]) { // stock === true
                fetch(discordWebhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({content: "@here STOCK AVAILABLE ! (" + object["url"] + ")"})
                })
            }
        }

        await timer(delay);
    }
    
    

})(); // Self invoked function