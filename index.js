const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');
const fs = require("fs");
const { parse } = require("csv-parse");
// const kafka = require("node-rdkafka");

const kafka = require('./producer/index.js');


const PORT = process.env.PORT || 5000;
const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REEDIS_PORT);
(async () => {
    await client.connect();
})();


const app = express();

// Set response
function setResponse(username,repos){
    return `<h2>${username} has ${repos} GitHub repos</h2>`;
}


// Make request to ... for data ?
async function getRepos(req, res, next) {
    try {
        console.log('fetching-data');
        const { username } = req.params;
        const respnse = await fetch(`https://api.github.com/users/${username}`);
        const data = await respnse.json();
        const repos = data.public_repos;

        // set data to REDIS:
        client.set(username,repos, function (error, response) {
            if (error) return console.error(error);
            console.log(response);
        });
// // --------------------------------------
//         client.set("key", "something", function (error, response) {
//             if (error) return console.error(error);
//             console.log(response);
//         });
//        // ========================================

        res.send(setResponse(username,repos));

    } catch (err) {
        console.error();
        res.status(500);
    }

}

async function getCities(req, res, next) {
    try {
        console.log('cities...');

        fs.createReadStream("./public/cities.csv")
            .pipe(parse({ delimiter: ",", from_line: 3 }))
            .on("data", function (row) {
                console.log(row);
            })
            .on("end", function () {
                console.log("finished");
            })
            .on("error", function (error) {
                console.log(error.message);
            });



        // set data to REDIS:
        // client.set(username,repos, function (error, response) {
        //     if (error) return console.error(error);
        //     console.log(response);
        // });


        res.send("מלאי בכל הסניפים אופס ל200 קג לסניף!");

    } catch (err) {
        console.error();
        res.status(500);
    }

}



app.get('/repos/:username', getRepos);
app.get('/cities', getCities);
app.get('/', (req, res) => res.send("<a href='/send'>Send</a> <br/><a href=''>View</a>"));
app.get('/send', (req, res) => {kafka.publish("whats up");res.send('message was sent')});


app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`)
})