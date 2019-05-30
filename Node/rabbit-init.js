const rabbit = require('rabbot')
const rabbitConfig = require('./rabbit-topology')
const consumer = require('./consumer')

rabbit.on('connected', () => console.log('RabbitMQ connected'))
rabbit.on('closed', () => console.log('RabbitMQ closed'))
rabbit.on('failed', (err) => logger.error('RabbitMQ failed, unintentional close', err))
rabbit.on('unreachable', () => {
    logger.fatal('RabbitMQ is unreachable, so we will crash')
    process.exit(66)
})

var startListening = function() {
    rabbit.handle({ queue: rabbitConfig.IncomingEventQueue }, consumer)
    rabbit.startSubscription(rabbitConfig.IncomingEventQueue)
    console.log("RabbitMQ Subscribed")
};

function initializeRabbit() {
    new Promise(async (resolve, reject) => {
        try {
            await rabbitConfig.configure(rabbit)
            console.log('RabbitMQ configured')
            startListening()
            resolve()
        } catch (err) {
            console.log('RabbitMQ Failed to set up.')
            reject(err);
        }
    })
  }

 

module.exports = { initializeRabbit, rabbit };