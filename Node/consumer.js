
var handleMessage = async (payload) => {
    console.log('Received message: ' + JSON.stringify(payload.body))
    try {
        // Process data from the payload

        payload.ack()
    } catch(err) {
        logger.error('Payload ' + payload.body.id + ' failed with error: ' + err)
        payload.nack(); // OR publish to a different Exchange
    }
}

module.exports = handleMessage