//TODO: check connectionString and change /omicron to your db you made the testbase DB in postgres

var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';


//modules
var testModule = require('../modules/testModule.js');
console.log(testModule.test("-Init: login route connection"));

var checkLogin = require('../modules/checkLogin.js');
var user = checkLogin.userLogin


router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, pg.connect", err, "\n \n \n \n");
        }

        //To manage strings and refrences cleaner
        var queryStringGET = 'SELECT * FROM testbase';

        client.query(queryStringGET,
            function(err, result) {
                done(); //closes connection, I only can have ten :(
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                    return;
                }
                res.send(result.rows);
            });
    });
});

router.post('/', function(req, res) {
    var userInfo = req.body;
    console.log(userInfo);
    user.login(userInfo.email,userInfo.password);
});



module.exports = router;
