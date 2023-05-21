
var db = require('./db_connection');


/*db.query("SELECT * FROM pest", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
});*/

var sql = "DELETE FROM pest WHERE pestId = 1";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("pest records deleted: " + result.affectedRows);
  });

  var sql = "DELETE FROM disease WHERE diseaseId = 1";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("disease records deleted: " + result.affectedRows);
  });

  var sql = "DELETE FROM disease WHERE diseaseId = 2";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("disease records deleted: " + result.affectedRows);
  });

  var sql = "DELETE FROM disease WHERE diseaseId = 3";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("disease records deleted: " + result.affectedRows);
  });

/*var sql = "SELECT * FROM crop WHERE cropDisease = 1" 
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
        });*/