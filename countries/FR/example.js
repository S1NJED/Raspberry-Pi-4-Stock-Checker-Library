const RaspberryPiNotif = require('./raspberryNotifFR');

(async () => {
    const notifier = new RaspberryPiNotif();
    const discordWebhookUrl = ""; // <-- Your discord webhook URL go here
    const delayHours = 6; // Hours to wait, only change the delay here
    const delay = delayHours * (3600 * 100);

    setInterval(async () => {
        let objects = await notifier.check8GB();

        for (let object of objects) {
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

    }, delay);

})(); // Self invoked function