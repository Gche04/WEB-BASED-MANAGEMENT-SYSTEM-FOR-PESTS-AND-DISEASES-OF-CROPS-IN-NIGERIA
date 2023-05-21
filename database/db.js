
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  port: "3306"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("CREATE DATABASE crop_pest_and_diseases_db", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
