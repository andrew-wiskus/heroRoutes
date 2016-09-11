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


router.post('/', function(req, res) {
    var userInfo = req.body;
    // console.log(userInfo);
    user.signup(userInfo.email,userInfo.password);
    




});

module.exports = router;
