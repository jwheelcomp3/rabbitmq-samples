using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace rabbitmq_sample
{
    public class Program
    {
        public static string UserExchangeName = "user.events";
        public static string RegistrationExchangeName = "registration.events";

        public static string WorkQueueName = "user-created";

        public static void Main(string[] args)
        {
            var factory = new ConnectionFactory() { HostName = "localhost", UserName = "rabbit", Password = "rabbit" };
            using (var connection = factory.CreateConnection())
            {
                using (var model = connection.CreateModel())
                {
                    Console.WriteLine("Connected to Rabbit!!");
                    SetUpTopology(model);
                    Console.WriteLine("Topology verified");

                    var consumer = new EventingBasicConsumer(model);
                    consumer.Received += (ch, ea) =>
                    {
                        ConsumeUserCreated((EventingBasicConsumer)ch, ea);
                    };

                    model.BasicConsume(WorkQueueName, false, consumer);
                    Console.WriteLine("Consumer set up");

                    while (true)
                    {
                        Console.ReadLine();
                        PublishEmailsForAccountCreation(model);
                    }
                }
            }
        }

        private static void SetUpTopology(IModel model)
        {
            model.ExchangeDeclare(RegistrationExchangeName, ExchangeType.Direct, true, false);
            model.ExchangeDeclare(UserExchangeName, ExchangeType.Direct, true, false);
            model.QueueDeclare(WorkQueueName, true, false, false, null);
            model.QueueBind(WorkQueueName, UserExchangeName, "user.created", null);
        }

        private static void ConsumeUserCreated(EventingBasicConsumer eventingBasicConsumer, BasicDeliverEventArgs payload)
        {
            var model = eventingBasicConsumer.Model;
            var json = System.Text.Encoding.UTF8.GetString(payload.Body);
            var userProfile = JsonConvert.DeserializeObject<UserProfile>(json);

            if(userProfile != null)
            {
                Console.WriteLine("Event received for user " + userProfile.UserId);
                model.BasicAck(payload.DeliveryTag, false);
            }
        }

        private static void PublishEmailsForAccountCreation(IModel model)
        {
            var anonObject = new { Email = "noemail@noemail.com" };
            byte[] messageBodyBytes = System.Text.Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(anonObject));

            IBasicProperties props = model.CreateBasicProperties();
            props.ContentType = "application/json";
            props.DeliveryMode = 2; // Persistent delivery

            model.BasicPublish(RegistrationExchangeName,
                               "email-address.submitted", props,
                               messageBodyBytes);
        }
    }
}
