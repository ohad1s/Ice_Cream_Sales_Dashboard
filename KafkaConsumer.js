// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה
const model_t = require('./ModelTraining');
const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const redis = require('redis');
const axios = require('axios');
const kaf_con = require('./stam_redis');
const mongo_con = require('./mongoDB');
// const {readFileSync, promises: fsPromises} = require('fs');
const fs = require('fs');
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:1234"]
    }
});
const REEDIS_PORT = process.env.PORT || 6379;
const glida_flavors = [" Chocolate ", " Lemon ", " Vanilla ", " Strawberry ", " Halva "];
const client = redis.createClient('127.0.0.1', REEDIS_PORT);
client.connect();


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

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
const topic = `${prefix}first-glida`
const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
    "auto.offset.reset": "beginning"
});

consumer.connect();

consumer.on("error", function (err) {
    console.error(err);
});
consumer.on("ready", function (arg) {
    console.log(`Consumer ready...`);
    consumer.subscribe(topics);
    consumer.consume();
});

io.on("connection", async (socket) => {
    const d = await kaf_con.getDate();
    // const d2= await kaf_con.dataBySnif();
    console.log(d);
    socket.emit("data", d);
    // socket.emit("data2",d2);
    socket.on("graph", async (city) => {
        const d2 = await kaf_con.dataBySnif(city);
        // const d2 = 10;
        console.log(d2);
        socket.emit("data2", d2);
    });
    socket.on("model", async (msg) => {
        console.log(msg);
        await model_t.trainM();
    });

    socket.on("predict",  async(data) => {
        console.log(data);
        // sleep(30000);
        await model_t.Predict(data);
        fs.readFile("./prediction.txt", 'utf8', (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(result+ "blalalallaaa");
            socket.emit("pred_info", result);

        });
    });
});
// io.on("graph",async (socket)=>{
//     const d2= await kaf_con.dataBySnif();
//     socket.emit("data2",d2);
// });

consumer.on('data', async function (data) {
    if (! "flavor"  in data  ){

    }
    const msg = JSON.parse(data.value);
    console.log(`received message: ${JSON.stringify(msg)}`);
    await kaf_con.ParseDate(msg);
    await mongo_con.run_mongo(msg).catch(console.dir);
    // io.on("connection", (socket) => {
    //     socket.emit("data", data);
    // });


});
consumer.on("disconnected", function (arg) {
    process.exit();
});
consumer.on('event.error', function (err) {
    console.error(err);
    process.exit(1);
});
consumer.on('event.log', function (log) {
    console.log(log);
});

