var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var dbpath = require('../config/db').local_nurse;
var mongodbdata = require('../config/db').nursedb;
exports.listtimeact = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("nurse_times").aggregate([{
            "$match": {
                "orguid": req.body.orguid,
            }
        },
      
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.getpatientbytime = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("maindatas").aggregate([{
            "$match": {
    
                datecreate: { $gte: new Date(req.body.date1), $lte: new Date(req.body.date2) },
                ward: req.body.ward,
                orguid: req.body.orguid,
                timeact:req.body.timeactID,
                class_score: { $ne: null },
            }
        },
        { $lookup: { from: "nurse_times", foreignField: "timeactID", localField: "timeact", as: "timeact" } },

        { $unwind: { path: '$timeact', preserveNullAndEmptyArrays: true } },

        {
            $match: {
                "timeact.orguid": req.body.orguid
            }
        },
        {
            $project: {
                "_id": 0
            }
        }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.findformular = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("formulars").aggregate([{
            "$match": {
    
                // datecreate: { $gte: new Date(req.body.date1), $lte: new Date(req.body.date2) },
                Ward: req.body.ward,
                orguid: req.body.orguid,
            }
        },
    
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.getstaffhour = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("nurse_onduties").aggregate([{
            "$match": {
                date: req.body.date,
                ward: req.body.ward,
                orguid: req.body.orguid,
                timeactID:req.body.timeactID,
            }
        },
    
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.getstaffhour1 = function (req, res) {
    var query = nurse_onduty.find({});
    query.and([
        { orguid: req.body.orguid },
        { ward: req.body.ward },
        { date: req.body.date },
        { timeactID: req.body.timeact },
    ]);
    query.exec(function (err, docs) {
        if (!err && docs) {
            res.status(200).json({ nurse_onduty: docs });
        } else {
            res.status(500).json({ error: 'ERRORS.RECORDNOTFOUND' });
        }
    })
}