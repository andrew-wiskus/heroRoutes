var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/deskboss';
var pg = require("pg");
var Promise = require("bluebird");

Object.keys(pg).forEach(function(key) {
    var Class = pg[key];
    if (typeof Class === "function") {
        Promise.promisifyAll(Class.prototype);
        Promise.promisifyAll(Class);
    }
})


Promise.promisifyAll(pg);

router.put('/task/:id', function(req,res,params){
  var taskid = req.params.id;
  pg.connect(connectionString, function(err,client,done){
    if (err) {
        res.sendStatus(500);
        console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, pg.connect", err, "\n \n \n \n");
    }
    // console.log("AUSFUSDFUAWEFUAWEUUAUUAUAUAUAUAUU", req.body);
    var thequery =
    "UPDATE tasks SET is_complete = "+!req.body.is_complete+" WHERE id = " + req.params.id;
    client.query(thequery,
        function(err, result) {
            done(); //closes connection, I only can have ten :
            if (err) {
                res.sendStatus(500);
                console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                return;
            }
            // console.log('result: ', result.rows);
            tasklist = result.rows
            console.log('GET REQ: grabbing task list from db')
            res.send(tasklist)
        })

  });
})
router.get('/task/', function(req, res, params) {
    var tasklist = [];
    console.log('GETTING ALL TASKS FOR: user.email = ', req.query.email);
    // console.log(req.body.userName);
    pg.connect(connectionString, function(err, client, done) {
        console.log('Start!');
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, pg.connect", err, "\n \n \n \n");
        }

        var thequery =
            "SELECT * FROM tasks WHERE user_email = '" + req.query.email + "' ORDER BY id";


        client.query(thequery,
            function(err, result) {
                done(); //closes connection, I only can have ten :
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                    return;
                }
                // console.log('result: ', result.rows);
                tasklist = result.rows
                console.log('GET REQ: grabbing task list from db')
                res.send(tasklist.reverse())
            })


    });

});

router.post('/task', function(req, res, params) {


    console.log('databeing posted', req.body);
    var task = req.body;
    console.log('REQ . BODY = ',task);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.log("ITS HERE");
            res.sendStatus(500);
        }

        client.query('INSERT INTO tasks (title, project_of, user_email, scrum) '+
            'VALUES ($1, $2, $3, $4)', [task.task, task.project_of, task.user_email, task.scrum],
            function(err, result) {
                done();

                if (err) {
                  console.log("error", err);
                  console.log("ITS HERE!@#!@#");
                    res.sendStatus(500);
                } else {
                  res.sendStatus(201);
                    // res.sendStatus(201);
                }
            });
    });
});

router.delete('/task/:id', function(req, res, params) {
    var taskid = req.params.id;

    pg.connect(connectionString, function(err, client, done) {
        console.log('Start!');
        if (err) {
            res.sendStatus(500);
            console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, pg.connect", err, "\n \n \n \n");
        }

        var thequery =
            "DELETE FROM tasks WHERE id = " + req.params.id


        client.query(thequery,
            function(err, result) {
                done(); //closes connection, I only can have ten :
                if (err) {
                    res.sendStatus(500);
                    console.log("\n \n \n \n!!!HEY ERROR CONSOLE LOG HERE!!!\n error in GET, client.query: ", err, "\n \n \n \n");
                    return;
                }
                console.log('DELETE SUCCCCUESSSSSS')
                // console.log('result: ', result.rows);
                // tasklist = result.rows
                // console.log('GET REQ: grabbing task list from db')
                // // res.send(tasklist)
            })


    });

});




module.exports = router;
