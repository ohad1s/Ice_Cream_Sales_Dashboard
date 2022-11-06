var mysql = require('mysql');
const fs = require("fs");
const { parse } = require("csv-parse");
csv = require('csv');
iconv = require("iconv-lite")
const axios = require('axios').default;

// create db
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "םישג7788"
//   });
  
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE Cities", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "םישג7788",
  database: "Cities"
});

//create table
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE Cities (id INT AUTO_INCREMENT PRIMARY KEY, name NVARCHAR(255) NOT NULL UNIQUE, size INT, religion VARCHAR(255), `ages_0-5` INT, `ages_6-18` INT, `ages_19-45` INT, `ages_46-55` INT, `ages_56-64` INT, `ages_65-inf` INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

//get the cities' religion
function religion(page){
axios({
  method: 'get',
  url: `https://boardsgenerator.cbs.gov.il/Handlers/WebParts/YishuvimHandler.ashx?dataMode=Yeshuv&filters={%22Years%22:%222021%22}&filtersearch=&language=Hebrew&mode=GridData&pageNumber=${page}&search=&subject=BaseData`,
  responseType: 'json'
})
  .then(function (response) {
    var obj = response.data;
    var table = obj.Table;
    for (let index = 0; index < 100 && index<table.length; index++) {
      const city = table[index];
      //figure out the religion
      if(city.PepoleNumberJewish=='-'){
        var rel = "arab";
      }else if(city.PepoleNumberArab =='-'){
        var rel = "jewish";
      }else{
        var rel = "mixed";
      }
      var size = 0;
      var people = city.PepoleNumber;
      //convert the number of people from string to int 
      for (let i = 0; i < people.length; i++) {
        if(people.charAt(i)!=','){
          size*=10;
          size+=parseInt(people.charAt(i));
        }
      }
      if(isNaN(size)){
        continue;
      }
      var sql = "INSERT INTO Cities (name, religion, size) VALUES ('"+city.Name+"', '"+rel+"', "+size+")";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    }
  });
}

//each page have only 20 cities so we need 6 pages
for (let index = 1; index < 6; index++) {
  religion(index);
}

//get cities' ages
axios({
  method: 'get',
  url: `https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=11000`,
  responseType: 'json'
}).then(function (response){
  var obj = response.data.result.records;
  for (var i=1; i<obj.length; ++i){
    var city = obj[i];
    var name = city.שם_ישוב.substring(0,city.שם_ישוב.length-1);
    var todller = isNaN(parseInt(city.גיל_0_5)) ? 0:parseInt(city.גיל_0_5);
    var teen = isNaN(parseInt(city.גיל_6_18)) ? 0 : parseInt(city.גיל_6_18);
    var adult = isNaN(parseInt(city.גיל_19_45)) ? 0 : parseInt(city.גיל_19_45);
    var middle = isNaN(parseInt(city.גיל_46_55)) ? 0 : parseInt(city.גיל_46_55);
    var gold = isNaN(parseInt(city.גיל_56_64)) ? 0 : parseInt(city.גיל_56_64);
    var old = isNaN(parseInt(city.גיל_65_פלוס)) ? 0 : parseInt(city.גיל_65_פלוס);
    var sql = "UPDATE Cities SET `ages_0-5` = "+ todller +
    ", `ages_6-18` = " + teen +
    ", `ages_19-45` = " + adult +
    ", `ages_46-55` = " + middle +
    ", `ages_56-64` = " + gold +
    ", `ages_65-inf` = " + old +
    " WHERE name = '" + name+ "';";
    try{
        con.query(sql, function (err, result) {
        });
      }
      catch(error){
        continue;
      }
  }
})
