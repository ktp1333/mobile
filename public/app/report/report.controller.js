var app = angular.module('myApp', ['ngMaterial', 'angular.filter']);
app.controller('reportController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $filter) {
    $scope.selectdate = selectdate;
    $scope.refreshmenu = refreshmenu;
    $scope.report1 = report1;
    $scope.showdaily = showdaily;
    $scope.show_period = show_period;
    $scope.show_report2 = false;
    $scope.show_report3 = false;
    $scope.show_daily = show_daily;
    $scope.report4 = report4;
    $scope.report5 = report5;
    $scope.reporttrend = reporttrend;
    $scope.timeact = 0;
    $scope.wardid = $location.search()['ward'];
    if ($scope.wardid == '5d8843b68b5007af5cd7c35b' ||
        $scope.wardid == '5d8843b68b5007af5cd7c35d' ||
        $scope.wardid == '5d8843b68b5007af5cd7c35f') {
        console.log('ICU');
        $scope.q_menu = 'mix1';
        $scope.ward = 'ICU';
        $scope.orguid = '5d09fb1b80256a7b271319a9';
        init();

    } else {
        $http({
            method: "POST",
            url: 'http://94.74.119.221:3000/ward/getwardbyID',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                "ID": $scope.wardid
            })
        }).success(function (data) {
            $scope.ward = data.wardname[0].name;
            $scope.orguid = data.wardname[0].orguid;

            $scope.q_menu = 'single';
            console.log($scope.ward);
            init();
        });
    }

    console.log($scope.wardid);

    // --------------------------------------------
    $scope.init = init;
    $scope.selectdata = selectdata;
    $scope.daily = daily;
    $scope.nextRN = 0;
    $scope.nextPN = 0;
    $scope.calnextshift = calnextshift;
    $scope.staffworkinghour = 0;
    $scope.nextproduct = 0;
    $scope.exitwindows = exitwindows;
    // $scope.sumdaily1 = sumdaily1;
    $scope.selectrep4 = selectrep4;
    $scope.show_daily4 = show_daily4;
    $scope.show_all4 = show_all4;
    $scope.JSONToCSVConvertor = JSONToCSVConvertor;
    $scope.json2xls = json2xls;
    $scope.group_daily4 = group_daily4;
    $scope.chart1 = chart1;
    $scope.closeallquality = closeallquality;
    $scope.R1 = R1;
    $scope.R2 = R2;
    $scope.showR2 = true;
    $scope.findproduc = findproduc;
    $scope.createtemplate = createtemplate;
    $scope.trend = trend;
    $scope.findproducdaily = findproducdaily;
    //----------------------------------------------
    var today = new Date();
    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function exitwindows() {
        window.close();
    }
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }
    setTimeout(function () {
        $scope.toggleLeft();
    }, 1000);
    function closeallquality() {
        $scope.showR1 = false;
        $scope.showR2 = false;

    }
    function R1() {
        closeallquality();
        $scope.showR1 = true;
    }
    function R2() {
        closeallquality();
        $scope.showR2 = true;
    }
    function selectdate(dmy) {
        console.log(dmy);
        $scope.toggleLeft();
        $scope.dmy = dmy;
    }
    function refreshmenu() {
        $scope.right = false;
        $scope.left = false;
        $scope.toggleLeft();
    }
    function closeallreport() {
        $scope.show_report1 = false;
        $scope.show_report2 = false;
        $scope.show_report3 = false;
        $scope.show_report4 = false;
        $scope.show_report5 = false;
        $scope.show_reporttrend = false;

    }
    function report1() {
        closeallreport();
        $scope.show_report1 = true;
        $scope.mlabel = "report1";
    }
    function showdaily(choosedate) {
        console.log(choosedate)
        closeallreport();
        $scope.show_report2 = true;
        $scope.mlabel = "report2";
        daily(choosedate, "report2");

    }
    function show_period() {
        // closeallreport();
        $scope.show_report3 = false;
        $scope.show_report2 = true;
    }
    function show_daily() {
        // closeallreport();
        $scope.show_report3 = true;
        $scope.show_report2 = false;
    }
    function report4() {
        closeallreport();
        $scope.show_report4 = true;
        $scope.mlabel = "report4";
    }
    function report5() {
        closeallreport();
        $scope.show_report5 = true;
        $scope.mlabel = "report5";
    }
    function reporttrend(choosedate) {
        closeallreport();
        $scope.show_reporttrend = true;
        $scope.mlabel = "reporttrend";
        trend(choosedate, "reporttrend");

    }
    //-------------------------------------------------------------------------------------------
    function init() {


        $http.post('/nurse_time/listtimeact', {
            orguid: $scope.orguid
        }).success(function (data) {
            $scope.nursetimes = data.nurse_time;
            $scope.timea = data.nurse_time;
            console.log('$scope.nursetimes');
            console.log($scope.nursetimes);
            for (var i = 0; i < $scope.nursetimes.length; i++) {
                if ($scope.nursetimes[i].timeactID == '1') {
                    $scope.t1 = $scope.nursetimes[i].timeact;
                } else if ($scope.nursetimes[i].timeactID == '2') {
                    $scope.t2 = $scope.nursetimes[i].timeact;
                } else if ($scope.nursetimes[i].timeactID == '3') {
                    $scope.t3 = $scope.nursetimes[i].timeact;
                } else {
                }
            }
            // console.log($scope.t1);
            // console.log($scope.t2);
            // console.log($scope.t3);
        });
        $http.post('/formular/listformular', {
            orguid: $scope.orguid
        }).success(function (data) {
            $scope.warddesc = data.formular;
            console.log('$scope.warddesc');
            console.log($scope.warddesc);


        });
        $http({
            method: "POST",
            url: '/formular/findformular',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                "ward": $scope.ward,
                "orguid": $scope.orguid
            })
        }).success(function (data) {
            $scope.formular = data.formular[0];
            console.log('$scope.formular');
            console.log($scope.formular);
            $scope.m = $scope.formular.morning;
            $scope.e = $scope.formular.evening;
            $scope.n = $scope.formular.night;

            $scope.staffworkinghour = parseFloat($scope.formular.staffhour);
            console.log('$scope.staffworkinghour');
            console.log($scope.staffworkinghour);

        });

    }
    //-------------------report4
    function selectrep4(ID) {
        $scope.img_waiting = true;
        var dmy = $scope.dmy;
        async.waterfall([
            function get0(callback) {
                var mlength = moment(dmy).endOf('month').format('DD');
                var mmyy = moment(dmy).format('/MM/YYYY');
                $scope.dayinmonth = [];
                for (i = 1; i <= mlength; i++) {

                    var ii = parseInt(i) + 100;
                    ii = (ii.toString()).substring(1, 3);
                    $scope.dayinmonth.push({
                        date: ii + mmyy,
                        fall: 0,
                        ivf: 0,
                        aline: 0,
                        cline: 0,
                        heplock: 0,
                        foley: 0,
                        et: 0,
                        wound: 0,
                        bedsore: 0,
                        drain: 0,
                        isolation1: 0,
                        isolation2: 0,
                        isolation3: 0,
                        isolation4: 0,
                        isolation5: 0,
                    });
                }

                console.log('$scope.dayinmonth0');
                console.log($scope.dayinmonth);
                mdate = moment(dmy).format('YYYY-MM-DD');
                mdate1 = moment(dmy).startOf('month').format('DD/MM/YYYY');
                mdate2 = moment(dmy).endOf('month').format('DD/MM/YYYY');
                console.log(mdate1);
                console.log(mdate2);
                // console.log(ward);
                console.log(ID);

                $scope.time = {};
                $scope.time = $scope.nursetimes.filter(function (timea) { return timea._id == ID });
                console.log('$scope.time');
                console.log($scope.time);
                $scope.timedesc = $scope.time[0].timeact;
                $scope.timeact = $scope.time[0].timeactID;
                $scope.tfrom = $scope.time[0].tfrom;
                $scope.tto = $scope.time[0].tto;


                console.log($scope.timeact);
                console.log($scope.tfrom);
                console.log($scope.tto);

                $scope.fromtime = moment(dmy).format('YYYY-MM-DD') + $scope.tfrom;
                console.log($scope.fromtime);
                $scope.totime = moment(dmy).format('YYYY-MM-DD') + $scope.tto;
                console.log($scope.totime);
                callback();

            },
            function get1(callback) {
                $http.post('/maindata/quality_fall', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.fall = data.maindata;
                    console.log('$scope.fall');
                    console.log($scope.fall);
                    callback();
                });
            },
            function get2(callback) {
                $http.post('/maindata/quality_ivf', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.ivf = data.maindata;
                    console.log('$scope.ivf');
                    console.log($scope.ivf);
                    callback();
                });
            },
            function get3(callback) {
                $http.post('/maindata/quality_aline', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.aline = data.maindata;
                    console.log('$scope.aline');
                    console.log($scope.aline);
                    callback();
                });
            },
            function get4(callback) {
                $http.post('/maindata/quality_cline', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.cline = data.maindata;
                    console.log('$scope.cline');
                    console.log($scope.cline);
                    callback();
                });
            },
            function get5(callback) {
                $http.post('/maindata/quality_heplock', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.heplock = data.maindata;
                    console.log('$scope.heplock');
                    console.log($scope.heplock);
                    callback();
                });
            },
            function get6(callback) {
                $http.post('/maindata/quality_foley', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.foley = data.maindata;
                    console.log('$scope.foley');
                    console.log($scope.foley);
                    callback();
                });
            },
            function get7(callback) {
                $http.post('/maindata/quality_et', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.et = data.maindata;
                    console.log('$scope.et');
                    console.log($scope.et);
                    callback();
                });
            },
            function get8(callback) {
                $http.post('/maindata/quality_wound', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.wound = data.maindata;
                    console.log('$scope.wound');
                    console.log($scope.wound);
                    callback();
                });
            },
            function get9(callback) {
                $http.post('/maindata/quality_bedsore', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.bedsore = data.maindata;
                    console.log('$scope.bedsore');
                    console.log($scope.bedsore);
                    callback();
                });
            },
            function get10(callback) {
                $http.post('/maindata/quality_drain', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact
                }).success(function (data) {
                    $scope.drain = data.maindata;
                    console.log('$scope.drain');
                    console.log($scope.drain);
                    callback();
                });
            },
            function getiso1(callback) {
                $http.post('/maindata/quality_isolation', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "level": 1
                }).success(function (data) {
                    $scope.isolation1 = data.maindata;
                    console.log('$scope.isolation1');
                    console.log($scope.isolation1);
                    callback();
                });
            },
            function getiso2(callback) {
                $http.post('/maindata/quality_isolation', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "level": 2
                }).success(function (data) {
                    $scope.isolation2 = data.maindata;
                    console.log('$scope.isolation2');
                    console.log($scope.isolation2);
                    callback();
                });
            },
            function getiso3(callback) {
                $http.post('/maindata/quality_isolation', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "level": 3
                }).success(function (data) {
                    $scope.isolation3 = data.maindata;
                    console.log('$scope.isolation3');
                    console.log($scope.isolation3);
                    callback();
                });
            },
            function getiso4(callback) {
                $http.post('/maindata/quality_isolation', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "level": 4
                }).success(function (data) {
                    $scope.isolation4 = data.maindata;
                    console.log('$scope.isolation4');
                    console.log($scope.isolation4);
                    callback();
                });
            },
            function getiso5(callback) {
                $http.post('/maindata/quality_isolation', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "level": 5
                }).success(function (data) {
                    $scope.isolation5 = data.maindata;
                    console.log('$scope.isolation5');
                    console.log($scope.isolation5);
                    callback();
                });
            },
            function getclass1(callback) {
                $http.post('/maindata/quality_classification', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "class_score": 1
                }).success(function (data) {
                    $scope.classification1 = data.maindata;
                    console.log('$scope.classification1');
                    console.log($scope.classification1);
                    callback();
                });
            },
            function getclass2(callback) {
                $http.post('/maindata/quality_classification', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "class_score": 2
                }).success(function (data) {
                    $scope.classification2 = data.maindata;
                    console.log('$scope.classification2');
                    console.log($scope.classification2);
                    callback();
                });
            },
            function getclass3(callback) {
                $http.post('/maindata/quality_classification', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "class_score": 3
                }).success(function (data) {
                    $scope.classification3 = data.maindata;
                    console.log('$scope.classification3');
                    console.log($scope.classification3);
                    callback();
                });
            },
            function getclass4(callback) {
                $http.post('/maindata/quality_classification', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "class_score": 4
                }).success(function (data) {
                    $scope.classification4 = data.maindata;
                    console.log('$scope.classification4');
                    console.log($scope.classification4);
                    callback();
                });
            },
            function getclass5(callback) {
                $http.post('/maindata/quality_classification', {
                    "orguid": $scope.orguid,
                    "ward": $scope.ward,
                    "fromtime": mdate1,
                    "totime": mdate2,
                    "timeact": $scope.timeact,
                    "class_score": 5
                }).success(function (data) {
                    $scope.classification5 = data.maindata;
                    console.log('$scope.classification5');
                    console.log($scope.classification5);
                    callback();
                });
            },
        ], function (
        ) {
            // for (var j = 0; j < $scope.dayinmonth.length; j++) {
            //     for (var i = 0; i < $scope.fall.length; i++) {
            //         if ($scope.fall[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].fall = $scope.fall[i].fall;
            //         }
            //     }
            //     for (var i = 0; i < $scope.ivf.length; i++) {
            //         if ($scope.ivf[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].ivf = $scope.ivf[i].ivf;
            //         }
            //     }
            //     for (var i = 0; i < $scope.aline.length; i++) {
            //         if ($scope.aline[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].aline = $scope.aline[i].aline;
            //         }
            //     }
            //     for (var i = 0; i < $scope.cline.length; i++) {
            //         if ($scope.cline[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].cline = $scope.cline[i].cline;
            //         }
            //     }
            //     for (var i = 0; i < $scope.heplock.length; i++) {
            //         if ($scope.heplock[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].heplock = $scope.heplock[i].heplock;
            //         }
            //     }
            //     for (var i = 0; i < $scope.foley.length; i++) {
            //         if ($scope.foley[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].foley = $scope.foley[i].foley;
            //         }
            //     }
            //     for (var i = 0; i < $scope.et.length; i++) {
            //         if ($scope.et[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].et = $scope.et[i].et;
            //         }
            //     }
            //     for (var i = 0; i < $scope.wound.length; i++) {
            //         if ($scope.wound[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].wound = $scope.wound[i].wound;
            //         }
            //     }
            //     for (var i = 0; i < $scope.bedsore.length; i++) {
            //         if ($scope.bedsore[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].bedsore = $scope.bedsore[i].bedsore;
            //         }
            //     }
            //     for (var i = 0; i < $scope.drain.length; i++) {
            //         if ($scope.drain[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].drain = $scope.drain[i].drain;
            //         }
            //     }
            //     for (var i = 0; i < $scope.isolation1.length; i++) {
            //         if ($scope.isolation1[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].isolation1 = $scope.isolation1[i].isolation;
            //         }
            //     }
            //     for (var i = 0; i < $scope.isolation2.length; i++) {
            //         if ($scope.isolation2[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].isolation2 = $scope.isolation2[i].isolation;
            //         }
            //     }
            //     for (var i = 0; i < $scope.isolation3.length; i++) {
            //         if ($scope.isolation3[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].isolation3 = $scope.isolation3[i].isolation;
            //         }
            //     }
            //     for (var i = 0; i < $scope.isolation4.length; i++) {
            //         if ($scope.isolation4[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].isolation4 = $scope.isolation4[i].isolation;
            //         }
            //     }
            //     for (var i = 0; i < $scope.isolation5.length; i++) {
            //         if ($scope.isolation5[i]._id.date == $scope.dayinmonth[j].date) {
            //             $scope.dayinmonth[j].isolation5 = $scope.isolation5[i].isolation;
            //         }
            //     }

            // }
            for (var j = 0; j < $scope.dayinmonth.length; j++) {

                if ($scope.fall.length > 0) {
                    for (var i = 0; i < $scope.fall.length; i++) {
                        $scope.dayinmonth[j].fall = 0;
                        if ($scope.fall[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].fall = $scope.fall[i].fall;

                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].fall = 0;
                }

                if ($scope.ivf.length > 0) {
                    for (var i = 0; i < $scope.ivf.length; i++) {
                        $scope.dayinmonth[j].ivf = 0;
                        if ($scope.ivf[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].ivf = $scope.ivf[i].ivf;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].ivf = 0;
                }

                if ($scope.aline.length > 0) {
                    for (var i = 0; i < $scope.aline.length; i++) {
                        $scope.dayinmonth[j].aline = 0;

                        if ($scope.aline[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].aline = $scope.aline[i].aline;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].aline = 0;
                }

                if ($scope.cline.length > 0) {
                    for (var i = 0; i < $scope.cline.length; i++) {
                        $scope.dayinmonth[j].cline = 0;
                        if ($scope.cline[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].cline = $scope.cline[i].cline;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].cline = 0;
                }

                if ($scope.heplock.length > 0) {
                    for (var i = 0; i < $scope.heplock.length; i++) {
                        $scope.dayinmonth[j].heplock = 0;
                        if ($scope.heplock[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].heplock = $scope.heplock[i].heplock;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].heplock = 0;
                }
                if ($scope.foley.length > 0) {
                    for (var i = 0; i < $scope.foley.length; i++) {
                        $scope.dayinmonth[j].foley = 0;
                        if ($scope.foley[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].foley = $scope.foley[i].foley;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].foley = 0;
                }

                if ($scope.et.length > 0) {
                    for (var i = 0; i < $scope.et.length; i++) {
                        $scope.dayinmonth[j].et = 0;
                        if ($scope.et[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].et = $scope.et[i].et;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].et = 0;
                }
                if ($scope.wound.length > 0) {
                    for (var i = 0; i < $scope.wound.length; i++) {
                        $scope.dayinmonth[j].wound = 0;
                        if ($scope.wound[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].wound = $scope.wound[i].wound;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].wound = 0;
                }

                if ($scope.bedsore.length > 0) {
                    for (var i = 0; i < $scope.bedsore.length; i++) {
                        $scope.dayinmonth[j].bedsore = 0;
                        if ($scope.bedsore[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].bedsore = $scope.bedsore[i].bedsore;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].bedsore = 0;
                }
                if ($scope.drain.length > 0) {
                    for (var i = 0; i < $scope.drain.length; i++) {
                        $scope.dayinmonth[j].drain = 0;
                        if ($scope.drain[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].drain = $scope.drain[i].drain;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].drain = 0;
                }

                if ($scope.isolation1.length > 0) {
                    for (var i = 0; i < $scope.isolation1.length; i++) {
                        $scope.dayinmonth[j].isolation1 = 0;
                        if ($scope.isolation1[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation1 = $scope.isolation1[i].isolation;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].isolation1 = 0;
                }

                if ($scope.isolation2.length > 0) {
                    for (var i = 0; i < $scope.isolation2.length; i++) {
                        $scope.dayinmonth[j].isolation2 = 0;
                        if ($scope.isolation2[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation2 = $scope.isolation2[i].isolation;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].isolation2 = 0;
                }

                if ($scope.isolation3.length > 0) {
                    for (var i = 0; i < $scope.isolation3.length; i++) {
                        $scope.dayinmonth[j].isolation3 = 0;
                        if ($scope.isolation3[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation3 = $scope.isolation3[i].isolation;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].isolation3 = 0;
                }

                if ($scope.isolation4.length > 0) {
                    for (var i = 0; i < $scope.isolation4.length; i++) {
                        $scope.dayinmonth[j].isolation4 = 0;
                        if ($scope.isolation4[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation4 = $scope.isolation4[i].isolation;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].isolation4 = 0;
                }

                if ($scope.isolation5.length > 0) {
                    for (var i = 0; i < $scope.isolation5.length; i++) {
                        $scope.dayinmonth[j].isolation5 = 0;
                        if ($scope.isolation5[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation5 = $scope.isolation5[i].isolation;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].isolation5 = 0;
                }

                //classification
                if ($scope.classification1.length > 0) {
                    for (var i = 0; i < $scope.classification1.length; i++) {
                        $scope.dayinmonth[j].classification1 = 0;
                        if ($scope.classification1[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].classification1 = $scope.classification1[i].class_score;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].classification1 = 0;
                }

                if ($scope.classification2.length > 0) {
                    for (var i = 0; i < $scope.classification2.length; i++) {
                        $scope.dayinmonth[j].classification2 = 0;
                        if ($scope.classification2[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].classification2 = $scope.classification2[i].class_score;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].classification2 = 0;
                }

                if ($scope.classification3.length > 0) {
                    for (var i = 0; i < $scope.classification3.length; i++) {
                        $scope.dayinmonth[j].classification3 = 0;
                        if ($scope.classification3[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].classification3 = $scope.classification3[i].class_score;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].classification3 = 0;
                }

                if ($scope.classification4.length > 0) {
                    for (var i = 0; i < $scope.classification4.length; i++) {
                        $scope.dayinmonth[j].classification4 = 0;
                        if ($scope.classification4[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].classification4 = $scope.classification4[i].class_score;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].classification4 = 0;
                }

                if ($scope.classification5.length > 0) {
                    for (var i = 0; i < $scope.classification5.length; i++) {
                        $scope.dayinmonth[j].classification5 = 0;
                        if ($scope.classification5[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].classification5 = $scope.classification5[i].class_score;
                            break;
                        }
                    }
                } else {
                    $scope.dayinmonth[j].classification5 = 0;
                }
            }
            console.log('$scope.dayinmonth');
            console.log($scope.dayinmonth);
            $scope.img_waiting = false;
            group_daily4();
            // show_4();
        })
    }
    function show_daily4() {
        $scope.show_table4 = true;
        $scope.show_table42 = false;
    }
    function show_all4() {
        $scope.show_table4 = false;
        $scope.show_table42 = true;
    }
    function group_daily4() {
        var fall = 0;
        var ivf = 0;
        var aline = 0;
        var cline = 0;
        var heplock = 0;
        var foley = 0;
        var et = 0;
        var wound = 0;
        var bedsore = 0;
        var drain = 0;
        var isolation1 = 0;
        var isolation2 = 0;
        var isolation3 = 0;
        var isolation4 = 0;
        var isolation5 = 0;
        for (var j = 0; j < $scope.dayinmonth.length; j++) {
            fall = fall + $scope.dayinmonth[j].fall;
            ivf = ivf + $scope.dayinmonth[j].ivf;
            aline = aline + $scope.dayinmonth[j].aline;
            cline = cline + $scope.dayinmonth[j].cline;
            heplock = heplock + $scope.dayinmonth[j].heplock;
            foley = foley + $scope.dayinmonth[j].foley;
            et = et + $scope.dayinmonth[j].et;
            wound = wound + $scope.dayinmonth[j].wound;
            bedsore = bedsore + $scope.dayinmonth[j].bedsore;
            drain = drain + $scope.dayinmonth[j].drain;
            isolation1 = isolation1 + $scope.dayinmonth[j].isolation1;
            isolation2 = isolation2 + $scope.dayinmonth[j].isolation2;
            isolation3 = isolation3 + $scope.dayinmonth[j].isolation3;
            isolation4 = isolation4 + $scope.dayinmonth[j].isolation4;
            isolation5 = isolation5 + $scope.dayinmonth[j].isolation5;

        }
        $scope.gdayinmonth = $scope.dayinmonth;
        $scope.gdayinmonth.push({
            date: 'sum',
            fall: fall,
            ivf: ivf,
            aline: aline,
            cline: cline,
            heplock: heplock,
            foley: foley,
            et: et,
            wound: wound,
            bedsore: bedsore,
            drain: drain,
            isolation1: isolation1,
            isolation2: isolation2,
            isolation3: isolation3,
            isolation4: isolation4,
            isolation5: isolation5,
        });
        console.log('$scope.gdayinmonth');
        console.log($scope.gdayinmonth);
        // $scope.$apply();
        $scope.show_table4=true;
    }

    //-----------------------------------------report1
    function selectdata(date, timex) {

        var x = JSON.parse(timex);
        $scope.timeact = x.timeactID;
        for (var j = 0; j < $scope.nursetimes.length; j++) {
            if ($scope.nursetimes[j].timeactID == $scope.timeact) {
                var mnext = $scope.nursetimes[j].nextdate;
                var mtfrom = $scope.nursetimes[j].tfrom;
                var mtto = $scope.nursetimes[j].tto;
                break
            }
        }
        console.log($scope.timeact);
        $scope.titledate = moment(date).format("DD/MM/YYYY");
        var d1 = moment(date).format("YYYY-MM-DD") + mtfrom;
        if (mnext == 'Y') {
            var d2 = moment(date).add(1, 'days').format("YYYY-MM-DD") + mtto;
        } else {
            var d2 = moment(date).format("YYYY-MM-DD") + mtto;
        }

        $http.post('/maindata/getpatientbytime', {
            date1: d1,
            date2: d2,
            ward: $scope.ward,
            orguid: $scope.orguid,
            timeact: $scope.timeact,
        }).success(function (data) {
            if (data && data.maindata.length > 0) {


                $scope.alldata = data.maindata;
                $scope.details = data.maindata[0];
                // $scope.req_hr = data[0].requirehour;
                console.log('$scope.alldata');
                console.log($scope.alldata);
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
                console.log($scope.requirehour);
                if ($scope.timeact == '1') {
                    $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.morning) / 100;
                } else if ($scope.timeact == '2') {
                    $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.evening) / 100;
                } else if ($scope.timeact == '3') {
                    $scope.requirehour = $scope.requirehour100 * parseFloat($scope.formular.night) / 100;
                } else {
                }
                console.log($scope.requirehour);
                //หา staff hour
                $http.post('/nurse_onduty/getstaffhour', {
                    date: moment(date).format("DD/MM/YYYY"),
                    timeact: $scope.timeact,
                    ward: $scope.ward,
                    orguid: $scope.orguid
                }).success(function (data) {
                    if (data && data.nurse_onduty.length > 0) {
                        $scope.staffs = data.nurse_onduty[0];
                        // console.log('$scope.staffs');
                        // console.log($scope.staffs);
                        $scope.staffs.HOD = parseInt($scope.staffs.HOD) || 0;
                        $scope.staffs.PN = parseInt($scope.staffs.PN) || 0;
                        $scope.staffs.RN = parseInt($scope.staffs.RN) || 0;
                        $scope.actualstaffhour = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN) * parseFloat($scope.formular.staffhour);
                        $scope.actualtotalstaff = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN);

                        $scope.require_total_Staff = $scope.requirehour / parseFloat($scope.formular.staffhour);
                        $scope.require_RN = $scope.require_total_Staff * $scope.formular.RN / 100;
                        $scope.require_PN = $scope.require_total_Staff * $scope.formular.PN / 100;
                        console.log('$scope.staffs');
                        console.log($scope.staffs);

                        if ($scope.orguid == "59e865c8ab5f11532bab0537") {   //psuv มี 2 กะ
                            if ($scope.timeact == '1') {
                                $scope.next_requirehour = $scope.requirehour100 * parseFloat($scope.formular.evening) / 100;
                            } else if ($scope.timeact == '2') {
                                $scope.next_requirehour = $scope.requirehour100 * parseFloat($scope.formular.morning) / 100;
                            } else {
                            }

                        } else {
                            // next shift
                            if ($scope.timeact == '1') {
                                $scope.next_requirehour = $scope.requirehour100 * parseFloat($scope.formular.evening) / 100;
                            } else if ($scope.timeact == '2') {
                                $scope.next_requirehour = $scope.requirehour100 * parseFloat($scope.formular.night) / 100;
                            } else if ($scope.timeact == '3') {
                                $scope.next_requirehour = $scope.requirehour100 * parseFloat($scope.formular.morning) / 100;
                            } else {
                            }
                        }



                    }
                });
                $scope.show_selectdate = true;
            } else {
                $scope.show_selectdate = false;
            }

        })
    }
    function calnextshift(RN, PN, reH, staffworkinghour) {
        return reH / ((parseInt(RN) + parseInt(PN)) * staffworkinghour);
    }
    //------------------------------------------------------- report2
    function daily01(dtp, type) {

        //ข้อมูลตามช่วงเวลา
        $http.post('/maindata/getpatientbyrange', {
            fromdate: moment(dtp).utc().startOf('month').toISOString(),
            todate: moment(dtp).utc().endOf('month').toISOString(),
            ward: $scope.ward,
            orguid: $scope.orguid
        }).success(function (data) {
            $scope.alldata = data.maindata;
            console.log('$scope.alldata');
            console.log($scope.alldata);
            //วนลูป คำนวน reqHr
            for (var i = 0; i < $scope.alldata.length; i++) {
                if ($scope.alldata[i]._id.timeact == '1') {
                    $scope.alldata[i].timethai = $scope.t1;
                    $scope.alldata[i].reqHr = ($scope.alldata[i].reqHr * $scope.m / 100);
                } else if ($scope.alldata[i]._id.timeact == '2') {
                    $scope.alldata[i].timethai = $scope.t2;
                    $scope.alldata[i].reqHr = ($scope.alldata[i].reqHr * $scope.e / 100);
                } else if ($scope.alldata[i]._id.timeact == '3') {
                    $scope.alldata[i].timethai = $scope.t3;
                    $scope.alldata[i].reqHr = ($scope.alldata[i].reqHr * $scope.n / 100);
                } else {
                }

            }


            // หาเวลา staff
            $http.post('/nurse_onduty/getstaffbyrange', {
                fromdate: moment(dtp).utc().startOf('month').toISOString(),
                todate: moment(dtp).utc().endOf('month').toISOString(),
                ward: $scope.ward,
                orguid: $scope.orguid
            }).success(function (data) {

                $scope.staffdata = data.nurse_onduty;
                console.log('$scope.staffdata');
                console.log($scope.staffdata);
                for (var i = 0; i < $scope.alldata.length; i++) {
                    var mdate = $scope.alldata[i]._id.date;
                    var mtimeact = $scope.alldata[i]._id.timeact;
                    var mreqHr = $scope.alldata[i].reqHr;

                    // var dd =  mdate.substring(0,2);
                    // var mm =  mdate.substring(3,5);
                    // var yy =  mdate.substring(6,10);
                    // $scope.alldata[i].newdate = new Date(mm+'/'+dd+'/'+yy);
                    $scope.alldata[i].date = mdate;
                    for (var j = 0; j < $scope.staffdata.length; j++) {
                        if (($scope.staffdata[j].date === mdate) && ($scope.staffdata[j].timeactID === mtimeact)) {
                            var staffHr = $scope.staffdata[j].ward.staffhour;
                            var mHOD = ($scope.staffdata[j].HOD || 0);
                            var mRN = ($scope.staffdata[j].RN || 0);
                            var mPN = ($scope.staffdata[j].PN || 0);
                            var mRNratio = $scope.staffdata[j].ward.RN;
                            var mPNratio = $scope.staffdata[j].ward.PN;
                            $scope.alldata[i].staffHr = staffHr * (mHOD + mRN + mPN);
                            $scope.alldata[i].reqStaff = mreqHr / staffHr;
                            $scope.alldata[i].RN = ($scope.staffdata[j].RN || 0);
                            $scope.alldata[i].PN = ($scope.staffdata[j].PN || 0);
                            $scope.alldata[i].HOD = ($scope.staffdata[j].HOD || 0);
                            $scope.alldata[i].reRN = (mreqHr / staffHr) * (mRNratio / 100);
                            $scope.alldata[i].rePN = (mreqHr / staffHr) * (mPNratio / 100);
                            $scope.alldata[i].time = $scope.staffdata[j].time;
                            if ($scope.alldata[i].staffHr > 0 && $scope.alldata[i].reqHr > 0) {
                                $scope.alldata[i].pro = ($scope.alldata[i].reqHr / $scope.alldata[i].staffHr) * 100;
                            } else {
                                $scope.alldata[i].pro = 0;
                            }
                        }
                    }

                }
                //เป็น ข้อมูลแต่ละเวร
                $scope.showdata = $scope.alldata;
                // $scope.show_report2 = true;
                console.log('$scope.showdata');
                console.log($scope.showdata);
                // group ข้อมูลตามวัน
                sumdaily(type)
            })
        })

    }
    function daily02(dtp, type) {
        // หาภาพรวม productivity ทุก site
        console.log(dtp);
        async.waterfall([

            function Step2(callback) {

                $http.post('/local_host/getpatientwardbytime', {
                    date1: moment(dtp).utc().startOf('month').toISOString(),
                    date2: moment(dtp).utc().endOf('month').toISOString(),
                    ward: $scope.ward,
                    orguid: $scope.orguid
                }).success(function (data) {

                    $scope.all_data = data.data;

                    for (var i = 0; i < $scope.all_data.length; i++) {
                        $scope.all_data[i].census = 1;
                        $scope.all_data[i].ndate = moment($scope.all_data[i].datecreate).format("DD/MM/YYYY");
                        $scope.all_data[i].gr = moment($scope.all_data[i].datecreate).format("YYMMDD") + $scope.all_data[i].timeact + $scope.all_data[i].ward;
                        for (var j = 0; j < $scope.warddesc.length; j++) {
                            if ($scope.warddesc[j].Ward == $scope.all_data[i].ward) {
                                if ($scope.all_data[i].class_score == 1) {
                                    $scope.all_data[i].req_hr = $scope.warddesc[j].level1;
                                    if ($scope.all_data[i].timeact == "1") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level1 * ($scope.warddesc[j].morning / 100);
                                    } else if ($scope.all_data[i].timeact == "2") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level1 * ($scope.warddesc[j].evening / 100);
                                    } else if ($scope.all_data[i].timeact == "3") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level1 * ($scope.warddesc[j].night / 100);
                                    } else {
                                    }

                                } else if ($scope.all_data[i].class_score == 2) {
                                    $scope.all_data[i].req_hr = $scope.warddesc[j].level2;
                                    if ($scope.all_data[i].timeact == "1") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level2 * ($scope.warddesc[j].morning / 100);
                                    } else if ($scope.all_data[i].timeact == "2") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level2 * ($scope.warddesc[j].evening / 100);
                                    } else if ($scope.all_data[i].timeact == "3") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level2 * ($scope.warddesc[j].night / 100);
                                    } else {
                                    }
                                } else if ($scope.all_data[i].class_score == 3) {
                                    $scope.all_data[i].req_hr = $scope.warddesc[j].level3;
                                    if ($scope.all_data[i].timeact == "1") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level3 * ($scope.warddesc[j].morning / 100);
                                    } else if ($scope.all_data[i].timeact == "2") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level3 * ($scope.warddesc[j].evening / 100);
                                    } else if ($scope.all_data[i].timeact == "3") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level3 * ($scope.warddesc[j].night / 100);
                                    } else {
                                    }
                                } else if ($scope.all_data[i].class_score == 4) {
                                    $scope.all_data[i].req_hr = $scope.warddesc[j].level4;
                                    if ($scope.all_data[i].timeact == "1") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level4 * ($scope.warddesc[j].morning / 100);
                                    } else if ($scope.all_data[i].timeact == "2") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level4 * ($scope.warddesc[j].evening / 100);
                                    } else if ($scope.all_data[i].timeact == "3") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level4 * ($scope.warddesc[j].night / 100);
                                    } else {
                                    }
                                } else if ($scope.all_data[i].class_score == 5) {
                                    $scope.all_data[i].req_hr = $scope.warddesc[j].level5;
                                    if ($scope.all_data[i].timeact == "1") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level5 * ($scope.warddesc[j].morning / 100);
                                    } else if ($scope.all_data[i].timeact == "2") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level5 * ($scope.warddesc[j].evening / 100);
                                    } else if ($scope.all_data[i].timeact == "3") {
                                        $scope.all_data[i].req_hrc = $scope.warddesc[j].level5 * ($scope.warddesc[j].night / 100);
                                    } else {
                                    }
                                } else {
                                    $scope.all_data[i].req_hr = 0;
                                    $scope.all_data[i].req_hrc = 0;
                                }

                            }

                        }

                    }
                    console.log('$scope.all_data');
                    console.log($scope.all_data);

                    $scope.all_data_group = _.groupBy($scope.all_data, function (dresult) {
                        return dresult.gr;
                    });
                    console.log('$scope.all_data_group');
                    console.log($scope.all_data_group);
                    $scope.dailyresult = [];
                    if ($scope.all_data_group) {
                        Object.keys($scope.all_data_group).forEach((key) => {
                            var sumreq_hrc = $scope.all_data_group[key].map((item) => item.req_hrc || 0).reduce((a, b) => a + b);
                            var mcensus = $scope.all_data_group[key].map((item) => item.census || 0).reduce((a, b) => a + b);
                            var mdate = $scope.all_data_group[key].map((item) => item.ndate).reduce((a, b) => a);
                            var mtime = $scope.all_data_group[key].map((item) => item.timeact).reduce((a, b) => a);
                            var mward = $scope.all_data_group[key].map((item) => item.ward).reduce((a, b) => a);
                            $scope.dailyresult.push({
                                gr: key,
                                ndate: mdate,
                                ntime: mtime,
                                ward: mward,
                                census: mcensus,
                                req_hrc: sumreq_hrc
                            });
                        });
                        // console.log('$scope.dailyresult');
                        // console.log($scope.dailyresult);
                    }


                    callback();
                })
            },
            function Step3(callback) {


                $http.post('/local_host/getstaffwardbyrange', {
                    date1: moment(dtp).utc().startOf('month').toISOString(),
                    date2: moment(dtp).utc().endOf('month').toISOString(),
                    orguid: $scope.orguid,
                    ward: $scope.ward,
                }).success(function (data) {

                    $scope.staffdata = data.data;
                    console.log('$scope.staffdata');
                    console.log($scope.staffdata);
                    for (var i = 0; i < $scope.dailyresult.length; i++) {
                        var mdate = $scope.dailyresult[i].ndate;
                        var mtimeact = $scope.dailyresult[i].ntime;
                        var mreq_hrc = $scope.dailyresult[i].req_hrc;

                        for (var j = 0; j < $scope.staffdata.length; j++) {
                            if (($scope.staffdata[j].date == mdate) && ($scope.staffdata[j].timeactID == mtimeact)) {
                                var staffHr = (parseFloat($scope.staffdata[j].ward.staffhour) || 0);
                                var mHOD = ($scope.staffdata[j].HOD || 0);
                                var mRN = ($scope.staffdata[j].RN || 0);
                                var mPN = ($scope.staffdata[j].PN || 0);
                                var allstaff = mHOD + mRN + mPN;
                                // var mRNratio = $scope.staffdata[j].ward.RN;
                                // var mPNratio = $scope.staffdata[j].ward.PN;
                                $scope.dailyresult[i].staffHr = staffHr * allstaff;
                                // $scope.dailyresult[i].reqStaff = mreq_hrc / staffHr;
                                // $scope.dailyresult[i].RN = ($scope.staffdata[j].RN || 0);
                                // $scope.dailyresult[i].PN = ($scope.staffdata[j].PN || 0);
                                // $scope.dailyresult[i].HOD = ($scope.staffdata[j].HOD || 0);
                                // $scope.dailyresult[i].reRN = (mreq_hrc / staffHr) * (mRNratio / 100);
                                // $scope.dailyresult[i].rePN = (mreq_hrc / staffHr) * (mPNratio / 100);
                                $scope.dailyresult[i].time = $scope.staffdata[j].time;
                                // $scope.dailyresult[i].pro = (mreq_hrc / staffHr) * 100;
                                $scope.dailyresult[i].pro = ($scope.dailyresult[i].req_hrc / $scope.dailyresult[i].staffHr) * 100;
                                break;
                            }
                        }

                    }

                })
                callback();
            },
            function Step4(callback) {
                $scope.showdata = $scope.dailyresult;
                console.log('$scope.dailyresult');
                console.log($scope.dailyresult);



                callback();
            }
        ],
            function (err) {
                if (err) {
                    throw new Error(err);
                } else {
                    sumdaily(type, $scope.dailyresult);
                    console.log('No error happened in any steps, operation done!');
                    // closeallreport();
                    $scope.p2 = true;
                }
            });


    }
    function createtemplate(mdate) {
        $scope.templatetable = [];
        // $http.post('centrix/getwardbyorg', {
        //     orguid: $scope.orguid
        // }).success(function (data) {
        //     $scope.wards = data.wards;
        // console.log('$scope.wards');
        // console.log($scope.wards);
        // var data = $scope.wards;
        $scope.templatetable = [{ ward: $scope.ward }];
        console.log($scope.templatetable);
        // for (i = 0; i < data.length; i++) {

        //     $scope.templatetable.push({
        //         ward: data[i].name,
        //     });

        // }
        // console.log('$scope.templatetable');
        // console.log($scope.templatetable);

        var mlength = moment(mdate).endOf('month').format('DD');
        // var mmyy = moment(dmy).format('/MM/YYYY');
        console.log(mlength);

        for (var i = 0; i < $scope.templatetable.length; i++) {
            $scope.templatetable[i].d01 = 0;
            $scope.templatetable[i].d02 = 0;
            $scope.templatetable[i].d03 = 0;
            $scope.templatetable[i].d04 = 0;
            $scope.templatetable[i].d05 = 0;
            $scope.templatetable[i].d06 = 0;
            $scope.templatetable[i].d07 = 0;
            $scope.templatetable[i].d08 = 0;
            $scope.templatetable[i].d09 = 0;
            $scope.templatetable[i].d10 = 0;
            $scope.templatetable[i].d11 = 0;
            $scope.templatetable[i].d12 = 0;
            $scope.templatetable[i].d13 = 0;
            $scope.templatetable[i].d14 = 0;
            $scope.templatetable[i].d15 = 0;
            $scope.templatetable[i].d16 = 0;
            $scope.templatetable[i].d17 = 0;
            $scope.templatetable[i].d18 = 0;
            $scope.templatetable[i].d19 = 0;
            $scope.templatetable[i].d20 = 0;
            $scope.templatetable[i].d21 = 0;
            $scope.templatetable[i].d22 = 0;
            $scope.templatetable[i].d23 = 0;
            $scope.templatetable[i].d24 = 0;
            $scope.templatetable[i].d25 = 0;
            $scope.templatetable[i].d26 = 0;
            $scope.templatetable[i].d27 = 0;
            $scope.templatetable[i].d28 = 0;
          
            if (mlength == 30) {
                $scope.templatetable[i].d29 = 0;
                $scope.templatetable[i].d30 = 0;
            } else if (mlength == 31) {
                $scope.templatetable[i].d29 = 0;
                $scope.templatetable[i].d30 = 0;
                $scope.templatetable[i].d31 = 0;
            }
        }
        // console.log('$scope.templatetable');
        // console.log($scope.templatetable);
        // })
    }
    function daily(dtp) {

        var a = moment(dtp).utc().startOf('month');
        var b = moment(dtp).utc();
        // var b = moment(dtp).utc().endOf('month');
        var c = b.diff(a, 'days') + 1;
        // console.log(c);
        // var c = 2;
        $scope.show_waiting_img = true;

        $http.post('/local_host/listtimeact', {
            orguid: $scope.orguid
        }).success(function (data) {

            $scope.nursetimes = data.nurse_time;

            console.log('$scope.nursetimes');
            console.log($scope.nursetimes);

            $scope.dataall = [];
            $scope.showresult = [];
            $scope.show_waiting_img = true;
            async.timesSeries(c, function (i, next) {
                // console.log(i);
                // $scope.sh = i;
                var mdatex = moment(a).add(i, 'days');
                var mdate = mdatex._d;
                console.log(mdate);

                findproducdaily(mdate, next);

            }, function () {
                // closeall()
                chart1($scope.showresult);;
                $scope.show_waiting_img = false;
                $scope.p3 = true;
            });
        });

    }
    function findproducdaily(mdate, callback) {
        // var res1 = [];

        async.eachOfSeries($scope.nursetimes, function (episode, index, callback2) {
            if (episode) {

                var mnext = episode.nextdate;
                var mtfrom = episode.tfrom;
                var mtto = episode.tto;
                var d1 = moment(mdate).format("YYYY-MM-DD") + mtfrom;
                if (mnext == 'Y') {
                    var d2 = moment(mdate).add(1, 'days').format("YYYY-MM-DD") + mtto;
                } else {
                    var d2 = moment(mdate).format("YYYY-MM-DD") + mtto;
                }

                // console.log(d1);
                // console.log(d2);
                async.waterfall([
                    function get1(callback) {
                        $scope.showdataeach = [];
                        $http.post('/local_host/getpatientwardbytime', {
                            // $http.post('/local_host/getpatientbyrangeall_01', {
                            date1: d1,
                            date2: d2,
                            ward: $scope.ward,
                            orguid: $scope.orguid
                        }).success(function (data) {

                            $scope.showdataeach = data.data;
                            // if ($scope.sh==1) {
                            console.log('$scope.showdataeach');
                            console.log($scope.showdataeach);
                            // }

                            callback();
                        })

                    },
                    function get2(callback) {
                        $scope.staffdata = [];

                        $http.post('/local_host/getstaffwardbyrange', {
                            date1: d1,
                            date2: d2,
                            orguid: $scope.orguid,
                            ward: $scope.ward,
                        }).success(function (data) {

                            $scope.staffdata = data.data;
                            // if ($scope.sh==1) {
                            console.log('$scope.staffdata');
                            console.log($scope.staffdata);
                            // }

                            callback();
                        })


                    },
                    function get3(callback) {
                        if ($scope.showdataeach && $scope.showdataeach.length > 0) {
                            if ($scope.staffdata && $scope.staffdata.length > 0) {
                                mreqHr = $scope.showdataeach[0].reqHr;
                                mstaffHr = (($scope.staffdata[0].PN || 0) + ($scope.staffdata[0].RN || 0)) * ($scope.staffdata[0].ward.staffhour);
                                mratio = ($scope.showdataeach[0]._id.ratio);
                                $scope.showdataeach[0].product = (mreqHr / mstaffHr) * mratio;
                                $scope.showdataeach[0].count = 1;
                                $scope.showdataeach[0].reqstaff = mstaffHr;
                                $scope.showdataeach[0].time = $scope.staffdata[0].time;
                                $scope.showdataeach[0].staff = (($scope.staffdata[0].PN || 0) + ($scope.staffdata[0].RN || 0));
                                //   } else {
                                //     $scope.showdataeach[0].product =0;
                                //     $scope.showdataeach[0].count = 0;
                            }
                        }

                        callback();

                    },
                    function get4(callback) {

                        var res1 = [];
                        if ($scope.showdataeach && $scope.showdataeach.length > 0) {

                            for (var j = 0; j < $scope.showdataeach.length; j++) {
                                res1.push({
                                    // date: ($scope.showdataeach[j]._id.date).substring(0, 2),
                                    date: $scope.showdataeach[j]._id.date,
                                    ward: $scope.showdataeach[j]._id.ward,
                                    product: $scope.showdataeach[j].product,
                                    census: $scope.showdataeach[j].census,
                                    time: $scope.showdataeach[j].time,
                                    staff: $scope.showdataeach[j].staff,
                                    staffHr: $scope.showdataeach[j].reqstaff,
                                    req_hrc: $scope.showdataeach[j].reqHr,

                                })
                            }
                            console.log('res1');
                            console.log(res1);
                            $scope.dataall = $scope.dataall.concat(res1);

                        }
                        callback();

                    },

                ], function () {
                    callback2();

                })
            } else {
                callback2();
            }

        }, function () {
            console.log('$scope.dataall');
            console.log($scope.dataall);

            // if ($scope.dataall && $scope.dataall.length > 0) {


            //     var datas = [];
            //     datas = $scope.dataall.filter(function (item) { return item.count != 0; });
            //     if ($scope.sh==1) {
            //         console.log('datas');
            //         console.log(datas);
            //     }

            //     //     // var mday = 'd' + datas[0].date;
            //     //     // console.log(mdate);
            //     var fdate = moment(mdate).format("DD/MM/YYYY");
            //     mday = 'd' + fdate.split("/", 1);
            //     var results = [];
            //     $scope.sumdaily = [];

            //     $scope.sumdaily = $filter('groupBy')(datas, 'ward');
            //     // console.log('$scope.sumdaily');
            //     // console.log($scope.sumdaily);
            //     Object.keys($scope.sumdaily).forEach((key) => {
            //         var mproduct = $scope.sumdaily[key].map((item) => item.product || 0).reduce((a, b) => a + b);
            //         var mcount = $scope.sumdaily[key].map((item) => item.count || 0).reduce((a, b) => a + b);

            //         results.push({
            //             ward: key,
            //             product:parseFloat((mproduct / mcount).toFixed(2)),
            //             count: mcount,
            //             date: fdate,
            //         });


            //     });


            //     // console.log('results');
            //     // console.log(results);
            //     $scope.showresult = $scope.showresult.concat(results);
            // }
            // if ($scope.sh==1) {
            //     console.log('$scope.showresult');
            //     console.log($scope.showresult);
            // }

            callback();

        });
    }
    function trend(dtp, type) {
        // function proallward(mdate1, mdate2) {
        // closeall();
        // createtemplate(dtp);
        // date1: moment(dtp).utc().startOf('month').toISOString(),
        // date2: moment(dtp).utc().endOf('month').toISOString(),
        var a = moment(dtp).utc().startOf('month');
        var b = moment(dtp).utc();
        // var b = moment(dtp).utc().endOf('month');
        var c = b.diff(a, 'days') + 1;
        // console.log(c);
        // var c = 2;
        $scope.show_waiting_img = true;

        $http.post('/local_host/listtimeact', {
            orguid: $scope.orguid
        }).success(function (data) {

            $scope.nursetimes = data.nurse_time;

            console.log('$scope.nursetimes');
            console.log($scope.nursetimes);

            // $scope.dataall = [];
            $scope.showresult = [];
            $scope.show_waiting_img = true;
            async.timesSeries(c, function (i, next) {
                console.log(i);
                $scope.sh = i;
                var mdatex = moment(a).add(i, 'days');
                var mdate = mdatex._d;
                console.log(mdate);

                findproduc(mdate, next);

            }, function () {
                // closeall()
                chart1($scope.showresult);;
                $scope.show_waiting_img = false;
                $scope.p3 = true;
            });
        });

    }
    function findproduc(mdate, callback) {
        // var res1 = [];
        $scope.dataall = [];
        async.eachOfSeries($scope.nursetimes, function (episode, index, callback2) {
            if (episode) {

                var mnext = episode.nextdate;
                var mtfrom = episode.tfrom;
                var mtto = episode.tto;
                var d1 = moment(mdate).format("YYYY-MM-DD") + mtfrom;
                if (mnext == 'Y') {
                    var d2 = moment(mdate).add(1, 'days').format("YYYY-MM-DD") + mtto;
                } else {
                    var d2 = moment(mdate).format("YYYY-MM-DD") + mtto;
                }

                // console.log(d1);
                // console.log(d2);
                async.waterfall([
                    function get1(callback) {
                        $scope.showdataeach = [];
                        $http.post('/local_host/getpatientwardbytime', {
                            // $http.post('/local_host/getpatientbyrangeall_01', {
                            date1: d1,
                            date2: d2,
                            ward: $scope.ward,
                            orguid: $scope.orguid
                        }).success(function (data) {

                            $scope.showdataeach = data.data;
                            if ($scope.sh == 1) {
                                console.log('$scope.showdataeach');
                                console.log($scope.showdataeach);
                            }

                            callback();
                        })

                    },
                    function get2(callback) {
                        $scope.staffdata = [];

                        $http.post('/local_host/getstaffwardbyrange', {
                            date1: d1,
                            date2: d2,
                            orguid: $scope.orguid,
                            ward: $scope.ward,
                        }).success(function (data) {

                            $scope.staffdata = data.data;
                            if ($scope.sh == 1) {
                                console.log('$scope.staffdata');
                                console.log($scope.staffdata);
                            }

                            callback();
                        })


                    },
                    function get3(callback) {
                        if ($scope.showdataeach && $scope.showdataeach.length > 0) {
                            if ($scope.staffdata && $scope.staffdata.length > 0) {
                                mreqHr = $scope.showdataeach[0].reqHr;
                                mstaffHr = (($scope.staffdata[0].PN || 0) + ($scope.staffdata[0].RN || 0)) * ($scope.staffdata[0].ward.staffhour);
                                mratio = ($scope.showdataeach[0]._id.ratio);
                                $scope.showdataeach[0].product = (mreqHr / mstaffHr) * mratio;
                                $scope.showdataeach[0].count = 1;
                                $scope.showdataeach[0].reqstaff = mstaffHr;
                                //   } else {
                                //     $scope.showdataeach[0].product =0;
                                //     $scope.showdataeach[0].count = 0;
                            }
                        }

                        callback();

                    },
                    function get4(callback) {

                        var res1 = [];
                        if ($scope.showdataeach && $scope.showdataeach.length > 0) {

                            for (var j = 0; j < $scope.showdataeach.length; j++) {
                                res1.push({
                                    date: ($scope.showdataeach[j]._id.date).substring(0, 2),
                                    ward: $scope.showdataeach[j]._id.ward,
                                    product: $scope.showdataeach[j].product,
                                    count: $scope.showdataeach[j].count,

                                })
                            }
                            // console.log('res1');
                            // console.log(res1);
                            $scope.dataall = $scope.dataall.concat(res1);

                        }
                        callback();

                    },

                ], function () {
                    callback2();

                })
            } else {
                callback2();
            }

        }, function () {
            // console.log('$scope.dataall');
            // console.log($scope.dataall);

            if ($scope.dataall && $scope.dataall.length > 0) {


                var datas = [];
                datas = $scope.dataall.filter(function (item) { return item.count != 0; });
                if ($scope.sh == 1) {
                    console.log('datas');
                    console.log(datas);
                }

                //     // var mday = 'd' + datas[0].date;
                //     // console.log(mdate);
                var fdate = moment(mdate).format("DD/MM/YYYY");
                mday = 'd' + fdate.split("/", 1);
                var results = [];
                $scope.sumdaily = [];

                $scope.sumdaily = $filter('groupBy')(datas, 'ward');
                // console.log('$scope.sumdaily');
                // console.log($scope.sumdaily);
                Object.keys($scope.sumdaily).forEach((key) => {
                    var mproduct = $scope.sumdaily[key].map((item) => item.product || 0).reduce((a, b) => a + b);
                    var mcount = $scope.sumdaily[key].map((item) => item.count || 0).reduce((a, b) => a + b);

                    results.push({
                        ward: key,
                        product: parseFloat((mproduct / mcount).toFixed(2)),
                        count: mcount,
                        date: fdate,
                    });


                });


                // console.log('results');
                // console.log(results);
                $scope.showresult = $scope.showresult.concat(results);
            }
            if ($scope.sh == 1) {
                console.log('$scope.showresult');
                console.log($scope.showresult);
            }

            callback();

        });
    }
    function sumdaily(type, data) {
        console.log(data);
        $scope.resultgroup = _.groupBy(data, function (nresult) {
            return nresult.ndate;
        });
        console.log('$scope.resultgroup');
        console.log($scope.resultgroup);
        $scope.chartresult = [];
        if ($scope.resultgroup) {
            Object.keys($scope.resultgroup).forEach((key) => {
                var req_hrc = $scope.resultgroup[key].reduce(function (a, b) { return a + b.req_hrc }, 0);
                var staffHr = $scope.resultgroup[key].reduce(function (a, b) { return a + b.staffHr }, 0);
                // var s1 = $scope.resultgroup[key].map((item) => item.staffHr || 0).reduce((a, b) => a + b.s1);
                // var s2 = $scope.resultgroup[key].map((item) => item.req_hrc || 0).reduce((a, b) => a + b.s2);


                $scope.chartresult.push({
                    date: key,
                    staff: staffHr,
                    pt: req_hrc,

                    // pro: (sumReqHr / sumstaffHr) * 100
                });
            });
            // for (var j = 0; j < $scope.chartresult.length; j++) {
            //     if ($scope.chartresult[j].req_hrc == 0 || $scope.chartresult[j].staffHr == 0) {
            //         $scope.chartresult[j].pro = 0;
            //     }
            //     $scope.chartresult[j].pro = parseFloat(Math.round($scope.chartresult[j].pro * 100) / 100).toFixed(2);
            // }
            // $scope.chartresult = $filter("orderBy")($scope.chartresult, "ndate");
            console.log('$scope.chartresult');
            console.log($scope.chartresult);

        }
        // if (type = "reporttrend") {

        //     chart1($scope.chartresult);
        // }
    }
    //-----------------------------------
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                //Now convert each value to string and comma-seprated
                row += index + ',';
            }

            row = row.slice(0, -1);

            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";

            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }

            row.slice(0, row.length - 1);

            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {
            alert("Invalid data");
            return;
        }

        //Generate a file name
        // var fileName = "MyReport_";
        var fileName = "";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");
        // fileName='kit';
        //Initialize file format you want csv or xls
        var uri = 'data:text/xls;charset=utf-8,' + escape(CSV);
        // downloadFile('1.csv', 'data:text/csv;charset=UTF-8,' + '\uFEFF' + encodeURIComponent(CSV));
        var uri = 'data:text/csv;charset=utf-8,' + '\uFEFF' + encodeURIComponent(CSV);
        // var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
        window.open(uri);
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        //this trick will generat
    }
    function json2xls(mfile) {
        if (mfile == 'dayinmonth') {
            var jsondata = {
                "headers": [
                    "date",
                    "isolation1", "isolation2", "isolation3", "isolation4", "isolation5",
                    "fall", "ivf", "aline", "cline", "heplock",
                    "foley", "et", "wound", "bedsore", "drain"
                ],
                "datas": $scope.dayinmonth
            };
            var data = btoa(JSON.stringify(jsondata));

            filename = "report1";
        } else {

        }
        window.location = 'http://203.154.49.150:8085/utility/xlsx/' + filename + '/' + data;

    }
    //------chart
    function chart1(result) {
        var categories = [];
        for (var j = 0; j < result.length; j++) {
            categories.push({
                period: result[j].date,
                pro: (parseFloat(result[j].product)),
                // cumu: (parseFloat(result[j].cumu)),
                // department: result[j]._id.department
                // planneddischargedate: moment(result[j].planneddischargedate).format('DD/MM/YYYY')
            })
        }
        // console.log(result);

        var chart = c3.generate({
            bindto: '#chart1',
            //  size: {
            //     height: 240,
            //     width: 480
            // },
            padding: {
                top: 10,
                right: 80,
                bottom: 10,
                left: 50,
            },
            data: {
                json: categories,

                keys: {
                    value: ['pro'],
                },
                labels: true,
                types: {
                    pro: 'area-spline',
                    // count: 'bar'
                },
                // fillColor: gradient
            },

            color: {
                pattern: ['#2ca9ba', 'url(#gradient)', '#B73540', '#B73540']
            },
            title: {
                text: 'Productivity trend'
            },
            legend: {
                show: false
            },

            axis: {
                x: {
                    type: 'category',
                    position: 'inner-center',
                    // json: categories,
                    // categories: ['period'],
                    categories: categories.map(function (cat) { return cat.period; }),
                    // show:false
                    // tick: {
                    // format: function (x) { return x.getFullYear(); }
                    //   format: '%D' // format string is also available for category data
                    // }
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                },
                y: {
                    max: 200,
                    min: 0,
                    // Range includes padding, set 0 if no padding needed
                    padding: { top: 0, bottom: 0 }
                }
            },
            regions: [
                // {axis: 'x', end: 1, class: 'regionX'},
                // {axis: 'x', start: 2, end: 4, class: 'regionX'},
                // {axis: 'x', start: 5, class: 'regionX'},
                { axis: 'y', end: 100, class: 'regionY' },
                // {axis: 'y', start: 80, end: 140, class: 'regionY'},
                // {axis: 'y', start: 400, class: 'regionY'},
                // {axis: 'y2', end: 900, class: 'regionY2'},
                // {axis: 'y2', start: 1150, end: 1250, class: 'regionY2'},
                // {axis: 'y2', start: 1300, class: 'regionY2'},
            ],



            oninit: function () {
                d3.select("svg defs").append("linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", 0)
                    .attr("x2", 0)
                    .attr("y1", 0)
                    .attr("y2", 1)
                    .html('<stop offset="0%" stop-color="blue" /><stop offset="100%" stop-color="cyan"/>')
                    ;
            },
        });
    };
})



