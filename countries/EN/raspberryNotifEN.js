const cheerio = require("cheerio");

class RaspberryPiNotif {
    constructor() {
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

            async thePiHut(gb=0) {
                let urls = {
                    1: "https://thepihut.com/products/raspberry-pi-4-model-b?src=raspberrypi",
                    2: "https://thepihut.com/products/raspberry-pi-4-model-b?src=raspberrypi&variant=20064052674622",
                    4: "https://thepihut.com/products/raspberry-pi-4-model-b?src=raspberrypi&variant=20064052740158",
                    8: "https://thepihut.com/products/raspberry-pi-4-model-b?src=raspberrypi&variant=31994565689406"
                };

                let url = urls[gb];

                const words = ["Sold", "out"];
                const htmlPath = "span.inventory inventory--sold-out";

                if (url) {
                    return await requestWebsite(htmlPath, url, words);
                }
                else {
                    let objs = [];
                    let powerIndex = 0;
                }

            }

        }

    }
}