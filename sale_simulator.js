var mysql = require('mysql');
const myobject = require("./order");
const cities = [];
const flavors = ["Chocolate", "Lemon", "Vanilla", "Strawberry", "Halva", "Chocolate"]
const seasons = [1, 2, 2, 2] //in the summer eat more ice cream
const winter = [0, 1, 2, 9, 10, 11]
const summer = [3, 4, 5, 6, 7, 8]
const uuid = require("uuid");
const Kafka = require("node-rdkafka");
const kafkaApp = require('./kafkaApp');

//connect to mysql
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "םישג7788",
    database: "Cities"
});

con.connect(function (err) {
    if (err) throw err;
    //get the cities from the database
    con.query("SELECT name FROM cities", function (err, result, fields) {
        if (err) throw err;
        //Return the fields object:
        console.log(result[0].name);
        for (var i = 0; i < 95; i++) {
            cities[i] = result[i].name;
        }
        console.log(cities);
    });
});

//sleep function
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


function make_orders() {
    var r_scoops = Math.floor(Math.random() * 3) + 1; //generate num of scoops
    var myarray = [];
    var r_season = Math.floor(Math.random() * 3); //generate season
    var r_city = Math.floor(Math.random() * 94); //generate city
    var r_year = Math.floor(Math.random() * 5) + 2018; //generate year
    var r_day = Math.floor(Math.random() * 31); //generate day
    var r_month = Math.floor(Math.random() * 5); //generate month in season
    var month = -1;
    if (seasons[r_season] === 1) {
        month = winter[r_month];
    } else if (seasons[r_season] === 2) { //if summer buy more icecream
        month = summer[r_month];
    }
    var date = new Date(r_year, month, r_day);
    //generate flavor
    if (date.getDay() >= 4) { //in weekend buy more Chocolate
        for (var i = 0; i < r_scoops; i++) {
            var r_flavor = Math.floor(Math.random() * 6);
            myarray[i] = flavors[r_flavor];
        }
    } else {
        for (var i = 0; i < r_scoops; i++) {
            var r_flavor = Math.floor(Math.random() * 5);
            myarray[i] = flavors[r_flavor];
        }
    }
    let my_order = new myobject.Order(myarray, date, cities[r_city], r_scoops);
    let str = my_order.toString();
    console.log(str)
    //send through kafka
    kafkaApp.publish(my_order);
}


function firsts_order(){
    for (var i = 0; i < 200; i++) {
        make_orders();
    }
}


function send_orders() {
    while (true) {
        make_orders();
        sleep(1000);
    }
}
setTimeout(firsts_order, 1000)
setTimeout(send_orders, 1000)

