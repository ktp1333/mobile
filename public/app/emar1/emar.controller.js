var app = angular.module('myApp', ['ngMaterial', 'angular.filter']);
app.controller('emarController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, globalSetting, $filter) {
    $scope.warduid = $location.search()['warduid'];
    console.log($scope.warduid);
    $scope.orguid = $location.search()['orguid'];
    console.log($scope.orguid);

    // "http://203.154.49.149:3310/emar/#?orguid=59e865c8ab5f11532bab0537&warduid=5cf78505398fb07dfb3ef384"
    // $scope.orguid = "59e865c8ab5f11532bab0537";
    // $scope.warduid = '5cf78505398fb07dfb3ef384';
    // $scope.site = $location.search()['site'];
    // $scope.site = 'psuv';
    // console.log(globalSetting.checkOrg($scope.site));
    //----global-------------------
    // $scope.orguid = globalSetting.checkOrg($scope.site);
    // $scope.apiip = globalSetting.checkapiip($scope.site);
    // $scope.apiip = globalSetting.setting.apiip;
    $scope.apiip149 = globalSetting.setting.apiip149;
    $scope.ippub = globalSetting.setting.ippub;
    $scope.entypeuid = globalSetting.setting.entypeuid_opd;
    $scope.entypeuidipd = globalSetting.setting.entypeuid_ipd;
    $scope.formToggle = formToggle;
    $scope.transhn = transhn;
    $scope.test = test;
    $scope.patientonward = patientonward;
    $scope.getdetailmed = getdetailmed;
    $scope.getmed = getmed;
    $scope.DateThai = DateThai;
    $scope.getAge = getAge;
    $scope.showmed_bytime = showmed_bytime;
    $scope.box1 = false;
    var today = new Date();
    $scope.emar_schedule = [];
    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();
    setInterval(() => {
        patientonward();
    }, 200000);

    patientonward();
    $scope.sumemar = [];
    // init();
    function test(ID) {
        console.log(ID);
    }
    function showmed_bytime(params) {
        console.log(params);
        console.log('$scope.sumemar');
        console.log($scope.sumemar);
        formToggle();
        $scope.thistime = params;

    }
    function formToggle() {
        $scope.box1 = true;
        $('#showhour').slideToggle();
        // $('#showhour').css('display', 'none');
    }
    function getdetailmed(bed, beduid, hour, hourly) {
        console.log(bed);
        console.log(beduid);
        $scope.hour = hour;
        $scope.hourly = hourly;
        $scope.pt = {};
        $scope.pt = $scope.patient.filter(
            function (getbed) {
                return getbed.bedoccupancy.beduid.name == bed
            }
        );
        ID = $scope.pt[0]._id;
        console.log('$scope.pt');
        console.log($scope.pt);
        $scope.name = $scope.pt[0].patientuid.firstname + ' ' + $scope.pt[0].patientuid.lastname;
        $scope.thaiDOB = DateThai($scope.pt[0].patientuid.dateofbirth);
        $scope.age = getAge($scope.pt[0].patientuid.dateofbirth);
        $scope.mrn = $scope.pt[0].patientuid.mrn;
        $scope.bed = bed;
        $scope.beduid = beduid;
        mdate = moment(today).startOf('day').format();
        $http.post($scope.apiip149 + '/patientorder/emar_med_byPTVUID', {
            'orguid': $scope.orguid,
            'beduid': $scope.beduid,
            "patientvisituid": ID,
            "entypeuid": $scope.entypeuidipd,
            "fromdate": mdate,
        }).success(function (data) {
            if (data.patientorder && data.patientorder.length > 0) {
                $scope.patient_order = data.patientorder;
                console.log('$scope.patient_order');
                console.log($scope.patient_order);

                $scope.emar_detail_each = [];
                for (var i = 0; i < $scope.patient_order.length; i++) {
                    mbed = $scope.patient_order[i].beduid.name;
                    mname = $scope.patient_order[i].patientorderitems.orderitemname;
                    mdosage = $scope.patient_order[i].patientorderitems.dosage;
                    mdosageUOM = $scope.patient_order[i].patientorderitems.dosageUOM.valuedescription;
                    mfreq = $scope.patient_order[i].patientorderitems.frequencyuid[0].locallangdesc;
                    if ($scope.patient_order[i].patientorderitems.frequencyuid[0].timings) {
                        mfrequency = $scope.patient_order[i].patientorderitems.frequencyuid[0].timings;
                        var x;
                        for (x of mfrequency) {
                            // console.log(mmyy );
                            var mmyy = moment(x).format('HH:mm');
                            // console.log(mmyy);
                            $scope.emar_detail_each.push({
                                bed: mbed,
                                name: mname,
                                dosage: mdosage,
                                dosageUOM: mdosageUOM,
                                freq: mfreq,
                                dtime: mmyy,
                            });
                        }

                    } else {

                    }
                }

                for (var i = 0; i < $scope.emar_detail_each.length; i++) {
                    if ( $scope.emar_detail_each[i].dtime =='Invalid date') {
                        $scope.emar_detail_each[i].dtime ='prn'
                    }
                }
                console.log('$scope.emar_detail_each');
                console.log($scope.emar_detail_each);
                $scope.mtime = '';
                if ($scope.hour == 'X') {
                    if ($scope.hourly == 'prn') {
                        $scope.mtime = 'prn';
                    } else if ($scope.hourly == 'h0') {
                        $scope.mtime = '00:00';
                    } else if ($scope.hourly == 'h1') {
                        $scope.mtime = '01:00';
                    } else if ($scope.hourly == 'h2') {
                        $scope.mtime = '02:00';
                    } else if ($scope.hourly == 'h3') {
                        $scope.mtime = '03:00';
                    } else if ($scope.hourly == 'h4') {
                        $scope.mtime = '04:00';
                    } else if ($scope.hourly == 'h5') {
                        $scope.mtime = '05:00';
                    } else if ($scope.hourly == 'h6') {
                        $scope.mtime = '06:00';
                    } else if ($scope.hourly == 'h7') {
                        $scope.mtime = '07:00';
                    } else if ($scope.hourly == 'h8') {
                        $scope.mtime = '08:00';
                    } else if ($scope.hourly == 'h9') {
                        $scope.mtime = '09:00';
                    } else if ($scope.hourly == 'h10') {
                        $scope.mtime = '10:00';
                    } else if ($scope.hourly == 'h11') {
                        $scope.mtime = '11:00';
                    } else if ($scope.hourly == 'h12') {
                        $scope.mtime = '12:00';
                    } else if ($scope.hourly == 'h13') {
                        $scope.mtime = '13:00';
                    } else if ($scope.hourly == 'h14') {
                        $scope.mtime = '14:00';
                    } else if ($scope.hourly == 'h15') {
                        $scope.mtime = '15:00';
                    } else if ($scope.hourly == 'h16') {
                        $scope.mtime = '16:00';
                    } else if ($scope.hourly == 'h17') {
                        $scope.mtime = '17:00';
                    } else if ($scope.hourly == 'h18') {
                        $scope.mtime = '18:00';
                    } else if ($scope.hourly == 'h19') {
                        $scope.mtime = '19:00';
                    } else if ($scope.hourly == 'h20') {
                        $scope.mtime = '20:00';
                    } else if ($scope.hourly == 'h21') {
                        $scope.mtime = '21:00';
                    } else if ($scope.hourly == 'h22') {
                        $scope.mtime = '22:00';
                    } else if ($scope.hourly == 'h23') {
                        $scope.mtime = '23:59';
                    }
                    console.log('$scope.mtime');
                    console.log($scope.mtime);
                    console.log(parseInt($scope.mtime));
                    console.log('$scope.emar_detail_each');
                    console.log($scope.emar_detail_each);
                    $scope.meddetail = {};
                    if ($scope.mtime == 'prn') {
                        $scope.meddetail = $scope.emar_detail_each.filter(function (patientvisit) { return patientvisit.dtime == $scope.mtime; });
                    } else {
                        $scope.meddetail = $scope.emar_detail_each.filter(function (patientvisit) { return parseInt(patientvisit.dtime) == parseInt($scope.mtime); });
                    }
                    console.log('$scope.meddetail');
                    console.log($scope.meddetail);
                } else {
                    $scope.meddetail = $scope.emar_detail_each;
                }

            } else {

            }
        });
    }
    function getmed(ID, bed, beduid, ptname) {
        mdate = moment(today).startOf('day').format();
        $http.post($scope.apiip149 + '/patientorder/emar_med_byPTVUID', {
            'orguid': $scope.orguid,
            "patientvisituid": ID,
            "entypeuid": $scope.entypeuidipd,
            "fromdate": mdate,
            "beduid": beduid,
        }).success(function (data) {
            if (data.patientorder && data.patientorder.length > 0) {
                $scope.patient_order = data.patientorder;
                console.log(ID);
                console.log(bed);
                console.log('$scope.patient_order');
                console.log($scope.patient_order);

                $scope.emar_detail = [];
                for (var i = 0; i < $scope.patient_order.length; i++) {
                    mbed = $scope.patient_order[i].beduid.name;
                    mbeduid = $scope.patient_order[i].beduid._id;
                    mname = $scope.patient_order[i].patientorderitems.orderitemname;
                    mdosage = $scope.patient_order[i].patientorderitems.frequencyuid[0].description;
                    mstatus = $scope.patient_order[i].patientorderitems.statusuid.valuedescription;
                    mptname = $scope.patient_order[i].patientuid.firstname + ' ' + $scope.patient_order[i].patientuid.lastname;
                    if ($scope.patient_order[i].patientorderitems.frequencyuid[0].timings) {
                        mfrequency = $scope.patient_order[i].patientorderitems.frequencyuid[0].timings;
                        var x;
                        for (x of mfrequency) {
                            var mmyy = moment(x).format('HH:mm');
                            //   console.log(mmyy );
                            $scope.emar_detail.push({
                                bed: mbed,
                                beduid: mbeduid,
                                name: mname,
                                dosage: mdosage,
                                time: mmyy,
                                status: mstatus,
                                ptname: mptname,
                            });
                        }
                    } else {

                    }
                }
                $scope.emar = $filter('groupBy')($scope.emar_detail, '[time]');
                // console.log('$scope.emar');
                // console.log($scope.emar);
                var mtime = Object.keys($scope.emar);
                // console.log('mtime');
                // console.log(mtime);
                var aprn, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23;
                var xx;
                for (xx of mtime) {
                    if (xx == 'Invalid date') {
                        var xxID = 99;
                    } else {
                        var xxID = parseInt(xx.substring(0, 2));
                    }

                    if (xxID == 0) {
                        a0 = 'X';
                    } else if (xxID == 1) {
                        a1 = 'X';
                    } else if (xxID == 2) {
                        a2 = 'X';
                    } else if (xxID == 3) {
                        a3 = 'X';
                    } else if (xxID == 4) {
                        a4 = 'X';
                    } else if (xxID == 5) {
                        a5 = 'X';
                    } else if (xxID == 6) {
                        a6 = 'X';
                    } else if (xxID == 7) {
                        a7 = 'X';
                    } else if (xxID == 8) {
                        a8 = 'X';
                    } else if (xxID == 9) {
                        a9 = 'X';
                    } else if (xxID == 10) {
                        a10 = 'X';
                    } else if (xxID == 11) {
                        a11 = 'X';
                    } else if (xxID == 12) {
                        a12 = 'X';
                    } else if (xxID == 13) {
                        a13 = 'X';
                    } else if (xxID == 14) {
                        a14 = 'X';
                    } else if (xxID == 15) {
                        a15 = 'X';
                    } else if (xxID == 16) {
                        a16 = 'X';
                    } else if (xxID == 17) {
                        a17 = 'X';
                    } else if (xxID == 18) {
                        a18 = 'X';
                    } else if (xxID == 19) {
                        a19 = 'X';
                    } else if (xxID == 20) {
                        a20 = 'X';
                    } else if (xxID == 21) {
                        a21 = 'X';
                    } else if (xxID == 22) {
                        a22 = 'X';
                    } else if (xxID == 23) {
                        a23 = 'X';
                    } else if (xxID == 99) {
                        aprn = 'X';
                    }
                }
                $scope.emar_schedule.push({
                    bed: bed,
                    beduid: beduid,
                    ptname: ptname,
                    prn: aprn,
                    h0: a0,
                    h1: a1,
                    h2: a2,
                    h3: a3,
                    h4: a4,
                    h5: a5,
                    h6: a6,
                    h7: a7,
                    h8: a8,
                    h9: a9,
                    h10: a10,
                    h11: a11,
                    h12: a12,
                    h13: a13,
                    h14: a14,
                    h15: a15,
                    h16: a16,
                    h17: a17,
                    h18: a18,
                    h19: a19,
                    h20: a20,
                    h21: a21,
                    h22: a22,
                    h23: a23,
                });
                console.log('$scope.emar_schedule');
                console.log($scope.emar_schedule);


                // console.log(bed);
                console.log('$scope.emar_detail');
                console.log($scope.emar_detail);
                var json1 = $scope.sumemar;
                var json2 = $scope.emar_detail;

                $scope.sumemar = json1.concat(json2);
                // console.log('$scope.sumemar');
                // console.log($scope.sumemar);

            } else {

            }
        });
    }
    function patientonward() {
        $scope.patient = {};
        $scope.patient_order = {};
        $scope.emar_schedule = [];
        $scope.sumemar = [];
        $http.post($scope.apiip149 + '/patientvisit/emar_patientonward_byorg', {
            'orguid': $scope.orguid,
            'warduid': $scope.warduid,

        }).success(function (data) {
            if (data.patientonward && data.patientonward.length > 0) {
                $scope.patient = data.patientonward;
                console.log('$scope.patient');
                console.log($scope.patient);
                $scope.wardname = data.patientonward[0].bedoccupancy.warduid.description;

                // for (var i = 0; i < 1; i++) {
                for (var i = 0; i < $scope.patient.length; i++) {
                    var mptname = $scope.patient[i].patientuid.firstname + ' ' + $scope.patient[i].patientuid.lastname;
                    getmed($scope.patient[i]._id, $scope.patient[i].bedoccupancy.beduid.name, $scope.patient[i].bedoccupancy.beduid._id, mptname);
                }
            }
            // formToggle();
        });

    }
    function transhn(HN) {
        var mtext = (HN).replace(/-/g, "");
        var m1 = (mtext).substr(0, 2);
        var m2 = (mtext).substr(2, 2);
        var m3 = (mtext).substr(4, 6);
        mHN = m1 + '-' + m2 + '-' + m3;
        return mHN
    };

    function getAge(myDate) {
        var currentDate = moment();
        var dateOfBirth = moment(myDate);
        var years = currentDate.diff(dateOfBirth, 'years');
        dateOfBirth.add(years, 'years');
        var months = currentDate.diff(dateOfBirth, 'months');
        dateOfBirth.add(months, 'months');
        var days = currentDate.diff(dateOfBirth, 'days');
        var mage = years + ' Y /' + months + ' M /' + days + 'D';
        return mage;
    }

    function DateThai(myDate) {
        // var dateOfBirth = moment(myDate);
        // months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        var dt = myDate.split(/\-|\s/);
        var tyear = (parseInt(dt[0]) + 543).toString();
        var eyear = dt[0];
        var tday = dt[2].substring(0, 2);;
        var tmonth = dt[1];

        var thday = new Array("อาทิตย์", "จันทร์",
            "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์");

        var thmonth = new Array("", "มกราคม", "กุมภาพันธ์", "มีนาคม",
            "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน",
            "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
        var t2month = thmonth[parseInt(dt[1])];


        return tday + ' ' + t2month + ' ' + tyear;
    }
})








