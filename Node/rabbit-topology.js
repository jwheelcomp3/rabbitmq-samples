
const IncomingEventQueue = 'rabbitmq-node-sample.email'
const RegistrationExchangeName = 'registration.events'
const UserExchangeName = 'user.events'

const rabbitTopology = {
    connection: {
        user: 'rabbit',
        pass: 'rabbit',
        server: 'localhost',
        port: 5672,
        timeout: 2000
    },

    exchanges: [
        { name: RegistrationExchangeName, type: "direct", persistent: true, durable: true, autodelete: false },
        { name: RegistrationExchangeName + ".retry", type: "direct", persistent: true, durable: true, autodelete: false },
        { name: UserExchangeName, type: "direct", persistent: true, durable: true, autodelete: false }
    ],

    queues: [
        { name: IncomingEventQueue, deadLetter: RegistrationExchangeName + ".retry", durable: true, autodelete: false },
        { name: IncomingEventQueue + ".retry", deadLetter: RegistrationExchangeName, messageTtl: 300000, durable: true, autodelete: false }
    ],

    bindings: [
        { exchange: RegistrationExchangeName, target: IncomingEventQueue, keys: "email-address.submitted" },
        { exchange: RegistrationExchangeName + ".retry", target: IncomingEventQueue + ".retry", keys: "email-address.submitted" }
    ]
};

function configure(rabbit) {
    return rabbit.configure(rabbitTopology)
}

module.exports = {
    configure,
    IncomingEventQueue,
    RegistrationExchangeName,
    UserExchangeName
}