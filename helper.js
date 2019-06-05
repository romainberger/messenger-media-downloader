const path = require('path')
const os = require('os')

const mkdir = require('mkdirp')
const puppeteer = require('puppeteer')

const DEFAULT_DOWNLOAD_FOLDER = path.join(os.homedir(), 'Downloads')

const helper = {
    getNewPage(url, downloadPath = DEFAULT_DOWNLOAD_FOLDER) {
        return new Promise(async resolve => {
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: {
                    width: 1000,
                    height: 500,
                },
            })

            // fix to be able to download files while headless
            // https://github.com/GoogleChrome/puppeteer/issues/299#issuecomment-496270751
            await browser.on('targetcreated', async () => {
                const pageList = await browser.pages()
                pageList.forEach(page => {
                    page._client.send('Page.setDownloadBehavior', {
                        behavior: 'allow',
                        downloadPath,
                    })
                })
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

    // from https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
    escapeXpathString(str) {
        const splitedQuotes = str.replace(/'/g, `', "'", '`)
        return `concat('${splitedQuotes}', '')`
    },

    clickByText: async (page, text) => {
        const escapedText = helper.escapeXpathString(text)
        const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`)

        if (linkHandlers.length > 0) {
            return linkHandlers[0].click()
        }
        else {
            throw new Error(`Link not found: ${text}`)
        }
    },

    getDownloadFolder(url) {
        const chunks = url.split('/')
        const now = new Date()
        const folderName = `${chunks[chunks.length - 1]}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
        const downloadPath = path.join(DEFAULT_DOWNLOAD_FOLDER, folderName)
        mkdir.sync(downloadPath)

        return downloadPath
    }
}

module.exports = helper
