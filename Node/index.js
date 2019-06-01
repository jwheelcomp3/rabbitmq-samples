const publisher = require('./publisher')

async function run() {
    await require('./rabbit-init').initializeRabbit()

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readline.on('line', async () => {
        var id = await publisher()
        console.log("Event published: " + id)
    })
}

run()
