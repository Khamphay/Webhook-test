require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: uuidv4(),
  brokers: ['202.151.182.99:9092'],
});
const producer = kafka.producer();

async function send(data) {
  try {
    await producer.connect();
    const responses = await producer.send({
      topic: "hook-ts-topic",
      messages: [
        {
          value: JSON.stringify({tets:"test hook"}),
        },
      ],
    });
    return { stt: 1 };
  } catch (error) {
    console.error("Error publishing message", error);
    return { stt: 0 };
  }
}


async function inbox(data) {
    try {
      await producer.connect();
      const responses = await producer.send({
        topic: "inbox-topic",
        messages: [
          {
            value: JSON.stringify({tets:"test inbox"}),
          },
        ],
      });
      return { stt: 1 };
    } catch (error) {
      console.error("Error publishing message", error);
      return { stt: 0 };
    }
  }

  send();
  inbox();