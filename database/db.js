
var mysql = require('mysql');

var con = mysql.createConnection({
  host: process.env.PORT || "localhost",
  user: process.env.USERDB,
  password: process.env.PASSWORD
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  con.query("CREATE DATABASE crop_pest_and_diseases_db", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
