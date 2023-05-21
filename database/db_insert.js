
var db = require('./db_connection');

    var foodClassTable = "INSERT INTO food_class (foodClass) VALUES ?";
    var foodClassTableValues = [
        ['Carbohydrates'],
        ['Proteins'],
        ['Fats'],
        ['Vitamins'],
        ['Minerals'],
        ['Dietary fibre'],
        ['Water']
    ];
    db.query(foodClassTable, [foodClassTableValues], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted to food class: " + result.affectedRows);
    });

    var diseaseClassTable = "INSERT INTO disease_class (diseaseClass) VALUES ?";
    var diseaseClassTableValues = [
        ['Infectious'],
        ['Non-Infectious']
    ];
    db.query(diseaseClassTable, [diseaseClassTableValues], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted to disease class: " + result.affectedRows);
    });

    var diseaseSymptomTable = "INSERT INTO disease_symptom (diseaseSymptom) VALUES ?";
    var diseaseSymptomTableValues = [
        ['Scabs'],
        ['Color'],
        ['Hypertrophy'],
        ['Blight'],
        ['Rust'],
        ['Mildew']
    ];
    db.query(diseaseSymptomTable, [diseaseSymptomTableValues], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted to disease symptom: " + result.affectedRows);
    });

    var diseasePartTable = "INSERT INTO disease_part (diseasePart) VALUES ?";
    var diseasePartTableValues = [
        ['Root Diseases'],
        ['Stem Diseases'],
        ['FoliageDiseases']
    ];
    db.query(diseasePartTable, [diseasePartTableValues], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted to disease part: " + result.affectedRows);
    });

    var pestClassTable = "INSERT INTO pest_class (pestClass) VALUES ?";
    var pestClassTableValues = [
        ['Biting and Chewing insects'],
        ['Boring insects'],
        ['Piercing and Sucking insects']
    ];
    db.query(pestClassTable, [pestClassTableValues], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted to pest class: " + result.affectedRows);
    });
