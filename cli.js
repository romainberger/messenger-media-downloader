let currentArgs = []

const cli = {
    overwrite(...args) {
        console.log("\u001B[1A\u001B[2K", ...args)
    },

    loading(...args) {
        currentArgs = args
        console.log('   ', ...args)
    },

    done() {
        cli.overwrite('✔︎ ', ...currentArgs)
    },
}

module.exports = cli
