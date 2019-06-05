const puppeteer = require('puppeteer')

module.exports = {
    getNewPage(url, options = {}) {
        return new Promise(async resolve => {
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: {
                    width: 500,
                    height: 500,
                },
                ...options,
            })

            const page = await browser.newPage()
            await page.goto(url)

            resolve({ browser, page })
        })
    },

    hitEnter: async element => {
        return await element.type(String.fromCharCode(13))
    },

    waitFor: ms => new Promise(resolve => setTimeout(() => resolve(), ms)),
}
