const redis = require('redis');
const {readFileSync, promises: fsPromises} = require('fs');
const fs = require('fs');


import {io} from "socket.io-client";

const REEDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient('127.0.0.1', REEDIS_PORT);

client.connect();
const socket = io("http://localhost:3000");
socket.on('connection');
socket.on("data", async (msg) => {
    console.log("Ciiii\n" + msg);
    const msg_obj = (JSON.parse(msg))
    const lemon = msg_obj.lemon;
    document.getElementById("lemon").innerHTML = lemon;
    const strw = msg_obj.strw
    document.getElementById("strw").innerHTML = strw;
    const choco = msg_obj.choco
    document.getElementById("choco").innerHTML = choco;
    const vanila = msg_obj.vanil
    document.getElementById("vanil").innerHTML = vanila;
    const halva = msg_obj.halva
    document.getElementById("halva").innerHTML = halva;
    if (document.getElementById("first").hidden == false) {
        show_main_graph(halva, lemon, choco, strw, vanila)
    }
});


const click_graph = document.getElementById("enter");
click_graph.addEventListener("click", emit_graph);


const train_m = document.getElementById("enter3");
train_m.addEventListener("click", emit_model);

const train_m2 = document.getElementById("enter4");
train_m2.addEventListener("click", emit_predict);

function emit_graph() {
    var snif2 = document.getElementById("kind2");
    var snif2_txt = snif2.options[snif2.selectedIndex].text;
    socket.emit("graph", snif2_txt);
}


function emit_model() {
    console.log("func model emit")
    socket.emit("model", "train model");
}

function emit_predict() {
    console.log("im here")
    var snif3 = document.getElementById("kind23");
    var snif3_txt = snif3.options[snif3.selectedIndex].text;

    var taam3 = document.getElementById("kind1");
    var taam3_txt = taam3.options[taam3.selectedIndex].text;

    var date_value = document.getElementById("date").value;
    console.log(date_value);
    var english_taam;
    if (taam3_txt === "וניל") {
        english_taam = "Vanilla";
    }
    if (taam3_txt === "שוקולד") {
        english_taam = "Chocolate";
    }
    if (taam3_txt === "לימון") {
        english_taam = "Lemon";
    }
    if (taam3_txt === "חלבה") {
        english_taam = "Halva";
    }
    if (taam3_txt === "תות") {
        english_taam = "Strawberry";
    }
    var send_to_predict = {"date": date_value, "branch": snif3_txt, "flavor": english_taam};
    console.log("pred.. go..")
    socket.emit("predict", send_to_predict);
}

socket.on("data2", async function (msg) {
    const msg_obj = (JSON.parse(msg));
    console.log(msg);
    const lemon2 = msg_obj["lemon"];
    const strw2 = msg_obj["strw"];
    const halva2 = msg_obj["halva"];
    const choco2 = msg_obj["choco"];
    const vanil2 = msg_obj["vanil"];
    show_graph213(halva2, lemon2, choco2, strw2, vanil2);
});


socket.on("pred_info", async function (data) {
    console.log(data);
    // var data_parse= JSON.parse(data);
    // const result = fs.readFileSync('./prediction.txt', {encoding: 'utf-8'});
    document.getElementById("p_data").innerHTML = data;

});


const reload = () => {
    location.reload();
}

var refresh_click = document.getElementById("refresh");
refresh_click.addEventListener("click", function () {
    event.preventDefault();
    reload();
})

var click_first = document.getElementById("mlai1");
click_first.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = false
    document.getElementById("second").hidden = true
    document.getElementById("third").hidden = true
}, false)

var click_second = document.getElementById("stores");
click_second.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = true
    document.getElementById("second").hidden = false
    document.getElementById("third").hidden = true
}, false)

var click_third = document.getElementById("amen");
click_third.addEventListener("click", function () {
    event.preventDefault();
    document.getElementById("first").hidden = true
    document.getElementById("second").hidden = true
    document.getElementById("third").hidden = false
}, false)


// const seasonname = client.get("season");
const seasonname = "סתיו";
const click_season = document.getElementById("season_click");
click_season.addEventListener("click", function () {
    document.getElementById("season").innerHTML = seasonname;
});

const isHoliday = "לא";
const click_holiday = document.getElementById("holiday_click");
click_holiday.addEventListener("click", function () {
    document.getElementById("holiday").innerHTML = isHoliday;
});

// const click_graph = document.getElementById("enter");
// click_graph.addEventListener("click", show_graph213
// );

function show_graph213(halva2, lemon2, choco2, strw2, vanil2) {
    show_graph21();
    show_graph212(halva2, lemon2, choco2, strw2, vanil2);
}

function show_graph21() {
    var xyValues = [
        {x: 1, y: 5},
        {x: 2, y: 8},
        {x: 3, y: 14},
        {x: 4, y: 9},
        {x: 5, y: 23},
        {x: 6, y: 33},
        {x: 7, y: 10}
    ];

    document.getElementById("graph21").innerHTML = new Chart("graph21", {
        type: "scatter",
        data: {
            datasets: [{
                pointRadius: 4,
                pointBackgroundColor: "rgb(0,0,255)",
                data: xyValues
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                xAxes: [{ticks: {min: 1, max: 7}}],
                yAxes: [{ticks: {min: 0, max: 100}}],
            }
        }
    });
}

function show_graph212(amount_h, amount_l, amount_c, amount_s, amount_v) {
    var xValues = ["Halva", "Lemon", "Chocolate", "Strawberry", "Vanilla"];
    var yValues = [amount_h, amount_l, amount_c, amount_s, amount_v];
    var barColors = [
        "#1c207e",
        "#e3f83b",
        "#97582b",
        "#ef1e5d",
        "#ffffff"
    ];

    document.getElementById("graph213").innerHTML = new Chart("graph212", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: "מלאי נוכחי בסניף נבחר"
            },
            scales: {
                yAxes: [{ticks: {min: 0, max: 100}}],
            }
        }
    });
}

function show_main_graph(halva, lemon, choco, strw, vanila) {
    var xValues = ["Halva", "Lemon", "Chocolate", "Strawberry", "Vanilla"];
    var yValues = [halva, lemon, choco, strw, vanila];
    var barColors = [
        "#1c207e",
        "#e3f83b",
        "#97582b",
        "#ef1e5d",
        "#ffffff"
    ];

    new Chart("graph1", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "גרף מלאי כללי ברשת"
            }
        }
    });
}

// var taam2 = document.getElementById("kind");
// var taam2_txt = taam2.options[taam2.selectedIndex].text;
//
// var snif2 = document.getElementById("kind2");
// var snif2_txt = snif2.options[snif2.selectedIndex].text;


var date_value = document.getElementById("date").value;
// document.getElementById("ddate").innerHTML = date_value;







