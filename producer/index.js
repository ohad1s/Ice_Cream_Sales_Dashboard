const Kafka = require("node-rdkafka");
const uuid = require("uuid");

const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": "	dory.srvs.cloudkafka.com",
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
const maxMessages = 20;

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
    console.log(`producer ${arg.name} ready.`);
});
producer.connect();

module.exports.publish= function(msg)
{
    m=JSON.stringify(msg);
    producer.produce(topic, -1, genMessage(m), uuid.v4());
}
