var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var objectId = require('mongodb').ObjectID;
var app = express();
var router = express.Router();
var http = require('http');
var assert = require('assert');
var fs = require('fs');
var md5 = require('md5');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 9090;
var router = express.Router();
//app.use(express.static(__dirname + '/view'));
var path = require('path');
app.use(express.static(path.join(__dirname, 'view')));
app.use('/css', express.static(__dirname, 'view/assets/css'));
var u;
router.get('/', function(req, res, next) {
    return res.sendFile(path.join(__dirname + '/view/index.html'));
});

router.use(function(req, res, next) {
    next();
});

router.route('/signup').post(function(req, res) {
    var pass = md5(req.body.password);
    var item = {
        username: req.body.username,
        email: req.body.email,
        password: pass,
        designation: req.body.designation,
        image: 'default.jpg'

    };
    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
        console.log('Connected');
        if (err)
            console.log(err);
        else {
            var db = database.db('test');
            db.collection('employee').insertOne(item, function(err, result) {
                assert.equal(null, err);
                console.log('Item inserted');
                database.close();
                console.log("Connected");

            });
            res.setHeader('Content-Type', 'text/html');
            return res.send(fs.readFileSync(__dirname + '/view/home.html'));
            //res.sendFile('view/home.html', {root: __dirname });

        }
    });
});

router.route('/upload').post(function(req, res) {
    var item = {
        username: u.username,
        email: u.email,
        password: u.password,
        designation: u.designation,
        image: req.body.file

    };
    var id = u._id;
    u.image = req.body.file;
    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
        console.log('Connected');
        if (err)
            console.log(err);
        else {
            var db = database.db('test');
            db.collection('employee').updateOne({ "_id": objectId(id) }, { $set: item }, function(err, result) {
                assert.equal(null, err);
                console.log('Item updated');
                database.close();
                console.log("Connected");

            });
            res.setHeader('Content-Type', 'text/html');
            return res.send(fs.readFileSync(__dirname + '/view/home.html'));
            //res.sendFile('view/home.html', {root: __dirname });

        }
    });
});
router.route('/updatepass').post(function(req, res) {
    var item = {
        username: u.username,
        email: u.email,
        password: md5(req.body.newpass),
        designation: u.designation,
        image: u.image

    };
    var old = u.password;
    var oldchk = md5(req.body.oldpass);
    if (old != oldchk)
        res.send("Invalid Old password Enter again");
    var id = u._id;
    u.password = item.password;
    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
        console.log('Connected');
        if (err)
            console.log(err);
        else {
            var db = database.db('test');
            db.collection('employee').updateOne({ "_id": objectId(id) }, { $set: item }, function(err, result) {
                assert.equal(null, err);
                console.log('Item updated');
                database.close();
                console.log("Connected");

            });
            res.setHeader('Content-Type', 'text/html');
            return res.send(fs.readFileSync(__dirname + '/view/home.html'));
            //res.sendFile('view/home.html', {root: __dirname });

        }
    });
});

router.route('/updateprofile').post(function(req, res) {
    var item = {
        username: req.body.username,
        email: req.body.email,
        password: u.password,
        designation: req.body.designation,
        image: u.image

    };
    var id = u._id;
    u.password = item.password;
    u.username = item.username;
    u.email = item.email;
    u.designation = item.designation;
    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
        console.log('Connected');
        if (err)
            console.log(err);
        else {
            var db = database.db('test');
            db.collection('employee').updateOne({ "_id": objectId(id) }, { $set: item }, function(err, result) {
                assert.equal(null, err);
                console.log('Item updated');
                database.close();
                console.log("Connected");

            });
            res.setHeader('Content-Type', 'text/html');
            return res.send(fs.readFileSync(__dirname + '/view/home.html'));
            //res.sendFile('view/home.html', {root: __dirname });

        }
    });
});

app.get('/get', function(req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
    res.end(JSON.stringify(u));
    /*Sending the respone back to the angular Client */
});

router.route('/signin').post(function(req, res) {
    console.log("in update");


    var user = req.body.username;
    var pass = md5(req.body.password);


    MongoClient.connect('mongodb://localhost:27017/test', function(err, database) {
        console.log('Connected');
        if (err)
            console.log(err);
        else {
            var db = database.db('test');
            assert.equal(null, err);
            db.collection('employee', function(err, coll) {
                if (err)
                    console.log('No Data');
                coll.findOne({ username: user, password: pass }, function(err, user) {
                    // we found a user so respond back accordingly
                    if (user) {
                        // return res.send(user);
                        //res.redirect('/view/home');
                        u = user;
                        res.setHeader('Content-Type', 'text/html');
                        return res.send(fs.readFileSync(__dirname + '/view/home.html'));


                    }
                    if (!user) {
                        return res.send('No user Found');
                    }
                    if (err) console.log('error');
                    database.close();
                });
                //res.send("Not login");


                //res.render('view/home.html');
            });
        }
    });
});



app.use(cors());
app.use('/project', router);
app.use(express.static(__dirname + '/view/assets'));
app.listen(port);
console.log('API is runnning at ' + port);