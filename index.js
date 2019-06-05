const helper = require('./helper')

const messengerHomeURL = 'https://www.messenger.com'

;(async () => {
    const email = process.argv[2]
    const password = process.argv[3]

    const { browser, page } = await helper.getNewPage(messengerHomeURL)

    const inputSelector = 'input[name=email]'

    await page.waitForSelector(inputSelector)

    const emailInput = await page.$(inputSelector)
    await emailInput.type(email, { delay: 10 })

    const passwordInput = await page.$('input[type=password]', { delay: 10 })
    await passwordInput.type(password)

    helper.waitFor(100)

    await helper.hitEnter(passwordInput)

    // get list of conversations
    // choose one
    // get all media list then click / save until we reach the end or the end of date range
})()
