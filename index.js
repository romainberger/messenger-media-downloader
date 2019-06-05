const helper = require('./helper')
const cli = require('./cli')
const InfiniteLoader = require('./infiniteLoader')

// this is the thing we hope will not change too often
const SELECTORS = {
    emailInput: 'input[name=email]',
    passwordInput: 'input[type=password]',

    conversationsList: '[role=navigation]',

    photos: '[aria-label=photo]',

    photoSidebar: '[data-testid=info_panel] .scrollable',

    downloadButton: '[ajaxify]',
}

const login = async (page, email, password) => {
    await page.waitForSelector(SELECTORS.emailInput)

    const emailInput = await page.$(SELECTORS.emailInput)
    await emailInput.type(email, { delay: 10 })

    const passwordInput = await page.$(SELECTORS.passwordInput, { delay: 10 })
    await passwordInput.type(password)

    helper.waitFor(100)

    await helper.hitEnter(passwordInput)
}

/**
 * Function that actually perform the download for photos
 *
 * the strategy is to scroll progressively the section where
 * the media are, so that it will infinite-load the picture
 *
 * While we are doing that, we get the list of photo, then we
 * download them one by one.
 *
 * This will probably take forever.
 */
const downloadMedias = page => {
    console.log('Starting media download...\n')
    return new Promise(async resolve => {
        const infiniteLoader = new InfiniteLoader(page, SELECTORS.photoSidebar)

        let photos = await page.$$(SELECTORS.photos)

        for (let i = 0; i < photos.length; i++) {
            if (!photos[i]) {
                continue
            }

            const photo = photos[i]

            await photo.click()
            // need to find a way to detect the photo is loaded
            await helper.waitFor(500)
            // issue: fragile selector, may be localized, to test / support multiple languages
            // await helper.clickByText(page, 'Télécharger')
            await page.waitForSelector(SELECTORS.downloadButton)
            const downloadButton = await page.$(SELECTORS.downloadButton)
            await downloadButton.click()

            await helper.waitFor(50)
            await page.keyboard.press('Escape')

            await helper.waitFor(200)
            cli.overwrite(`Downloaded ${i}/${photos.length}`)

            photos = await page.$$(SELECTORS.photos)

            // when we reach the last media, load the next page
            if (i === photos.length) {
                await infiniteLoader.load()
            }
        }

        resolve()
    })
}

;(async () => {
    const email = process.argv[2]
    const password = process.argv[3]
    const conversationUrl = process.argv[4]

    cli.loading('Signin into Messenger...')
    const downloadFolder = helper.getDownloadFolder(conversationUrl)
    const { browser, page } = await helper.getNewPage(conversationUrl, downloadFolder)
    cli.done()

    await login(page, email, password)

    cli.loading('Opening conversation...')
    await page.waitForSelector(SELECTORS.conversationsList)
    cli.done()

    // wait for photos to be loaded
    await page.waitForSelector(SELECTORS.photos)

    await downloadMedias(page)

    browser.close()
})()
