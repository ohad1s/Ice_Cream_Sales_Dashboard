const {MongoClient} = require("mongodb");
const uuid = require("uuid");
const Kafka = require("node-rdkafka");
var data = require('./weather.json');
var axios = require("axios").default;
var https = require("https");

const uri =
"mongodb://shahar:1234@ac-ylzmvv4-shard-00-00.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-01.fffofzc.mongodb.net:27017,ac-ylzmvv4-shard-00-02.fffofzc.mongodb.net:27017/?ssl=true&replicaSet=atlas-22nd2n-shard-0&authSource=admin&retryWrites=true&w=majority\n"

// const client = new MongoClient(uri);
var weather = data;

//check if there is a holliday at "date"
module.exports.holly = async function holliday(date){
    try {
        const resp = await axios.get(`https://www.hebcal.com/converter?cfg=json&date=${date}&g2h=1&strict=1`);
        var obj = resp.data;
        return (obj.events.length>1);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}


module.exports.run_mongo = async function run(m) {
    const client = new MongoClient(uri);
    try {
        //connect to db
        const database = client.db('ice-cream');
        const orders = database.collection('orders');
        var doc = {};

        let weath = weather.find(o => o.time_obs.slice(0, 10) === m.date.slice(0,10));
        var hol = await holliday(m.date);
        var we;
        try{
            we= weath.tmp_air_dry
        }
        catch (err){
            we= 10;
        }
        doc = {
            branch: m.branch,
            date: m.date,
            weather: we,
            holiday: hol,
            num_scoops: m.num_scoops,
            flavor: m.flavor
        };
        //insert document
        const result = await orders.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
