const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

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
        // client.setex(username,repos);
        client.set(username,repos, function (error, response) {
            if (error) return console.error(error);
            console.log(response);
        });
// --------------------------------------
        client.set("key", "something", function (error, response) {
            if (error) return console.error(error);
            console.log(response);
        });
       // ========================================


        res.send(setResponse(username,repos));

    } catch (err) {
        console.error();
        res.status(500);
    }

}

app.get('/repos/:username', getRepos);

app.listen(PORT, function () {
    console.log(`app listening on port ${PORT}!`)
})