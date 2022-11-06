const redis = require('redis');
const axios = require('axios');
const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);
client.connect();

async function redis_zero() {
    const flav_arr = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva"];
    for (let index = 0; index < 5; index++) {
        await client.set(flav_arr[index], 95*100);
    }
}

async function insert_redis(key, value1, value2) {
    const bdika = await client.hSet(key, value1, value2);
    console.log(bdika);
    return key;
}

async function sum_redis(flav) {
    try {
        var bdika2 =  await client.get(flav, async function(err, reply) {
            // console.log(reply);
            return reply;
            // const bdika3 = await client.set(flav, b + 100);
            // console.log(bdika3);
        });
        // const bdika2 = await client.get(flav);
        // console.log(bdika2);
        var b = parseInt(bdika2);
        console.log(b);
        const bdika3 = await client.set(flav, b + 100);
        // console.log(bdika3);
    } catch (err) {
        console.log(err);
    }
}
var cities_counter=0;
function religion(page) {
    axios({
        method: 'get',
        url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
        responseType: 'json'
    })
        .then(function (response) {
            var obj = response.data;
            var table = obj.Table;
            for (let index = 0; index < 100 && index < table.length; index++) {
                const city = table[index];
                if (city.PepoleNumberJewish == '-') {
                    var rel = "arab";
                } else if (city.PepoleNumberArab == '-') {
                    var rel = "jewish";
                } else {
                    var rel = "mixed";
                }
                var size = 0;
                var people = city.PepoleNumber;
                for (let i = 0; i < people.length; i++) {
                    if (people.charAt(i) != ',') {
                        size *= 10;
                        size += parseInt(people.charAt(i));
                    }
                }
                if (isNaN(size)) {
                    continue;
                }
                const flav_arr = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva"];
                cities_counter++;
                for (let index = 0; index < 5; index++) {
                    insert_redis(city.Name, flav_arr[index], 100);
                }
                // var sql = "INSERT INTO Cities (name, religion, size) VALUES ('"+city.Name+"', '"+rel+"', "+size+")";
                // con.query(sql, function (err, result) {
                //     if (err) throw err;
                //     console.log("1 record inserted");
                // });
            }
        });
}

for (let index = 1; index < 6; index++) {
    religion(index);
}

redis_zero();

