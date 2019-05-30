
const rabbit = require('./rabbit-init').rabbit;
const UserExchangeName = require('./rabbit-topology').UserExchangeName;

 
function publishMessage() {
  return rabbit.publish(UserExchangeName, {
    routingKey: "user.created",
    contentType: "application/json",
    body: {
      userId:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      email: 'registeredEmail@gmail.com'
    },
    persistent: true
  });
}

module.exports = publishMessage;