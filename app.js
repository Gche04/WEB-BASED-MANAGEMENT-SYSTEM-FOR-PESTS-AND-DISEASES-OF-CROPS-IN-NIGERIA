
require('dotenv').config();

const express = require('express')
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');

app.use(session({ 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 48 * 60 * 60 * 1000 }
}))

const db = require('./database/db_connection');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res, next) => {
    accessSessionVariablesInViews(req, res);
    res.render('home');
    console.log('Sent: home');
    next();
});

app.get('/about', (req, res, next) => {
    accessSessionVariablesInViews(req, res);
    res.render('about');
    console.log('Sent: home');
    next();
});

app.get('/contact', (req, res, next) => {
    accessSessionVariablesInViews(req, res);
    res.render('contact');
    console.log('Sent: home');
    next();
});

app.get('/register', (req, res, next) => {
    var msg = "";
    accessSessionVariablesInViews(req, res);
    res.render('user/registeration', {alert: msg});
    console.log('Sent: user-registeration');
    next();
});

app.get('/login', (req, res, next) => {
    var msg = "";
    accessSessionVariablesInViews(req, res);
    res.render('user/login', {alert: msg});
    console.log('Sent: user-login');
    next();
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/dashboard', (req, res, next) => {
    var result = "";
    accessSessionVariablesInViews(req, res);
    res.render('dashboard', {result: result});
    console.log('Sent: dashboard');
    next();
    
});

app.get('/admin-login', (req, res, next) => {
    var msg = "";
    accessSessionVariablesInViews(req, res);
    res.render('admin/login', {alert: msg});
    console.log('Sent: admin-login');
    next();
});

app.get('/crop-form', (req, res, next) => {
    accessSessionVariablesInViews(req, res);
    res.render('crop/crop-form');
    console.log('Sent: crop-form');
    next();
});

app.get('/view-users', (req, res, next) => {

    db.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        accessSessionVariablesInViews(req, res);
        res.render('user/view-users', {users: result});
        console.log('Sent: view-users');
        next();
    });
});


function accessSessionVariablesInViews(req, res) {
    res.locals.email = req.session.emailAddress;
    res.locals.isAdmin = req.session.isAdmin;
};

function retrieveId(tableName, rowName, checkValue) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM ${tableName} WHERE ${rowName} = ` + mysql.escape(checkValue);
        db.query(sql, function (err, result) {
            if (err) reject(err);
            var resultToArray = Object.values(result[0]);
            var id = resultToArray[0];
            console.log(`${rowName} Id is ${id}`);
            resolve(id);
        });
    });
};

function searchResults(tableName, rowName, checkValue) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM ${tableName} WHERE ${rowName} = ` + mysql.escape(checkValue);
        db.query(sql, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
};

app.post('/register', function (req, res, next){
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var userName = req.body.user_name;
    var email = req.body.email_address;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;

    var sql='SELECT * FROM user WHERE userEmail =?';
    db.query(sql, [email] ,function (err, data, fields) {
        var isRegistered = false;

        if(err) throw err
        if(data.length>1){
            var msg = email + " already exists";
        }else if(!email.includes('@')){
            var msg = email + " is incorrect";
        }else if(confirmPassword != password){
            var msg ="Password & Confirm Password does not match";
        }else{
            var user = `INSERT INTO user (
                userFname, 
                userLname, 
                username,
                userEmail,
                userPassword
            ) VALUES 
            (
                "${firstName}",
                "${lastName}",
                "${userName}",
                "${email}",
                "${password}"
            )`

            db.query(user, function (err, result) {
                if (err) throw err;
                console.log('User added');
            });
   
            var msg ="Registeration successfully!, Please Login.";
            isRegistered = true;
        }
        if (isRegistered) {
            accessSessionVariablesInViews(req, res);
            res.render('user/login',{alert: msg});
            next();
        } else {
            accessSessionVariablesInViews(req, res);
            res.render('registration-form', {alert: msg});
            next();
        };
    });
});

app.post('/login', function(req, res, next){
    var emailAddress = req.body.email_address;
    var password = req.body.password;

    var sql='SELECT * FROM user WHERE userEmail =? AND userPassword =?';
    db.query(sql, [emailAddress, password], function (err, data, fields) {
        if(err) throw err
        if(data.length>0){
            req.session.loggedinUser= true;
            req.session.isAdmin= false;
            req.session.emailAddress= emailAddress;
            res.redirect('/dashboard');
        }else{
            accessSessionVariablesInViews(req, res);
            res.render('user/login', {alert: "Email address or Password is wrong"});
            next();
        };
    });
});

app.post('/admin-login', function(req, res, next){
    var password = req.body.password;

    if(password == process.env.ADMIN){
        req.session.loggedinAdmin= true;
        req.session.isAdmin= true;
            res.redirect('/');
    }else{
        accessSessionVariablesInViews(req, res);
        res.render('user/login',{alert: "Password is wrong, you are not an Admin"});
        next();
    }
})

app.post('/crop-form', function (req, res, next) {
    var cropComName = req.body.crop_com_name;
    var cropBotName = req.body.crop_bot_name;
    var cropClass = req.body.crop_class;

    var diseaseComName = req.body.disease_com_name;
    var diseaseSciName = req.body.disease_sci_name;
    var diseaseSymptom = req.body.disease_symptoms;
    var diseaseControl = req.body.disease_control;
    var diseaseClass = req.body.disease_class;
    var diseasePart = req.body.disease_part;
    var diseaseImage = req.body.disease_image;
    
    var pestComName = req.body.pest_com_name;
    var pestSciName = req.body.pest_sci_name;
    var pestSymptoms = req.body.pest_symp;
    var pestControl = req.body.pest_control;
    var pestEconomicImp = req.body.pest_economic_imp;
    var pestClass = req.body.pest_class;
    var pestImage = req.body.pest_image;

    var cropArea = req.body.crop_area;
    var cropPart = req.body.crop_part;
    var cropUses = req.body.crop_uses;
    var cropImages = req.body.crop_image;

    var cropClassId = retrieveId('food_class', 'foodClass', cropClass);
    var diseaseSymptomId = retrieveId('disease_symptom', 'diseaseSymptom', diseaseSymptom);
    var diseaseClassId = retrieveId('disease_class', 'diseaseClass', diseaseClass);
    var diseasePartId = retrieveId('disease_part', 'diseasePart', diseasePart);
    var pestClassId = retrieveId('pest_class', 'pestClass', pestClass);

    var cropDiseaseId = new Promise((resolve, reject) => {
        Promise.all([diseaseSymptomId, diseaseClassId, diseasePartId]).then((values) => {
            var desease = `INSERT INTO disease (
                diseaseCommonName, 
                diseaseScientificName, 
                diseaseSymptoms,
                diseaseControl,
                diseaseClass,
                diseasePart,
                diseaseImage
            ) VALUES 
            (
                "${diseaseComName}",
                "${diseaseSciName}",
                ${values[0]},
                "${diseaseControl}",
                ${values[1]},
                ${values[2]},
                "${diseaseImage}"
            )`
        
            db.query(desease, function (err, result) {
                if (err) reject (err);
                var id = result.insertId;
                console.log('Row has been updated on disease table, Id is' + id);
                resolve(id);
            });
        });
    });

    var cropPestId = new Promise((resolve, reject) => {
        pestClassId.then((classId) => {
            var pest = `INSERT INTO pest (
                pestCommonName, 
                pestScientificName, 
                pestSymptoms,
                pestControl,
                economicImp,
                pestClass,
                pestImage
            ) VALUES 
            (
                "${pestComName}",
                "${pestSciName}",
                "${pestSymptoms}",
                "${pestControl}",
                "${pestEconomicImp}",
                ${classId},
                "${pestImage}"
            )`

            db.query(pest, function (err, result) {
                if (err) reject (err);
                var pestId = result.insertId;
                console.log('Row has been updated on pest table, Id is' + pestId);
                resolve(pestId);
            });
        });
    });

    Promise.all([cropClassId, cropDiseaseId, cropPestId]).then((values) => {
        var crop = `INSERT INTO crop (
            cropCommonName, 
            cropBotanicalName, 
            cropClass,
            cropDisease,
            cropPest,
            acroArea,
            cropPart,
            cropUses,
            cropImage
        ) VALUES 
        (
            "${cropComName}", 
            "${cropBotName}", 
            ${values[0]},
            ${values[1]},
            ${values[2]},
            "${cropArea}",
            "${cropPart}",
            "${cropUses}",
            "${cropImages}"
        )`

        db.query(crop, function (err, result) {
            if (err) throw err;
            console.log('Row has been updated at crop table');
            res.redirect('/');
        });
    });
});

app.post('/crop-search', function (req, res, next){
    var cropName = req.body.search;
    var result = searchResults('crop', 'cropCommonName', cropName);
    
    result.then((value) => {
        if (value.length > 0) {
            var cropDiseaseId = searchResults('disease', 'diseaseId', value[0].cropDisease);
            var cropPestId = searchResults('pest', 'pestId', value[0].cropPest);

            var diseaseCommonName0 = cropDiseaseId.then((disValue) => {return disValue[0].diseaseCommonName});
            var pestCommonName1 = cropPestId.then((pestValue) => {return pestValue[0].pestCommonName});
            var cropClass2 = searchResults('food_class', 'classId', value[0].cropClass).then((val) => {
                return val[0].foodClass;
            });

            var cropCommonName = value[0].cropCommonName;
            var cropBotanicalName = value[0].cropBotanicalName;
            
            var acroArea = value[0].acroArea;
            var cropPart = value[0].cropPart;
            var cropUses = value[0].cropUses;
            var cropImage = value[0].cropImage;

            Promise.all([diseaseCommonName0, pestCommonName1, cropClass2]).then((values) => {
                var result = { 
                    resultFor : 'crops',
                    name : cropCommonName,
                    botName : cropBotanicalName,
                    class : values[2],
                    disease : values[0],
                    pest : values[1],
                    area : acroArea,
                    part : cropPart,
                    uses : cropUses,
                    cropImage : cropImage
                };
                accessSessionVariablesInViews(req, res);
                res.render('dashboard', {result: result});
                next();
            });
        }else{
            var result = {resultFor : 'CROP IS NOT AVAILABLE'};
            accessSessionVariablesInViews(req, res);
            res.render('dashboard', {result: result});
            next();
        };
    });
});

app.post('/disease-search', function (req, res, next){
    var diseaseName = req.body.search;
    var result = searchResults('disease', 'diseaseCommonName', diseaseName);

    result.then((value) => {
        if (value.length > 0) {
            var diseaseSymptomsId = value[0].diseaseSymptoms;
            var diseaseClassId = value[0].diseaseClass;
            var diseasePartId = value[0].diseasePart;
            var crop = searchResults('crop', 'cropDisease', value[0].diseaseId);
            
            
            var diseaseSymptoms0 = searchResults('disease_symptom', 'diseaseSymptomId', diseaseSymptomsId).then((val) => {
                return val[0].diseaseSymptom;
            });
            var diseaseClass1 = searchResults('disease_class', 'diseaseClassId', diseaseClassId).then((val) => {
                return val[0].diseaseClass;
            });
            var diseasePart2 = searchResults('disease_part', 'diseasePartId', diseasePartId).then((val) => {
                return val[0].diseasePart;
            });
            var cropComName3 = crop.then((val) => {return val[0].cropCommonName;});
            var cropImage4 = crop.then((val) => {return val[0].cropImage;});
            
    
            var diseaseCommonName = value[0].diseaseCommonName;
            var diseaseScientificName = value[0].diseaseScientificName;
            var diseaseControl = value[0].diseaseControl;
            var diseaseImage = value[0].diseaseImage;
    
            Promise.all([
                diseaseSymptoms0, 
                diseaseClass1, 
                diseasePart2,
                cropComName3,
                cropImage4
            ]).then((values) => {
                var result = { 
                    resultFor : 'disease',
                    name : diseaseCommonName,
                    botName : diseaseScientificName,
                    symptoms : values[0],
                    control : diseaseControl,
                    diseaseClass : values[1],
                    part : values[2],
                    cropAffected : values[3],
                    normalCropImage : values[4],
                    AttackedCropImage : diseaseImage
                };
                accessSessionVariablesInViews(req, res);
                res.render('dashboard', {result: result});
                next();
            });    
        } else {
            var result = {resultFor : 'DISEASE IS NOT AVAILABLE'};
            accessSessionVariablesInViews(req, res);
            res.render('dashboard', {result: result});
            next();
        };
    });
});

app.post('/pest-search', function (req, res, next){
    var pestName = req.body.search;
    var result = searchResults('pest', 'pestCommonName', pestName);

    result.then((value) => {
        if (value.length > 0) {
            var pestClassId = value[0].pestClass;
            var crop = searchResults('crop', 'cropPest', value[0].pestId);
    
            var pestClass0 = searchResults('pest_class', 'pestClassId', pestClassId).then((val => {
                return val[0].pestClass;
            }));
            var cropComName1 = crop.then((val) => {return val[0].cropCommonName;});
            var cropImage2 = crop.then((val) => {return val[0].cropImage;});
    
            var pestCommonName = value[0].pestCommonName;
            var pestScientificName = value[0].pestScientificName;
            var pestControl = value[0].pestControl;
            var pestSymptoms = value[0].pestSymptoms;
            var economicImp = value[0].economicImp;
            var pestImage = value[0].pestImage;
    
            Promise.all([pestClass0, cropComName1, cropImage2]).then((values) => {
                var result = { 
                    resultFor : 'pest',
                    pestCommonName : pestCommonName,
                    scientificName : pestScientificName,
                    pestClass : values[0],
                    cropAffected : values[1],
                    symptoms : pestSymptoms,
                    managementStrategies : pestControl,
                    economicImportance : economicImp,
                    normalCropImage : values[2],
                    AttackedCropImage : pestImage
                };
                accessSessionVariablesInViews(req, res);
                res.render('dashboard', {result: result});
                next();
            });    
        } else {
            var result = {resultFor : 'PEST IS NOT AVAILABLE'};
            accessSessionVariablesInViews(req, res);
            res.render('dashboard', {result: result});
            next();
        };
    });
});

app.listen(PORT, (err) =>{
    if(!err)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else 
        console.log("Error occurred, server can't start", err);
    }
);
