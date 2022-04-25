(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMessages', 'angularMoment', 'angular.filter', 'angular-md5', 'onsen']);
    app.controller("npController", function ($scope, $location, $http, $filter, $timeout, $window, $q) {

        // $scope.site = localStorage.getItem('site');
        // $scope.site = $location.search()['site'];
        // console.log($scope.site);
        var vm = this;
        vm.loginid = ''
        // $scope.datafile_user = 'user.json';
        // $scope.datafile_time = 'time.json';
        $scope.entypeuidipd = "59ef351fd2bbe66c36f99862";
        $scope.patientonward = patientonward;
        $scope.listtime = listtime;
        $scope.chooseorg = chooseorg;
        $scope.chooseward = chooseward;
        $scope.findnow = findnow;
        $scope.login = login;
        $scope.find_prod = find_prod;
        $scope.find_formular = find_formular;
        $scope.caseonward = caseonward;
        var today = new Date();
        var yesterday = moment(today).add(-1, 'days');
        console.log(today);
        console.log(yesterday._d);
        init();

        function init() {

        }
        this.load = function (page) {

            mySplitter.content.load(page)
                .then(function () {
                    mySplitter.left.close();
                });
        };
        function login(loginid) {
            loginid = loginid.toLowerCase();
            console.log(loginid);
            if (loginid != '') {
                $http.post('/centrix/find_user', {
                    "loginid": loginid,
                }).then(function (response) {
                    if (response && response.data.data.length > 0) {
                        console.log(response);
                        $scope.loginuser = response.data.data[0];
                        $scope.hospname = $scope.loginuser.defaultorguid.description;
                        $scope.orguid = $scope.loginuser.defaultorguid._id;
                        $scope.orgname = $scope.loginuser.defaultorguid;
                        chooseorg($scope.orguid);
                        listtime($scope.orguid);
                    } else {
                        if (loginid == 'z') {
                            $scope.hospname = "test";
                            $scope.orguid = "5d09fb1b80256a7b271319a9";
                            // $scope.orguid = "5b6187eca03e2340f130e6fb";
                            // $scope.orguid = "59e865c8ab5f11532bab0537";
                            chooseorg($scope.orguid);
                            listtime($scope.orguid);

                        }
                    }

                })
            } else {
                mySplitter.content.load('login.html')
            }
        }
        function chooseorg(params) {
            mySplitter.content.load('loading.html')
            $http.post('/centrix/getwardbyorg', {
                "orguid": params,
            }).then(function (response) {
                $scope.ward = response.data.data;
                console.log('$scope.ward', $scope.ward);
            })
            mySplitter.content.load('ward.html')
        }
        function listtime(params) {
            $http.post('/local_host_nurse/listtimeact', {
                "orguid": params,
            }).then(function (response) {
                $scope.timea = response.data.data;
                $scope.timea_length = response.data.data.length;
                console.log('$scope.timea', $scope.timea);
                console.log('$scope.timea_length', $scope.timea_length);
                findnow();
            })
        }
        function findnow() {
            $scope._time = parseInt(moment(today).format("HH"));
            $scope.nursetimetype = $scope.timea.length;
            for (var j = 0; j < $scope.timea.length; j++) {

                if ($scope.timea[j].timein < $scope.timea[j].timeout) {
                    if ($scope._time >= $scope.timea[j].timein && $scope._time < $scope.timea[j].timeout) {
                        $scope.timeact = $scope.timea[j].timeactID;
                        break;
                    }
                } else {
                    if ($scope._time >= $scope.timea[j].timeout && $scope._time < $scope.timea[j].timein) {
                    } else {
                        $scope.timeact = $scope.timea[j].timeactID;
                        break;
                    }
                }
            }
            if ($scope.nursetimetype == 3) {
                // console.log(3);
                for (var j = 0; j < $scope.timea.length; j++) {
                    if ($scope.timea[j].timeactID == '1') {
                        $scope.timeact1 = $scope.timea[j].timeact;
                        $scope.timeactID1 = $scope.timea[j].timeactID;
                        $scope.fromtime1 = moment(today).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                        $scope.totime1 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                    } else if ($scope.timea[j].timeactID == '2') {
                        $scope.timeact2 = $scope.timea[j].timeact;
                        $scope.timeactID2 = $scope.timea[j].timeactID;
                        $scope.fromtime2 = moment(today).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                        $scope.totime2 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;

                    } else if ($scope.timea[j].timeactID == '3') {
                        if ($scope.timea[j].nextdate == 'N') {
                            $scope.fromtime3 = moment(today).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                            $scope.totime3 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                        } else {
                            $scope.fromtime3 = moment(yesterday).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                            $scope.totime3 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                        }

                        $scope.timeact3 = $scope.timea[j].timeact;
                        $scope.timeactID3 = $scope.timea[j].timeactID;

                    } else {

                    }
                    $scope.timeactID0 = $scope.timeactID3;
                    $scope.fromtime0 = $scope.fromtime3;
                    $scope.totime0 = $scope.totime3;
                    $scope.timeact0 = $scope.timeact3;
                }
            } else {
                // console.log(2);
                for (var j = 0; j < $scope.timea.length; j++) {
                    if ($scope.timea[j].timeactID == '1') {
                        $scope.timeact1 = $scope.timea[j].timeact;
                        $scope.timeactID1 = $scope.timea[j].timeactID;
                        $scope.fromtime1 = moment(today).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                        $scope.totime1 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                    } else if ($scope.timea[j].timeactID == '2') {
                        if ($scope.timea[j].nextdate == 'N') {
                            $scope.fromtime2 = moment(today).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                            $scope.totime2 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                        } else {
                            $scope.fromtime2 = moment(yesterday).format('YYYY-MM-DD') + $scope.timea[j].tfrom;
                            $scope.totime2 = moment(today).format("YYYY-MM-DD") + $scope.timea[j].tto;
                        }
                        $scope.timeact2 = $scope.timea[j].timeact;
                        $scope.timeactID2 = $scope.timea[j].timeactID;
                    } else {

                    }
                    $scope.timeactID0 = $scope.timeactID2;
                    $scope.fromtime0 = $scope.fromtime2;
                    $scope.totime0 = $scope.totime2;
                    $scope.timeact0 = $scope.timeact2;
                }
            }

            // console.log('$scope.nursetimetype', $scope.nursetimetype);
            // console.log('$scope._time', $scope._time);
            // console.log('$scope.timeact', $scope.timeact);
            // console.log('$scope.fromtime0', $scope.fromtime0);
            // console.log('$scope.totime0', $scope.totime0);
            // console.log('$scope.fromtime1', $scope.fromtime1);
            // console.log('$scope.totime1', $scope.totime1);
            // console.log('$scope.fromtime2', $scope.fromtime2);
            // console.log('$scope.totime2', $scope.totime2);
            var t0 = moment(yesterday).format("DD/MM/YYYY");
            var t1 = moment(today).format("DD/MM/YYYY");
            if ($scope.nursetimetype == 2) {
                console.log(2);
                var time1 = $scope.timeact1;
                var time2 = $scope.timeact2;
                var time0 = $scope.timeact2;
                // $scope.show_table = [{ item: 'item', item0: t0, item1: t1, item2: t1 }];
                $scope.show_table = [{ item: 'item', item0: '0', item1: '1', item2: '2' }];
                $scope.show_table.push({
                    item: 'วันที่',
                    item0: moment(yesterday).format("DD/MM/YYYY"),
                    item1: moment(today).format("DD/MM/YYYY"),
                    item2: moment(today).format("DD/MM/YYYY"),
                });
                $scope.show_table.push({
                    item: 'เวร',
                    item0: time0,
                    item1: time1,
                    item2: time2,
                });

            } else if ($scope.nursetimetype == 3) {
                console.log(3);
                var time1 = $scope.timeact1;
                var time2 = $scope.timeact2;
                var time3 = $scope.timeact3;
                var time0 = $scope.timeact3;
                // $scope.show_table = [{ item: 'item', item0: t0, item1: t1, item2: t1, item3: t1 }];
                $scope.show_table = [{ item: 'item', item0: '0', item1: '1', item2: '2', item3: '3' }];
                $scope.show_table.push({
                    item: 'วันที่',
                    item0: moment(yesterday).format("DD/MM/YYYY"),
                    item1: moment(today).format("DD/MM/YYYY"),
                    item2: moment(today).format("DD/MM/YYYY"),
                    item3: moment(today).format("DD/MM/YYYY"),
                });
                $scope.show_table.push({
                    item: 'เวร',
                    item0: time0,
                    item1: time1,
                    item2: time2,
                    item3: time3
                });
            } else {
            }

            $scope.show_table.push({
                item: 'census:',
            });
            $scope.show_table.push({
                item: 'Require Hours:',
            });
            $scope.show_table.push({
                item: 'Staff Hours:',
            });
            $scope.show_table.push({
                item: '% Productivity:',
            });
            $scope.show_table.push({
                item: 'Actual Staff:',
            });
            $scope.show_table.push({
                item: 'Require Staff:',
            });
            console.log($scope.show_table);
        }
        function chooseward(params) {
            console.log('$scope.hospname', $scope.hospname);
            $scope.wardid = params._id;
            $scope.wardname = params.name;
            console.log('$scope.wardname', $scope.wardname);
            find_formular($scope.wardname);
            caseonward($scope.wardid, $scope.timeact);
        }
        function find_formular(ward) {
            mySplitter.content.load('loading.html');
            $http.post('/local_host_nurse/findformular', {
                ward: ward,
                orguid: $scope.orguid,
            }).then(function (data) {
                $scope.formular = data.data.data[0];
                console.log('$scope.formular', $scope.formular);
                $scope.m = $scope.formular.morning;
                $scope.e = $scope.formular.evening;
                $scope.n = $scope.formular.night;
                $scope.staffworkinghour = parseFloat($scope.formular.staffhour);
                console.log('$scope.staffworkinghour', $scope.staffworkinghour);


                async.waterfall([
                    function get1(callback) {
                        find_prod($scope.fromtime0, $scope.totime0, $scope.timeactID0, $scope.wardname, '0', function (cback) {

                            callback();
                        });

                    },
                    function get2(callback) {
                        find_prod($scope.fromtime1, $scope.totime1, $scope.timeactID1, $scope.wardname, '1', function (cback) {

                            callback();
                        });

                    },
                    function get3(callback) {
                        find_prod($scope.fromtime2, $scope.totime2, $scope.timeactID2, $scope.wardname, '2', function (cback) {

                            callback();
                        });

                    },
                    function get4(callback) {
                        // console.table($scope.show_table);
                        for (var i = 0; i < $scope.show_table.length; i++) {
                            if (i == 0) {
                                $scope.show_table[i].show = false;
                            } else {
                                $scope.show_table[i].show = true;
                            }
                        }
                        console.log($scope.show_table);

                        mySplitter.content.load('nursepro.html');
                        callback();
                    },
                ], function (
                ) {

                })
            });
        }
        function find_prod(fromtime, totime, timeactID, ward, timeact, cback) {

            console.log('fromtime', fromtime);
            console.log('totime', totime);
            console.log('$scope.orguid', $scope.orguid);
            console.log('timeactID', timeactID);
            console.log('timeact', timeact);
            console.log('ward', ward);

            $http.post('/local_host_nurse/getpatientbytime', {
                date1: fromtime,
                date2: totime,
                ward: ward,
                orguid: $scope.orguid,
                timeactID: timeactID,
            }).then(function (data) {
                if (data && data.data.data.length > 0) {
                    $scope.alldata = data.data.data;
                    var alldata_length = data.data.data.length;
                    $scope.details = data.data.data[0];
                    console.log('$scope.alldata', $scope.alldata);
                    console.log('alldata_length', alldata_length);

                    $scope.requirehour100 = 0;
                    $scope.requirehour = 0;
                    $scope.census = $scope.alldata.length;
                    for (var i = 0; i < $scope.alldata.length; i++) {
                        if ($scope.alldata[i].class_score == 1) {
                            $scope.requirehour100 = $scope.requirehour100 + parseFloat($scope.formular.level1);
                        } else if ($scope.alldata[i].class_score == 2) {
                            $scope.requirehour100 = $scope.requirehour100 + parseFloat($scope.formular.level2);
                        } else if ($scope.alldata[i].class_score == 3) {
                            $scope.requirehour100 = $scope.requirehour100 + parseFloat($scope.formular.level3);
                        } else if ($scope.alldata[i].class_score == 4) {
                            $scope.requirehour100 = $scope.requirehour100 + parseFloat($scope.formular.level4);
                        } else if ($scope.alldata[i].class_score == 5) {
                            $scope.requirehour100 = $scope.requirehour100 + parseFloat($scope.formular.level5);
                        } else {
                        }
                    }
                    console.log('timeact', timeact);
                    if (timeact == '1') {
                        $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.morning) / 100;
                    } else if (timeact == '2') {
                        $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.evening) / 100;
                    } else if (timeact == '3') {
                        $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.night) / 100;
                    } else if (timeact == '0') {
                        if ($scope.timea_length == 2) {
                            $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.evening) / 100;
                        } else if ($scope.timea_length == 3) {
                            $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.night) / 100;
                        }
                    } else {
                    }
                    console.log('$scope.requirehour', $scope.requirehour);
                    //หา staff hour
                    $http.post('/local_host_nurse/getstaffhour', {
                        date: moment(fromtime).format("DD/MM/YYYY"),
                        ward: ward,
                        orguid: $scope.orguid,
                        timeactID: timeactID,
                    }).then(function (data) {

                        console.log('data', data.data.data);
                        if (data && data.data.data.length > 0) {
                            $scope.staffs = data.data.data[0];
                            console.log('$scope.staffs', $scope.staffs);
                            $scope.staffs.HOD = parseInt($scope.staffs.HOD) || 0;
                            $scope.staffs.PN = parseInt($scope.staffs.PN) || 0;
                            $scope.staffs.RN = parseInt($scope.staffs.RN) || 0;
                            $scope.actualstaffhour = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN) * parseFloat($scope.formular.staffhour);
                            $scope.actualtotalstaff = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN);

                            $scope.require_total_Staff = $scope.requirehour / parseFloat($scope.formular.staffhour);
                            $scope.require_RN = $scope.require_total_Staff * $scope.formular.RN / 100;
                            $scope.require_PN = $scope.require_total_Staff * $scope.formular.PN / 100;

                            console.table($scope.show_table);
                            $scope.productivity = ($scope.requirehour / $scope.actualstaffhour) * 100;
                            $scope.requirestaff = ($scope.requirehour / $scope.staffworkinghour);

                            console.log('date', moment(fromtime).format("DD/MM/YYYY"));
                            console.log('type:', timeact);
                            console.log('timeID:', timeactID);
                            console.log('census', $scope.alldata.length);
                            console.log('Require Hours:', $scope.requirehour);
                            console.log('Staff Hours:', $scope.actualstaffhour);
                            console.log('% Productivity:', $scope.productivity);

                            console.log('Actual total Staff:', $scope.actualtotalstaff);
                            console.log('Require total Staff:', $scope.requirestaff);
                            console.log('timeact', timeact);
                            if (timeact == '0') {
                                $scope.show_table[3].item0 = $scope.alldata.length;
                                $scope.show_table[4].item0 = parseFloat($scope.requirehour).toFixed(2);
                                $scope.show_table[5].item0 = parseFloat($scope.actualstaffhour).toFixed(2);
                                $scope.show_table[6].item0 = parseFloat($scope.productivity).toFixed(2);
                                $scope.show_table[7].item0 = $scope.actualtotalstaff;
                                $scope.show_table[8].item0 = parseInt($scope.requirestaff);
                            } else if (timeact == '1') {
                                $scope.show_table[3].item1 = $scope.alldata.length;
                                $scope.show_table[4].item1 = parseFloat($scope.requirehour).toFixed(2);
                                $scope.show_table[5].item1 = parseFloat($scope.actualstaffhour).toFixed(2);
                                $scope.show_table[6].item1 = parseFloat($scope.productivity).toFixed(2);
                                $scope.show_table[7].item1 = $scope.actualtotalstaff;
                                $scope.show_table[8].item1 = parseInt($scope.requirestaff);

                            } else if (timeact == '2') {
                                $scope.show_table[3].item2 = $scope.alldata.length;
                                $scope.show_table[4].item2 = parseFloat($scope.requirehour).toFixed(2);
                                $scope.show_table[5].item2 = parseFloat($scope.actualstaffhour).toFixed(2);
                                $scope.show_table[6].item2 = parseFloat($scope.productivity).toFixed(2);
                                $scope.show_table[7].item2 = $scope.actualtotalstaff;
                                $scope.show_table[8].item2 = parseInt($scope.requirestaff);
                            } else if (timeact == '3') {
                                $scope.show_table[3].item3 = $scope.alldata.length;
                                $scope.show_table[4].item3 = parseFloat($scope.requirehour).toFixed(2);
                                $scope.show_table[5].item3 = parseFloat($scope.actualstaffhour).toFixed(2);
                                $scope.show_table[6].item3 = parseFloat($scope.productivity).toFixed(2);
                                $scope.show_table[7].item3 = $scope.actualtotalstaff;
                                $scope.show_table[8].item3 = parseInt($scope.requirestaff);
                            } else {
                            }

                            console.table($scope.show_table);
                            cback();
                        }
                    });
                } else {
                    console.log('nodata');
                    console.log('timeactID', timeactID);
                    console.log('$scope.timeact', $scope.timeact);
                    if ($scope.timeact == timeactID) {
                        console.log('find patient on ward');
                        // caseonward($scope.wardid, timeactID);
                        console.log('timeactID', timeactID);
                        if (timeactID == 0) {
                            $scope.show_table[3].item0 = $scope.patient.length;
                        } else if (timeactID == 1) {
                            $scope.show_table[3].item1 = $scope.patient.length;
                        } else if (timeactID == 2) {
                            $scope.show_table[3].item2 = $scope.patient.length;
                        } else if (timeactID == 3) {
                            $scope.show_table[3].item3 = $scope.patient.length;
                        } else {
                        }
                        console.table($scope.show_table);
                        cback();
                    } else {
                        console.log('skip');
                        cback();
                    }

                }

            })
        }
        function caseonward(warduid, timeact) {


            $http.post('/centrix/emar_patientonward_byorg', {
                'orguid': $scope.orguid,
                'warduid': warduid,

            }).then(function (data) {
                if (data && data.data.data.length > 0) {
                    $scope.patient = data.data.data;
                    $scope.patient_length = $scope.patient.length;
                    console.log('$scope.patient', $scope.patient);
                    console.log('$scope.patient_length', $scope.patient_length);
                    // console.log('timeact', timeact);
                    // if (timeact == 0) {
                    //     $scope.show_table[3].item0 = $scope.patient.length;
                    // } else if (timeact == 1) {
                    //     $scope.show_table[3].item1 = $scope.patient.length;
                    // } else if (timeact == 2) {
                    //     $scope.show_table[3].item2 = $scope.patient.length;
                    // } else if (timeact == 3) {
                    //     $scope.show_table[3].item3 = $scope.patient.length;
                    // } else {
                    // }
                    // console.table($scope.show_table);
                    // mySplitter.content.load('patient.html');

                } else {
                    // $scope.patient = [];
                    // $scope.patient_length = 0;
                    // mySplitter.content.load('patient.html');
                }

            });

        }
        function pt_onward(params) {
            console.log($scope.hospname);
            $scope.wardname = params.name;
            console.log($scope.wardname);
            // console.log(params);
            patientonward(params._id)

            mySplitter.content.load('loading.html');
        }
        function patientonward(warduid) {
            $scope.patient = {};
            // $scope.patient_order = {};
            // $scope.emar_schedule = [];
            // $scope.sumemar = [];

            $http.post('/centrix/emar_patientonward_byorg', {
                'orguid': $scope.orguid,
                'warduid': warduid,

            }).then(function (data) {
                if (data && data.data.data.length > 0) {
                    $scope.patient = data.data.data;
                    $scope.patient_length = $scope.patient.length;
                    console.log('$scope.patient');
                    console.log($scope.patient);
                    $scope.wardname = $scope.patient[0].bedoccupancy.warduid.description;
                    // async.eachOfSeries($scope.patient, function (episode, index, callback) {
                    //     if (episode) {
                    //         var mptname = episode.patientuid.firstname + ' ' + episode.patientuid.lastname;
                    //         getmed(episode._id, episode.bedoccupancy.beduid.name, episode.bedoccupancy.beduid._id, mptname, function () {

                    //             callback();
                    //         });
                    //     } else {
                    //         callback();
                    //     }


                    // }, function () {
                    //     mySplitter.content.load('emar.html');

                    // });

                    mySplitter.content.load('patient.html');

                } else {
                    $scope.patient = [];
                    $scope.patient_length = 0;
                    mySplitter.content.load('patient.html');
                }
                // formToggle();
            });

        }

    });
})();