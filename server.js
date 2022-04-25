var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');
var PORT = process.env.PORT || db.port;
var cors = require('cors');

//mongoose.connect(db.url, function (err) { if (err) console.log(err); });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

require('./app/routes.js')(app);

app.get('/emar', function (req, res) {
    res.sendFile(__dirname + "/public/app/emar/index.html");
})
app.get('/bi', function (req, res) {
    res.sendFile(__dirname + "/public/app/BI/index.html");
})
app.get('/nursebi', function (req, res) {
    res.sendFile(__dirname + "/public/app/BI/nursebi.html");
})
// app.get('/np', function (req, res) {
//     res.sendFile(__dirname + "/public/app/np_psv/index_nppsv.html");
// })
app.get('/np', function (req, res) {
    res.sendFile(__dirname + "/public/app/np/index.html");
})
app.get('/wt', function (req, res) {
    res.sendFile(__dirname + "/public/app/opdwt/index.html");
})
// app.get('/qr', function (req, res) {
//     res.sendFile(__dirname + "/public/app/qr/index.html");
// })
// app.get('/putd', function (req, res) {
//     res.sendFile(__dirname + "/public/app/opdwt/index.html");
// })

app.get('/t', function (req, res) {
    res.sendFile(__dirname + "/public/app/track/index.html");
})
// app.get('/scan', function (req, res) {
//     res.sendFile(__dirname + "/public/app/scan/index.html");
// })

// app.listen(PORT, function () {
//     console.log('centrix-starter running on port ' + PORT, 'pid ' + process.pid);
// });

app.use('*',function(req,res,next){
    var utcOffset = 420;
    if (req.body.fromdate) {
        utcOffset = moment(req.body.fromdate).utcOffset();
    }
    if (req.body.todate) {
        utcOffset = moment(req.body.todate).utcOffset();
    }
    req.utcoffset = utcOffset;
    req.timezone = utcOffset * 60 * 1000;

    next();
});
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

require('./app/routes')(app);

var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

// var fs = require('fs');
// var https = require('https');
// var httpsServer = https.createServer({
// key: fs.readFileSync('key.pem'),
// cert: fs.readFileSync('cert.pem'),
// ca: fs.readFileSync('intermediate.crt')}, app);
// httpsServer.listen(PORT, function () {
//     console.log('centrix-starter running on port ' + PORT, 'pid ' + process.pid);
// });
// var fs = require('fs');
// var https = require('https');
// var httpsServer = https.createServer({
// key: fs.readFileSync('PRIVATEKEY.txt'),
// cert: fs.readFileSync('Certificate.txt'),
// ca: fs.readFileSync('CA.txt')}, app);
// httpsServer.listen(PORT, function () {
//     console.log('centrix-starter running on port ' + PORT, 'pid ' + process.pid);
// });