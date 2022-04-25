var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var dbpath = require('../config/db').dbpath;
var mongodbdata = require('../config/db').db;


exports.visitcount = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([{

            // MongoClient.connect(dbpath, (connectErr, db) => {
            //     var dbo = db;
            //     dbo.collection('patientvisits').aggregate([
            // {
            "$match": {
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "statusflag": "A",
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        {
            "$lookup": {
                "from": "departments",
                "localField": "visitcareproviders.departmentuid",
                "foreignField": "_id",
                "as": "department"
            }
        },
        {
            "$unwind": "$department"
        },
        {
            "$lookup": {
                "from": "referencevalues",
                "localField": "entypeuid",
                "foreignField": "_id",
                "as": "encounter"
            }
        },
        {
            "$unwind": "$encounter"
        },
        {
            "$match": {
                "encounter.valuedescription": "Outpatient"
            }
        },
        {
            "$group": {
                "_id": {
                    "department": "$department.name",
                    "year": { "$year": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                    "month": { "$month": [{ "$add": ["$startdate", 420 * 60 * 1000] }] },
                    "day": { "$dayOfMonth": { "$add": ["$startdate", 420 * 60 * 1000] } }
                },
                "first": { "$min": "$startdate" },
                "count": { "$sum": 1 }
            }
        },
        {
            "$project": {
                "_id": 0,
                "department": "$_id.department",
                "visitdate": "$first",
                "count": "$count"
            }
        },
        {
            "$sort": {
                "count": -1.0
            }
        },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.opd_princ = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([{

            "$match": {
                "statusflag": "A",
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        {
            "$lookup": {
                "from": "organisations",
                "localField": "orguid",
                "foreignField": "_id",
                "as": "orguid"
            }
        },
        {
            "$unwind": "$orguid"
        },
        {
            $project: {
                orguid: "$orguid.description",

            }
        },
        {
            $addFields: { count: 1 }
        },
        {
            "$group": {
                "_id": { orguid: "$orguid" },

                "count": { "$sum": "$count" }
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.organize = function (req, res) {
    var morg = req.body.morg;
    var morga = [];

    var filterCriteria = {};
    if (morg =="all hospitals") {
        filterCriteria = {};
    }
    else  {
        for (var ii = 0; ii < morg.length; ii++) {
            morga.push(morg[ii]);
        }
        filterCriteria['description'] = { $in: morga };
    }

    console.log('morga', morga);
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("organisations").aggregate([{

            "$match": {
                "statusflag": "A",
                // "description": { $in: morga },
            }
        },
        {
            $match: filterCriteria
        },
        {
            $project: {
                _id: "$_id",
                name: "$name",
                code: "$code",
                description: "$description",
            }
        },
        {
            "$sort": {
                "description": 1
            }
        }
        ]).toArray((err, docs) => {
            console.log(docs);
            for (var i = 0; i < docs.length; i++) {
                docs[i].flag = true;
                docs[i].show = true;
                docs[i].checked = false;
                switch (docs[i].code) {
                    case "AMACORP":
                        docs[i].description = "all hospitals";
                        // docs[i].show = false;
                        break;
                    case "00063":
                        docs[i].flag = false;
                        docs[i].show = false;
                        break;
                    case "00065":
                        docs[i].flag = false;
                        docs[i].show = false;
                        break;
                    default:
                        break;
                }
            }
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}

exports.ward = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "enddate": { $eq: null }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "entypeuid"
                }
            },
            { "$unwind": "$entypeuid" },
            {
                "$match": {
                    "entypeuid.valuecode": "ENTYPE2"
                }
            },
            { "$unwind": "$bedoccupancy" },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "bedoccupancy.warduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.warduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.warduid"
            },
            {
                "$match": {
                    $and: [
                        { "bedoccupancy.isactive": true },
                        { "bedoccupancy.enddate": null }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "beds",
                    "localField": "bedoccupancy.beduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.beduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.beduid"
            },
            {
                "$match":
                    { "bedoccupancy.beduid.bedcategoryuid": { $ne: mongoose.Types.ObjectId("57f4aa78e311c733215e6580") } },

            },
            {
                "$match": {
                    $or: [
                        { "bedoccupancy.beduid.activeto": null },
                        { "bedoccupancy.beduid.activeto": { $gte: new Date() } }
                    ]
                }
            },
            {
                "$group": {
                    "_id": { warduid: "$bedoccupancy.warduid._id", "ward": "$bedoccupancy.warduid.name" },
                    "count": { $sum: 1 }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "ward": "$_id.ward",
                    "count": "$count"
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
        });
    });
}
exports.warddetail = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("beds").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",

                    "bedcategoryuid": { "$ne": mongoose.Types.ObjectId("57f4aa78e311c733215e6580") },
                    $or: [
                        { activeto: null },
                        { activeto: { $gte: new Date() } }
                    ],
                }
            },
            {
                "$group": {
                    "_id": { warduid: "$warduid" },
                    "warduid": { "$first": "$warduid" },
                    "count": { $sum: 1 }
                }
            },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "warduid",
                    "foreignField": "_id",
                    "as": "ward"
                }
            },
            {
                "$unwind": "$ward"
            },
            {
                $project: {
                    wardname: "$ward.name",
                    wardcode: "$ward.code",
                    warddesc: "$ward.description",
                    bedcount: "$count",
                    displayorder: "$ward.displayorder",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
        });
    });
}
exports.ipd_princ = function (req, res) {
    // var visitdate = req.body.visitdate;
    // var fromdate = moment(visitdate).startOf('day').toISOString();
    // var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([{

            "$match": {
                "statusflag": "A",
                "enddate": { $eq: null }
            }
        },
        {
            "$lookup": {
                "from": "referencevalues",
                "localField": "entypeuid",
                "foreignField": "_id",
                "as": "entypeuid"
            }
        },
        { "$unwind": "$entypeuid" },
        {
            "$match": {
                "entypeuid.valuecode": "ENTYPE2"
            }
        },
        { "$unwind": "$bedoccupancy" },
        {
            "$lookup": {
                "from": "wards",
                "localField": "bedoccupancy.warduid",
                "foreignField": "_id",
                "as": "bedoccupancy.warduid"
            }
        },
        {
            "$unwind": "$bedoccupancy.warduid"
        },
        {
            "$match": {
                $and: [
                    { "bedoccupancy.isactive": true },
                    { "bedoccupancy.enddate": null }
                ]
            }
        },
        {
            "$lookup": {
                "from": "beds",
                "localField": "bedoccupancy.beduid",
                "foreignField": "_id",
                "as": "bedoccupancy.beduid"
            }
        },
        {
            "$unwind": "$bedoccupancy.beduid"
        },
        {
            "$match":
                { "bedoccupancy.beduid.bedcategoryuid": { $ne: mongoose.Types.ObjectId("57f4aa78e311c733215e6580") } },

        },
        {
            "$match": {
                $or: [
                    { "bedoccupancy.beduid.activeto": null },
                    { "bedoccupancy.beduid.activeto": { $gte: new Date() } }
                ]
            }
        },
        {
            "$group": {
                "_id": { orguid: "$orguid" },
                "count": { $sum: 1 }
            }
        },
        {
            "$lookup": {
                "from": "organisations",
                "localField": "_id.orguid",
                "foreignField": "_id",
                "as": "orguid"
            }
        },
        {
            "$unwind": "$orguid"
        },
        {
            "$project": {
                "_id": 0,
                "orguid": "$orguid.description",
                "count": "$count"
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.revenuesplit = function (req, res) {
    res.setTimeout(0);
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').startOf('month').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientbills").aggregate([{
                $match: {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    statusflag: 'A',
                    iscancelled: { $ne: true },
                    isrefund: false,
                    billdate: {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate),
                    }
                }
            },
            { $lookup: { from: "patientvisits", foreignField: "_id", localField: "patientvisituid", as: "patientvisituid" } },
            { $unwind: { path: '$patientvisituid', preserveNullAndEmptyArrays: true } },
            
            { $lookup: { from: "payors", foreignField: "_id", localField: "patientvisituid.visitpayors.payoruid", as: "payoruid" } },
            
            { $lookup: { from: "referencevalues", foreignField: "_id", localField: "patientvisituid.entypeuid", as: "patientvisituid.entypeuid" } },
            { $unwind: { path: '$patientvisituid.entypeuid', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    billdate: 1,
                    entypeuid: "$patientvisituid.entypeuid.relatedvalue",
                    payor: { visitpayors: { orderofpreference: 1, payoruid: 1 } },
                    totalbillamount: 1,
                    tdate: { $dateToString: { format: '%d/%m/%Y', date: "$billdate" } },
                }
            },
            {
                "$group": {
                    "_id": {
                        "year": { "$year": [{ "$add": ["$billdate", 420 * 60 * 1000] }] },
                        "month": { "$month": [{ "$add": ["$billdate", 420 * 60 * 1000] }] },
                        "day": { "$dayOfMonth": { "$add": ["$billdate", 420 * 60 * 1000] } },
                        "entypeuid": "$entypeuid"
                    },
                    "tdate": { "$first": "$tdate" },
                    "entypeuid": { "$first": "$entypeuid" },
                    "amount": { "$sum": "$totalbillamount" },
                    "count": { "$sum": 1 }
                }
            },
            
            {
                $project: {
                    _id : 0,
                    tdate: "$tdate",
                    OPD: { $cond: { if: { $eq: ['$entypeuid', 'OPD'] }, then: '$amount', else: 0 } },
                    IPD: { $cond: { if: { $eq: ['$entypeuid', 'IPD'] }, then: '$amount', else: 0 } },
                    opdcase: { $cond: { if: { $eq: ['$entypeuid', 'OPD'] }, then: '$count', else: 0 } },
                    ipdcase: { $cond: { if: { $eq: ['$entypeuid', 'IPD'] }, then: '$count', else: 0 } }
                }
            },
                {
                    "$group": {
                        "_id": { "tdate": "$tdate" },
                        "OPD": { "$sum": "$OPD" },
                        "IPD": { "$sum": "$IPD" },
                         "opdcase": { "$sum": "$opdcase" },
                        "ipdcase": { "$sum": "$ipdcase" },
                    }
                },
                {
                    "$sort": {
                        "_id.tdate": 1
                    }
                },
        ], { allowDiskUse: true }).toArray((err, docs) => {
            console.log(docs);
            // var result = init(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
    // function init(docs) {
    //     var result = {};
    //     docs.forEach(function (doc) {
    //         var type = doc._id.toLowerCase();
    //         result[type] = [];

    //         var groupDate = _.groupBy(doc.patientbills, function (item) { return moment(item.billdate).utcOffset(req.utcoffset).format("YYYY-MM-DD") });
    //         Object.keys(groupDate).forEach(function (key) {
    //             var group = groupDate[key];

    //             var revenue = {};
    //             revenue.revenuedate = _.min(group.map(function (g) { return moment(g.billdate); }));
    //             // revenue.patientuc = 0;
    //             // revenue.patientnonuc = 0;
    //             // revenue.revenueuc = 0;
    //             // revenue.revenuenonuc = 0;
    //             revenue.revenuetotal = 0;
    //             var patientall = [];
    //             // var patientuclist = [];
    //             // var patientnonuclist = [];
    //             group.forEach(function (patientbill) {

    //                 revenue.revenuetotal += patientbill.totalbillamount;

    //                 // var primaryPayor = null;
    //                 // if (patientbill.patientvisituid && patientbill.patientvisituid.visitpayors && patientbill.patientvisituid.visitpayors.length > 0) {
    //                 //     var sortPayors = _.sortBy(patientbill.patientvisituid.visitpayors, function (s) { return s.orderofpreference; });
    //                 //     if (sortPayors && sortPayors.length > 0) {
    //                 //         primaryPayor = sortPayors[0];
    //                 //     }
    //                 // }
    //                 // if (primaryPayor && patientbill.payoruid && patientbill.payoruid.length > 0) {
    //                 //     var payor = patientbill.payoruid.find(function (payor) { return payor._id.toJSON() == primaryPayor.payoruid.toJSON(); });
    //                 //     if ((req.session.ucpayors || []).includes(payor.code)) {
    //                 //         patientuclist.push(patientbill.patientuid.toJSON());
    //                 //         revenue.revenueuc += patientbill.totalbillamount;
    //                 //     } else {
    //                 //         patientnonuclist.push(patientbill.patientuid.toJSON());
    //                 //         revenue.revenuenonuc += patientbill.totalbillamount;
    //                 //     }
    //                 // }
    //             });

    //             // revenue.patientuc = patientuclist.length;
    //             // revenue.patientnonuc = patientnonuclist.length;
    //             // revenue.total = revenue.revenueuc + revenue.revenuenonuc;
    //             result[type].push(revenue);
    //         }, this);


    //     }, this);
    //     return result;
    // }
}
//-----------------opdwt
exports.find_status = function (req, res) {
    // var visitdate = req.body.visitdate;
    // var fromdate = moment(visitdate).startOf('day').toISOString();
    // var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("referencevalues").aggregate([{

            "$match": {
                activeto: null,
                domaincode: 'VSTSTS',
            }
        },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.tracking = function (req, res) {
    var entypeuid = req.body.entypeuid;
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([
            {

                $match: {
                    "statusflag": "A",
                    "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                }
            },

            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            // {
            //     $match: {
            //         // "department.description":  "Mobile Check Up",
            //         "department.description": { $ne: "Mobile Check Up" },
            //     }
            // },
            {
                "$lookup": {
                    "from": "patients",
                    "localField": "patientuid",
                    "foreignField": "_id",
                    "as": "patientuid"
                }
            },
            {
                "$unwind": { path: "$patientuid", preserveNullAndEmptyArrays: true }
            },
            {
                "$lookup": {
                    "from": "patientimages",
                    "localField": "patientuid.patientimageuid",
                    "foreignField": "_id",
                    "as": "patientuid.patientimage"
                }
            },
            {
                "$unwind": { path: "$patientuid.patientimage", preserveNullAndEmptyArrays: true }
            },
            // {
            //     $group: {
            //         _id: "$_id",
            //         "patientuid": { $push: "$patientuid" },
            //         "visitid": { $first: "$visitid" },
            //         "visitstatusid": { $first: "$visitstatusuid" },
            //         "startdate": { $first: "$startdate" },
            //         "department": { $first: "$department" },
            //     }
            // },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
//----------------track
exports.trackingen = function (req, res) {
    // var entypeuid = req.body.entypeuid;
    var visitid = req.body.visitid;
    // var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([
            {

                $match: {
                    "statusflag": "A",
                    // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) },
                    "visitid": visitid
                    // "visitid": { '$regex': new RegExp(visitid, 'i') }

                }
            },

            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            // {
            //     $match: {
            //         // "department.description":  "Mobile Check Up",
            //         "department.description": { $ne: "Mobile Check Up" },
            //     }
            // },
            {
                "$lookup": {
                    "from": "patients",
                    "localField": "patientuid",
                    "foreignField": "_id",
                    "as": "patientuid"
                }
            },
            {
                "$unwind": { path: "$patientuid", preserveNullAndEmptyArrays: true }
            },
            {
                "$lookup": {
                    "from": "patientimages",
                    "localField": "patientuid.patientimageuid",
                    "foreignField": "_id",
                    "as": "patientuid.patientimage"
                }
            },
            {
                "$unwind": { path: "$patientuid.patientimage", preserveNullAndEmptyArrays: true }
            },
            {
                "$lookup": {
                    "from": "organisations",
                    "localField": "orguid",
                    "foreignField": "_id",
                    "as": "orguid"
                }
            },
            {
                "$unwind": { path: "$orguid", preserveNullAndEmptyArrays: true }
            },
            // {
            //     $group: {
            //         _id: "$_id",
            //         "patientuid": { $push: "$patientuid" },
            //         "visitid": { $first: "$visitid" },
            //         "visitstatusid": { $first: "$visitstatusuid" },
            //         "startdate": { $first: "$startdate" },
            //         "department": { $first: "$department" },
            //     }
            // },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
//----------------------emar
exports.emar_patientonward_byorg = function (req, res) {
    var orguid = req.body.orguid;
    var warduid = req.body.warduid;
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientvisits").aggregate([
            {
                "$match":
                    { "orguid": mongoose.Types.ObjectId(orguid), }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            { "$unwind": "$bedoccupancy" },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "bedoccupancy.warduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.warduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.warduid"
            },
            {
                $match: {
                    "bedoccupancy.warduid._id": mongoose.Types.ObjectId(warduid),
                }
            },
            {
                "$lookup": {
                    "from": "beds",
                    "localField": "bedoccupancy.beduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.beduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.beduid"
            },
            {
                "$match":
                    { "bedoccupancy.beduid.bedcategoryuid": { $ne: mongoose.Types.ObjectId("57f4aa78e311c733215e6580") } },

            },
            {
                "$match": {
                    $or: [
                        { "bedoccupancy.beduid.activeto": null },
                        { "bedoccupancy.beduid.activeto": { $gte: new Date() } }
                    ]
                }
            },
            {
                "$lookup": {
                    "from": "patients",
                    "localField": "patientuid",
                    "foreignField": "_id",
                    "as": "patientuid"
                }
            },
            {
                "$unwind": "$patientuid"
            },
            // {
            //     $match: {
            //         "patientuid._id": ObjectId("5a200ad89318c8bc1eb491f0")
            //     }
            // },

            // {
            //     $lookup: {
            //         from: "payors",
            //         localField: "visitpayors.payoruid",
            //         foreignField: "_id",
            //         as: "visitpayors.payoruid"
            //     }
            // },

            {
                "$match": {
                    "statusflag": "A",
                    "bedoccupancy.isactive": true,
                    "bedoccupancy.enddate": null,
                    "encounter.valuecode": "ENTYPE2",
                    "enddate": null
                }
            }

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.getwardbyorg = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("wards").aggregate([
            {
                "$match":
                {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    'activeto': null
                }
            },


        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.emar_med_byPTVUID = function (req, res) {
    var fromdate = req.body.fromdate;
    var patientvisituid = req.body.patientvisituid;
    var beduid = req.body.beduid;
    var orguid = req.body.orguid;
    var entypeuid = req.body.entypeuid;
    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("patientorders").aggregate([
            {
                "$match":
                {
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "beduid": mongoose.Types.ObjectId(beduid),
                    "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    "patientorderitems.enddate": null,
                    // "patientorderitems.enddate": { $gte: new Date(fromdate) },
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid)
                }
            },
            {
                $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true }
            },
            {
                $match: {
                    "patientorderitems.ordercattype": { "$in": ["MEDICINE"] }
                }
            },
            {
                $lookup: { from: "itemmasters", localField: "patientorderitems.orderitemuid", foreignField: "orderitemuid", as: "itemmasters" }
            },
            {
                $unwind: { path: "$itemmasters", preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: { from: "referencevalues", localField: "itemmasters.stockauditgroup", foreignField: "_id", as: "stockauditgroup" }
            },
            {
                $unwind: { path: "$stockauditgroup", preserveNullAndEmptyArrays: true }
            },
            // {
            //     $lookup: { from: "referencevalues", localField: "patientorderitems.dosageUOM", foreignField: "_id", as: "patientorderitems.dosageUOM" }
            // },
            // {
            //     $unwind: "$patientorderitems.dosageUOM"
            // },
            {
                $lookup: { from: "referencevalues", localField: "patientorderitems.statusuid", foreignField: "_id", as: "patientorderitems.statusuid" }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            {
                "$lookup": {
                    "from": "beds",
                    "localField": "beduid",
                    "foreignField": "_id",
                    "as": "beduid"
                }
            },
            {
                $unwind: { path: "$beduid", preserveNullAndEmptyArrays: true }
            },

            {
                $match:
                {
                    'patientorderitems.statusuid.valuedescription': { $in: ["Ordered"] },
                    //   'patientorderitems.statusuid.valuedescription': { $nin: ["Cancelled"] },
                }
            },
            {
                "$lookup": { "from": "patients", "localField": "patientuid", "foreignField": "_id", "as": "patientuid" }
            },
            {
                $unwind: "$patientuid"
            },
            {
                $lookup: { from: "frequencies", localField: "patientorderitems.frequencyuid", foreignField: "_id", as: "patientorderitems.frequencyuid" }
            },

            // {
            //     $project: {
            //         EN: "$patientvisituid.visitid",
            //         entypeuid: "$entypeuid",
            //         ordernumber: "$ordernumber",
            //         ordercattype: "$patientorderitems.ordercattype",
            //         orderitemname: "$patientorderitems.orderitemname",
            //         status: "$patientorderitems.statusuid.valuedescription"
            //     }
            // },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
exports.find_user = function (req, res) {
    var loginid = req.body.loginid;

    MongoClient.connect(dbpath, (connectErr, client) => {
        var dbo = client.db(mongodbdata);
        dbo.collection("users").aggregate([
            {
                "$match":
                {
                    "loginid": loginid,
                    "statusflag": "A",
                    "activeto": null,
                }
            },

            {
                $project: {
                    defaultorguid: "$defaultorguid",
                    defaultdepartmentuid: "$defaultdepartment.uid",
                    defaultdepartmentname: "$defaultdepartment.name",
                    userwards: "$userwards",
                    roles: "$roles",
                    defaultrole: "$defaultrole",
                    loginid: "$loginid",
                    name: "$name",
                    code: "$code",
                    password: "$password"
                }
            },
            { $lookup: { from: "organisations", localField: "defaultorguid", foreignField: "_id", as: "defaultorguid" } },
            { $unwind: { path: "$defaultorguid", preserveNullAndEmptyArrays: true } },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            // db.close();
        });
    });
}
