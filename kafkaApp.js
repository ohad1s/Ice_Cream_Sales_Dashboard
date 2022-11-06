// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "dory-01.srvs.cloudkafka.com:9094, dory-02.srvs.cloudkafka.com:9094, dory-03.srvs.cloudkafka.com:9094",
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": "4ddaxdn5",
    "sasl.password": "76GXA4beiAeGYzQW_MCR-o1Ugi08DL9G",
    "debug": "generic,broker,security"
};
const prefix = "4ddaxdn5-";
const topic = `${prefix}first-glida`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = msg => Buffer.from(msg);
producer.on("ready", function(arg) {
    console.log(`producer Ariel is ready.`);
    // console.log(`producer Ariel ready.`);
    // for (var i = 0; i <msgs.length; i++) {
    //     producer.produce(topic, -1, genMessage(msgs[i]), i);
    // }
    // setTimeout(() => producer.disconnect(), 0);
    // producer.produce(topic,-1,genMessage(`3333`),1);
    // setTimeout(() => producer.disconnect(), 0);
});

producer.on("disconnected", function(arg) {
    process.exit();
});

producer.on('event.error', function(err) {
    console.error(err);
    process.exit(1);
});
producer.on('event.log', function(log) {
    console.log(log);
});
producer.connect();
// function sleep(milliseconds) {
//     const date = Date.now();
//     let currentDate = null;
//     do {
//         currentDate = Date.now();
//     } while (currentDate - date < milliseconds);
// }
// sleep(2000);
module.exports.publish= function(msg)
{
    m=JSON.stringify(msg);
    producer.produce(topic, -1, genMessage(m), uuid.v4());
    //producer.disconnect();
}

