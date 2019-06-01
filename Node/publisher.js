
const rabbit = require('./rabbit-init').rabbit;
const UserExchangeName = require('./rabbit-topology').UserExchangeName;

 
async function publishMessage() {
  var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  await rabbit.publish(UserExchangeName, {
    routingKey: "user.created",
    contentType: "application/json",
    body: {
      userId:  id,
      email: 'registeredEmail@gmail.com'
    },
    persistent: true
  });

  return id;
}

module.exports = publishMessage;