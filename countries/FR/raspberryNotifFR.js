const cheerio = require('cheerio');

/**
 * @typedef {Object} ParamObj
 * @property {number} gb - GB de la carte Raspberry Pi: 1, 2, 3, 4 ou 8 GB (1 par défaut). 
 */
module.exports = class RaspberryPiNotif {
    constructor(delay=500) {
        this.delay = delay;

        async function requestWebsite(htmlPath, url, words) {
            const res = await fetch(url);
            const data = await res.text();
            const $ = cheerio.load(data);
            const stockStatus = $(htmlPath).text();

            return {
                stock: res.status < 400 ? !words.some(v => stockStatus.includes(v)) : false,
                status_code: res.status,
                url: url
            }

        }
    
        this.stores = {

            /**
             * 
             * @param {ParamObj} gb
             * @returns Objet qui contient l'état du stock, le code http et l'url du produit
             */
            async kubi(gb=0) {
                let urls = {
                    1: "https://www.kubii.fr/les-cartes-raspberry-pi/2770-nouveau-raspberry-pi-4-modele-b-1gb-kubii-0765756931168.html?src=raspberrypi",
                    2: "https://www.kubii.fr/cartes-raspberry-pi/2771-nouveau-raspberry-pi-4-modele-b-2gb-3272496308794.html?src=raspberrypi",
                    4: "https://www.kubii.fr/cartes-raspberry-pi/2772-nouveau-raspberry-pi-4-modele-b-4gb-kubii-0765756931182.html?src=raspberrypi",
                    8: "https://www.kubii.fr/cartes-raspberry-pi/2955-raspberry-pi-4-modele-b-8gb-3272496309050.html?src=raspberrypi"
                };
                let url = urls[gb];

                const words = ["rupture"];
                const htmlPath = "p.availability_statut button#availability_value";

                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                    for (let i = 0; i <= 3; i++) {
                        let currentUrl = urls[Math.pow(2, powerIndex++)];
                        const data = await requestWebsite(htmlPath, currentUrl, words);
                        objs.push(data);        
                    }
                    
                    return objs
                }
                
            },

            /**
             * 
             * @param {ParamObj} gb
             * @returns Objet qui contient l'état du stock, le code http et l'url du produit
             */
            async lektorStore(gb=0) {
                let urls = {
                    1: "https://www.elektor.fr/raspberry-pi-4-b-1-gb-ram?src=raspberrypi",
                    2: "https://www.elektor.fr/raspberry-pi-4-b-2-gb-ram?src=raspberrypi",
                    4: "https://www.elektor.fr/raspberry-pi-4-b-4-gb-ram?src=raspberrypi", // 404 not found 
                    8: "https://www.elektor.fr/raspberry-pi-4-b-8-gb-ram?src=raspberrypi",
                };
                let url = urls[gb];

                const htmlPath = "form#form-validate-stock label";
                const words = ["indisponible"];

                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                    for (let i = 0; i <= 3; i++) {
                        let currentUrl = urls[Math.pow(2, powerIndex++)];
                        const data = await requestWebsite(htmlPath, currentUrl, words);
                        objs.push(data);
                    }

                    return objs;
                }
            },

            /**
             * 
             * @param {ParamObj} gb
             * @returns Objet qui contient l'état du stock, le code http et l'url du produit
             */
            async reichelt(gb=0) {
        
                let urls = {
                    1: "https://www.reichelt.de/FR/FR/raspberry-pi-4-b-4x-1-5-ghz-1-gb-ram-wlan-bt-rasp-pi-4-b-1gb-p259874.html?r=1&src=raspberrypi",
                    2: "https://www.reichelt.de/FR/FR/raspberry-pi-4-b-4x-1-5-ghz-2-gb-ram-wlan-bt-rasp-pi-4-b-2gb-p259919.html?r=1&src=raspberrypi",
                    4: "https://www.reichelt.de/FR/FR/raspberry-pi-4-b-4x-1-5-ghz-4-gb-ram-wlan-bt-rasp-pi-4-b-4gb-p259920.html?r=1&src=raspberrypi",
                    8: "https://www.reichelt.com/fr/fr/raspberry-pi-4-b-4x-1-5-ghz-8-gb-ram-wlan-bt-rasp-pi-4-b-8gb-p276923.html?CCOUNTRY=443&LANGUAGE=fr&utm_source=display&utm_medium=rsp-foundation&src=raspberrypi&&r=1"
                };
                
                let url = urls[gb];
                const htmlPath = "div#av_inbasket a p span";
                const words = ["Prochainement", "indisponible", "à partir", "épuisé"];
                
                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                    for (let i = 0; i <= 3; i++) {
                        let currentUrl = urls[Math.pow(2, powerIndex++)];
                        const data = await requestWebsite(htmlPath, currentUrl, words);
                        objs.push(data);        
                    }
                    
                    return objs
                }
        
            },
            
            /**
             * 
             * @param {ParamObj} gb
             * @returns Objet qui contient l'état du stock, le code http et l'url du produit
             */
            async yadom(gb=0) {

                let urls = {
                    1: "https://yadom.fr/raspberry-pi-4-model-b-1gb.html?src=raspberrypi",
                    2: "https://yadom.fr/raspberry-pi-4-model-b-2gb.html?src=raspberrypi",
                    4: "https://yadom.fr/raspberry-pi-4-model-b-4gb.html?src=raspberrypi",
                    8: "https://yadom.fr/nouveau-raspberry-pi-4-modele-b-version-8gb.html?src=raspberrypi"
                }
                
                let url = urls[gb];
                const htmlPath = "div.product-info-price div.product-info-stock-sku div[title=Disponibilité] span:nth-child(2)";
                const words = ["Épuisé"];
                
                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                    for (let i = 0; i <= 3; i++) {
                        let currentUrl = urls[Math.pow(2, powerIndex++)];
                        const data = await requestWebsite(htmlPath, currentUrl, words);
                        objs.push(data);        
                    }
                    
                    return objs
                }

            },
            
            /**
             * 
             * @param {ParamObj} gb
             * @returns Objet qui contient l'état du stock, le code http et l'url du produit
             */
            async mcHobby(gb=0) {

                let urls = {
                    1: "https://shop.mchobby.be/fr/raspberry-pi-4/1608-raspberry-pi-4-1-go-de-ram-dispo-en-stock--3232100016088.html?src=raspberrypi",
                    2: "https://shop.mchobby.be/fr/raspberry-pi-4/1609-raspberry-pi-4-2-go-de-ram-dispo-en-stock--3232100016095.html?src=raspberrypi",
                    4: "https://shop.mchobby.be/fr/raspberry-pi-4/1610-raspberry-pi-4-4-go-de-ram-dispo-en-stock--3232100016101.html?src=raspberrypi",
                    8: "https://shop.mchobby.be/fr/raspberry-pi-4/1858-raspberry-pi-4-8-go-de-ram-dispo-en-stock--3232100018587.html?src=raspberrypi"
                };

                let url = urls[gb];
                const htmlPath = "span#product-availability span";
                const words = ["Rupture"];

                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                    for (let i = 0; i <= 3; i++) {
                        let currentUrl = urls[Math.pow(2, powerIndex++)];
                        const data = await requestWebsite(htmlPath, currentUrl, words);
                        objs.push(data);        
                    }
                    
                    return objs
                }
            }
        }
    }
}

