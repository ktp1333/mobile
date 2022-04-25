module.exports = function (app) {
    app.get('/version', function (req, res) {
        res.status(200).json({ version: 1 });
    });
    // var local_host_singleid = require('./local_host_singleid.route.js');
    // app.post('/local_host_singleid/findconsent', local_host_singleid.findconsent);
    // app.post('/local_host_singleid/saveconsent', local_host_singleid.saveconsent);

    // var centrix_singleid = require('./centrix_singleid.route.js');
    // app.post('/centrix_singleid/getdetailbyHN', centrix_singleid.getdetailbyHN);
    var local_json = require('./local_json.route.js');
    app.post('/local_json/readjson', local_json.readjson);
    app.post('/local_json/writejson', local_json.writejson);
    app.post('/local_json/deletejson', local_json.deletejson);
    app.post('/local_json/editjson', local_json.editjson);
    app.post('/local_json/deletetemplatejson', local_json.deletetemplatejson);
    var centrix = require('./centrix.route.js');
    app.post('/centrix/visitcount', centrix.visitcount);
    app.post('/centrix/opd_princ', centrix.opd_princ);
    app.post('/centrix/organize', centrix.organize);
    app.post('/centrix/ward', centrix.ward);
    app.post('/centrix/warddetail', centrix.warddetail);
    app.post('/centrix/ipd_princ', centrix.ipd_princ);
    app.post('/centrix/revenuesplit', centrix.revenuesplit);
    //-------opdwt
    app.post('/centrix/find_status', centrix.find_status);
    app.post('/centrix/tracking', centrix.tracking);
    //-------track
    app.post('/centrix/trackingen', centrix.trackingen);
    //------emar
    app.post('/centrix/emar_patientonward_byorg', centrix.emar_patientonward_byorg);
    app.post('/centrix/getwardbyorg', centrix.getwardbyorg);
    app.post('/centrix/emar_med_byPTVUID', centrix.emar_med_byPTVUID);
    app.post('/centrix/find_user', centrix.find_user);
    //---nursepro
    var local_host_nurse = require('./local_host_nurse.route.js');
    app.post('/local_host_nurse/listtimeact', local_host_nurse.listtimeact);
    app.post('/local_host_nurse/getpatientbytime', local_host_nurse.getpatientbytime);
    app.post('/local_host_nurse/findformular', local_host_nurse.findformular);
    app.post('/local_host_nurse/getstaffhour', local_host_nurse.getstaffhour);
}