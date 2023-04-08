const cheerio = require('cheerio');

module.exports = class RaspberryPiNotif {
    #stores;

    constructor() {
        
        /**
         * Array of all availables stores name.
         */
        this.storesNames = ["kubi", "lektorStore", "reichelt", "yadom", "mcHobby"];
        
        // PRIVATE
        this.#stores = {
            "kubi": {
                "urls": {
                    2: "https://www.kubii.fr/cartes-raspberry-pi/2771-nouveau-raspberry-pi-4-modele-b-2gb-3272496308794.html?src=raspberrypi",
                    4: "https://www.kubii.fr/cartes-raspberry-pi/2772-nouveau-raspberry-pi-4-modele-b-4gb-kubii-0765756931182.html?src=raspberrypi",
                    8: "https://www.kubii.fr/cartes-raspberry-pi/2955-raspberry-pi-4-modele-b-8gb-3272496309050.html?src=raspberrypi"
                },
                "words": ["rupture"],
                "htmlPath": "p.availability_statut button#availability_value"
            },

            "lektorStore": {
                "urls": {
                    2: "https://www.elektor.fr/raspberry-pi-4-b-2-gb-ram?src=raspberrypi",
                    4: "https://www.elektor.fr/raspberry-pi-4-b-4-gb-ram?src=raspberrypi", // 404 not found 
                    8: "https://www.elektor.fr/raspberry-pi-4-b-8-gb-ram?src=raspberrypi",
                },
                "words": ["indisponible"],
                "htmlPath": "form#form-validate-stock label"
            },

            "reichelt": {
                "urls": {
                    2: "https://www.reichelt.de/FR/FR/raspberry-pi-4-b-4x-1-5-ghz-2-gb-ram-wlan-bt-rasp-pi-4-b-2gb-p259919.html?r=1&src=raspberrypi",
                    4: "https://www.reichelt.de/FR/FR/raspberry-pi-4-b-4x-1-5-ghz-4-gb-ram-wlan-bt-rasp-pi-4-b-4gb-p259920.html?r=1&src=raspberrypi",
                    8: "https://www.reichelt.com/fr/fr/raspberry-pi-4-b-4x-1-5-ghz-8-gb-ram-wlan-bt-rasp-pi-4-b-8gb-p276923.html?CCOUNTRY=443&LANGUAGE=fr&utm_source=display&utm_medium=rsp-foundation&src=raspberrypi&&r=1"
                },
                "words": ["Prochainement", "indisponible", "à partir", "épuisé"],
                "htmlPath": "div#av_inbasket a p span"
            },

            "yadom": {
                "urls": {
                    2: "https://yadom.fr/raspberry-pi-4-model-b-2gb.html?src=raspberrypi",
                    4: "https://yadom.fr/raspberry-pi-4-model-b-4gb.html?src=raspberrypi",
                    8: "https://yadom.fr/nouveau-raspberry-pi-4-modele-b-version-8gb.html?src=raspberrypi"
                },
                "words": ["Épuisé"],
                "htmlPath": "div.product-info-price div.product-info-stock-sku div[title=Disponibilité] span:nth-child(2)"
            },

            "mcHobby": {
                "urls": {
                    2: "https://shop.mchobby.be/fr/raspberry-pi-4/1609-raspberry-pi-4-2-go-de-ram-dispo-en-stock--3232100016095.html?src=raspberrypi",
                    4: "https://shop.mchobby.be/fr/raspberry-pi-4/1610-raspberry-pi-4-4-go-de-ram-dispo-en-stock--3232100016101.html?src=raspberrypi",
                    8: "https://shop.mchobby.be/fr/raspberry-pi-4/1858-raspberry-pi-4-8-go-de-ram-dispo-en-stock--3232100018587.html?src=raspberrypi"
                },
                "words": ["Rupture"],
                "htmlPath": "span#product-availability span" 
            }
        }
    }

    // FROM: https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
    #timer = ms => new Promise(res => setTimeout(res, ms));

    // PRIVATE
    async #requestWebsite(url, htmlPath, words, ramSize, storeName) {
        const res = await fetch(url);
        const data = await res.text();
        const $ = cheerio.load(data);
        const stockStatus = $(htmlPath).text();

        return {
            stock: res.status < 400 ? !words.some(v => stockStatus.includes(v)) : false,
            status_code: res.status,
            ramSize: ramSize,
            storeName: storeName,
            url: url
        }
    }
    
    /**
     * 
     * @returns Array of all available stores.
     */
    getStoresName() {
        return this.storesNames;
    }

    /**
     * Check stock from a single store.
     * @param {string} storeName Store name that you want to **check** the stock of. **Get** stores names from the storeNames *property* 
     * @param {number} gb OPTIONAL - *Type* of the Raspberry Pi in GB (2, 4 or 8)
     * @param {number} delay OPTIONAL (by default 500) - Delay in ms between the request when no gb parameter given.
     * @returns An array of objects that contains the *state* of the stock, the *http status code* and the *url*
     */
    async checkStock(storeName, gb=0, delay=500) {
        if (!this.#stores[storeName]) {
            throw new Error("Bad Argument: You must enter a store name, use the getStoresNames()")
        }
        
        let currentStore = this.#stores[storeName];
        let words = currentStore["words"];
        let htmlPath = currentStore["htmlPath"];
        let ret = [];
        
        if (gb) {
            let url = currentStore["urls"][gb];
            return [await this.#requestWebsite(url, htmlPath, words, gb, storeName)];
        }

        for (let [ram_size, url] of Object.entries(currentStore["urls"])) {
            ret.push(await this.#requestWebsite(url, htmlPath, words, ram_size, storeName));
            await this.#timer(delay);
        }

        return ret;
    }

    /**
     * Check stock for the Raspberry Pi 4 X GB from every available stores. 
     * @param {number} gb GB of the raspberry PI you want to check (2, 4 OR 8) 
     * @returns Array of objects that contains information about the stock state 
     */
    async checkStockGB(gb=0) {
        try {
            let ret = [];
            for (let obj of Object.entries(this.#stores)) {
                let storeName = obj[0];
                let url = obj[1]["urls"][gb];
                let htmlPath = obj[1]["htmlPath"];
                let words = obj[1]["words"];
    
                ret.push(await this.#requestWebsite(url, htmlPath, words, gb, storeName));
                await this.#timer(250);
            }
            return ret;
        }
        catch(err) {console.error("Bad Argument: GB parameter must be equal to 2, 4 OR 8");}
        
    }

}