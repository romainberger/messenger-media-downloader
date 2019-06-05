class InfiniteLoader {
    constructor(page, selector) {
        this.page = page
        this.selector = selector
        this.timeout = null
        this.scrollTop = 0
    }

    async load() {
        this.scrollTop += 1000

        return this.page.evaluate((selector, scrollTop) => {
            return new Promise(resolve => {
                const section = document.querySelector(selector)
                section.scrollTop = 5

                setTimeout(() => {
                    section.scrollTop = scrollTop
                    resolve()
                }, 50)
            })
        }, this.selector, this.scrollTop)
    }
}

module.exports = InfiniteLoader
