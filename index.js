var fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var bodyParser = require('body-parser');

var url = "mongodb://localhost:27017/mydb";
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

const fields = ['_id', 'name', 'phone', 'basic feedback', 'food quality', 'cleanliness', 'atmosphere', 'service', 'value for money'];
const json2csvParser = new Json2csvParser({ fields });

var resultFile;

mongo.connect(url, function (err, db) {
    if (err)
        throw err;
    console.log("Connected to mongo server");
    var dbo = db.db("myDB");

    app.get('/', function (req, res) {
        dbo.collection("feedbacks").find().toArray(function (err, result) {
            if (err) throw err;
            resultFile = result;
            const csv = json2csvParser.parse(resultFile);
            fs.writeFile('file.csv', csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            });
        });
        res.sendFile(__dirname + "/" + "index.html");
    });

    app.post('/view', function (req, res) {
        dbo.collection("feedbacks").find().toArray(function (err, result) {
            if (err) throw err;
            resultFile = result;
            res.end(JSON.stringify(result));
        });
    });

    app.post('/download', function(req,res){
        dbo.collection("feedbacks").find().toArray(function (err, result) {
            if (err) throw err;
            resultFile = result;
            const csv = json2csvParser.parse(resultFile);
            fs.writeFile('public/files/file.csv', csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            });
        });
        res.end("successful")
    })
});
var server = app.listen(4000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})