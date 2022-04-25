// var dbpath = '../Edoc_centrix/app/datajson/';
var dbpath = require('../config/db').local_json;
exports.readjson = function (req, res) {
    mfile = req.body.mfile;

    const fs = require('fs');
    if (fs.existsSync(dbpath + mfile)) {
        console.log('file exist');
        fs.readFile(dbpath + mfile, (err, data) => {
            if (err) throw err;

            let docs = JSON.parse(data);
            res.status(200).json({
                data: docs
            });
            // console.log(data);
        });

    } else {
        console.log(dbpath + mfile);
        // fs.writeFile(dbpath + mfile),'[]';
        var obj = [];

        var dictstring = JSON.stringify(obj, null, 2);
        const fs1 = require('fs');
        fs1.writeFile(dbpath + 'department.json', dictstring, function (err, result) {
            if (err) console.log('error', err);
        });
    }


}

exports.writejson = function (req, res) {
    mfile = req.body.mfile;
    indata = req.body.indata;
    const fs = require('fs');

    fs.readFile(dbpath + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            obj = JSON.parse(data); //now it an object
            obj.push(indata);
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}

exports.deletejson = function (req, res) {
    mfile = req.body.mfile;
    const fs = require('fs');

    fs.readFile(dbpath + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.body.idx);

            obj = JSON.parse(data); //now it an object
            console.log(obj);
            obj.splice(req.body.idx, 1);
            console.log(obj);
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}

exports.editjson = function (req, res) {
    mfile = req.body.mfile;
    indata = req.body.indata;
    const fs = require('fs');

    fs.readFile(dbpath + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.body.idx);

            obj = JSON.parse(data); //now it an object
            console.log(obj);
            obj.splice(req.body.idx, 1);
            console.log(obj);
            obj.push(indata);
            console.log(obj);
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}
exports.deletetemplatejson = function (req, res) {
    mfile = req.body.mfile;
    fdata = req.body.data;
    ftitle = req.body.title;
    const fs = require('fs');

    fs.readFile(dbpath + mfile, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {

            obj = JSON.parse(data); //now it an object
            console.log(obj);

            var index = -1;

            var filteredObj = obj.find(function (item, i) {
                if (item.data === fdata && item.title === ftitle) {
                    index = i;
                    return i;
                }
            });

            console.log(index);
            obj.splice(index, 1);
            console.log(obj);
            
            var strNotes = JSON.stringify(obj, null, 2);
            fs.writeFile(dbpath + mfile, strNotes, function (err) {
                if (err) return console.log(err);
                console.log('Note added');
                res.status(200).json({
                    data: obj
                });
            });

        }
    });
}
