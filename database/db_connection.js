var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: process.env.USERDB,
  password: process.env.PASSWORD,
  port: "3306",
  database: process.env.DATABASE
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;