
const IncomingEventQueue = 'rabbitmq-node-sample.email'
const ExchangeName = 'rabbitmq-node-sample.registration.events'
const UserExchangeName = 'rabbitmq-csharp-sample.user.events'

const rabbitTopology = {
    connection: {
        user: 'rabbit',
        pass: 'rabbit',
        server: 'localhost',
        port: 5672,
        timeout: 2000
    },

    exchanges: [
        { name: ExchangeName, type: "direct", persistent: true, durable: true, autodelete: false },
        { name: ExchangeName + ".retry", type: "direct", persistent: true, durable: true, autodelete: false },
        { name: UserExchangeName, type: "direct", persistent: true, durable: true, autodelete: false }
    ],

    queues: [
        { name: IncomingEventQueue, deadLetter: ExchangeName + ".retry", durable: true, autodelete: false },
        { name: IncomingEventQueue + ".retry", deadLetter: ExchangeName, messageTtl: 300000, durable: true, autodelete: false }
    ],

    bindings: [
        { exchange: ExchangeName, target: IncomingEventQueue, keys: "email-address.submitted" },
        { exchange: ExchangeName + ".retry", target: IncomingEventQueue + ".retry", keys: "email-address.submitted" }
    ]
};

function configure(rabbit) {
    return rabbit.configure(rabbitTopology)
}

module.exports = {
    configure,
    IncomingEventQueue,
    ExchangeName,
    UserExchangeName
}