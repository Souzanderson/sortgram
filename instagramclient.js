const puppeteer = require('puppeteer')
const fs = require('fs')

class InstagramClient {
    browser;
    comments = [];
    len = 0;

    constructor() { }

    async start() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                '--start-minimized',
                '--disable-web-security'
            ]
        })
    }

    async stop() {
        await this.browser.close()
        console.log("Finalizou o browser!");

    }

    async getComments(urlpost) {
        if (!this.browser) throw new Error('Browser not started')
        const page = await this.browser.newPage()
        await page.goto(`http://instagram.com/p/${urlpost}/`, {
            waitUntil: 'networkidle2',
        })
        await page.setCacheEnabled(false);

        const data = await page.evaluate(() => document.querySelector('title').textContent);
        console.log(data);
        console.log(`https://instagram.com/p/${urlpost}/`);

        const isElementVisible = async (page, cssSelector) => {
            let visible = true;
            await page
                .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
                .catch(() => {
                    visible = false;
                });
            return visible;
        };

        let bt = ".dCJp8, .afkep" //Click no Botão de (+) para carregar mais comentários

        let visible = true;
        while (visible) {
            visible = await isElementVisible(page, bt)
            if (visible) {
                try {
                    await page.click(bt)
                } catch (error) {

                }
            }
        }


        this.comments = await page.evaluate(() => {
            let elements = document.getElementsByClassName(`Mr508`)
            let local = document.location.href
            let values = []
            for (let element of elements) {
                let contact = element.getElementsByClassName('sqdOP yWX7d     _8A5w5   ZIAjV ')[0].textContent
                let text = element.textContent
                if (!contact) contact = ""
                if (!text) text = ""
                text = text.replace(contact, "")

                values.push({ name: contact, comment: text, urlpost: local })
            }
            return values
        })

        page.close()
        return this.comments

    }

    /**
 * 
 * @param  size - Quantidade de comentários
 * @param  range - Número de sorteados
 */
    random(size, range) {
        let arr = []
        if (size < range) {
            range = size
        }
        for (var i = 0; i < range; i++) {
            let value = this.getValue(size)
            while (arr.indexOf(value) > -1) {
                value = this.getValue(size)
            }
            arr.push(value)
        }
        return arr.sort()
    }

    getValue(size) {
        return Math.floor(Math.random() * (size + 1));
    }

    sorter(files, tam) {
        let comments = []
        console.log(`Posts file : ${files.join(", ")}`);
        for (let f of files) {
            try {
                comments = comments.concat(JSON.parse(fs.readFileSync(`./comments/${f}.json`)))
            } catch (error) {

            }
        }

        let values = this.random(comments.length, tam)
        let sorteados = []
        console.log(`Commentários: ${comments.length}\nSorteados: \n`);
        for (let v of values) {
            console.log(comments[v]);
            sorteados.push(comments[v])
        }
        return sorteados
    }

}

module.exports = InstagramClient