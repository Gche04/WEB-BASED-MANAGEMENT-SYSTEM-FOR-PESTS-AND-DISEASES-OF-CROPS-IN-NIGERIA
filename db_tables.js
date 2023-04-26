
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "##Oxygen04",
    database: "crop_pest_and_diseases_db"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  
    var cropTable = `CREATE TABLE crop (
        cropId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        cropCommonName VARCHAR(100) NOT NULL, 
        cropBotanicalName VARCHAR(100), 
        cropClass INT(20) UNSIGNED NOT NULL,
        cropDisease INT(20) UNSIGNED,
        cropPest INT(20) UNSIGNED,
        acroArea VARCHAR(100) NOT NULL,
        cropPart VARCHAR(100) NOT NULL,
        cropUses VARCHAR(100) NOT NULL,
        cropImage NVARCHAR(2083) NOT NULL,
        PRIMARY KEY (cropId)
    )`;
    con.query(cropTable, function (err, result) {
        if (err) throw err;
        console.log("Crop table created");
    });

    var foodClassTable = `CREATE TABLE food_class (
        classId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        foodClass VARCHAR(100) NOT NULL, 
        PRIMARY KEY (classId)
    )`;
    con.query(foodClassTable, function (err, result) {
        if (err) throw err;
        console.log("class table created");
    });

    var diseaseTable = `CREATE TABLE disease (
        diseaseId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        diseaseCommonName VARCHAR(100) NOT NULL, 
        diseaseScientificName VARCHAR(100), 
        diseaseSymptoms INT(20) UNSIGNED,
        diseaseControl VARCHAR(100) NOT NULL,
        diseaseClass INT(20) UNSIGNED,
        diseasePart INT(20) UNSIGNED,
        diseaseImage NVARCHAR(2083),
        PRIMARY KEY (diseaseId)
    )`;
    con.query(diseaseTable, function (err, result) {
        if (err) throw err;
        console.log("disease table created");
    });

    var diseaseClassTable = `CREATE TABLE disease_class (
        diseaseClassId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        diseaseClass VARCHAR(100) NOT NULL, 
        PRIMARY KEY (diseaseClassId)
    )`;
    con.query(diseaseClassTable, function (err, result) {
        if (err) throw err;
        console.log("disease class table created");
    });

    var diseaseSymptomTable = `CREATE TABLE disease_symptom (
        diseaseSymptomId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        diseaseSymptom VARCHAR(100) NOT NULL, 
        PRIMARY KEY (diseaseSymptomId)
    )`;
    con.query(diseaseSymptomTable, function (err, result) {
        if (err) throw err;
        console.log("disease symptom table created");
    });

    var diseasePartTable = `CREATE TABLE disease_part (
        diseasePartId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        diseasePart VARCHAR(100) NOT NULL, 
        PRIMARY KEY (diseasePartId)
    )`;
    con.query(diseasePartTable, function (err, result) {
        if (err) throw err;
        console.log("disease part table created");
    });

    var pestTable = `CREATE TABLE pest (
        pestId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        pestCommonName VARCHAR(100) NOT NULL, 
        pestScientificName VARCHAR(100), 
        pestControl VARCHAR(100) NOT NULL,
        pestClass INT(20) UNSIGNED,
        pestImage NVARCHAR(2083),
        PRIMARY KEY (pestId)
    )`;
    con.query(pestTable, function (err, result) {
        if (err) throw err;
        console.log("pest table created");
    });

    var pestClassTable = `CREATE TABLE pest_class (
        pestClassId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        pestClass VARCHAR(100) NOT NULL,
        PRIMARY KEY (pestClassId)
    )`;
    con.query(pestClassTable, function (err, result) {
        if (err) throw err;
        console.log("pest class table created");
    });

    var userTable = `CREATE TABLE user (
        userId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        userFname VARCHAR(100) NOT NULL, 
        userLname VARCHAR(100) NOT NULL, 
        username VARCHAR(100) NOT NULL,
        userEmail VARCHAR(100) NOT NULL,
        userPassword 
        userStatus 
        PRIMARY KEY (userId)
    )`;
    con.query(userTable, function (err, result) {
        if (err) throw err;
        console.log("user table created");
    });

    var adminTable = `CREATE TABLE admin (
        adminId INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        adminPassword 
        PRIMARY KEY (adminId)
    )`;
    con.query(adminTable, function (err, result) {
        if (err) throw err;
        console.log("admin table created");
    });
});