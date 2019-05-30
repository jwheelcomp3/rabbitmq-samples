using System;
using RabbitMQ.Client;

namespace rabbitmq_sample
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {

                }
            }
        }
    }
}

/*
 * 
Publish email-address.submitted to 'rabbitmq-node-sample.registration.events'
Consume ser.created from 'rabbitmq-csharp-sample.user.events'
 * 
 * */
