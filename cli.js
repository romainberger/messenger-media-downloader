let currentArgs = []

const cli = {
    overwrite(...args) {
        console.log("\u001B[1A\u001B[2K", ...args)
    },

    loading(...args) {
        currentArgs = args
        console.log('   ', ...args)
    },

    doneLoading() {
        cli.done(...currentArgs)
    },

    done(...args) {
        cli.overwrite('✔︎ ', ...args)
    }
}

module.exports = cli
