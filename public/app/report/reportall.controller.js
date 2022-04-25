var app = angular.module('myApp', ['ngMaterial', 'angular.filter']);
app.controller('reportallController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $filter) {
    $scope.selectdate = selectdate;
    $scope.refreshmenu = refreshmenu;
    $scope.report1 = report1;
    $scope.report2 = report2;
    $scope.show_period = show_period;
    $scope.show_reportall = true;
    $scope.choosesite = choosesite;
    $scope.show_daily = show_daily;
    $scope.report4 = report4;
    $scope.report5 = report5;
    $scope.timeact = 0;
    // $scope.ward = $location.search()['ward'];
    // --------------------------------------------
    $scope.init = init;
    $scope.selectdata = selectdata;
    // $scope.daily = daily;
    $scope.nextRN = 0;
    $scope.nextPN = 0;
    $scope.calnextshift = calnextshift;
    $scope.staffworkinghour = 0;
    $scope.nextproduct = 0;
    $scope.exitwindows = exitwindows;
    $scope.selectsite = selectsite;
    $scope.selectrepall = selectrepall;
    $scope.show_dailyall = show_dailyall;
    // $scope.show_all4 = show_all4;
    $scope.JSONToCSVConvertor = JSONToCSVConvertor;
    $scope.json2xls = json2xls;
    $scope.group_dailyall = group_dailyall;
    $scope.show_menu = false;
    //----------------------------------------------
    var today = new Date();
    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();
    //     // angular
    //     //   .module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    //     //   .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
    // $scope.toggleLeft = buildToggler('left');
    // $scope.toggleRight = buildToggler('right');
    init();
    function exitwindows() {
        window.close();
    }
    // function buildToggler(componentId) {
    //     return function () {
    //         $mdSidenav(componentId).toggle();
    //     };
    // }
    // setTimeout(function () {
    //     $scope.toggleLeft();
    // }, 1000);
    function selectdate(dmy) {
        console.log(dmy);
        // $scope.toggleLeft();
        $scope.dmy = dmy;
    }
    function refreshmenu() {
        $scope.right = false;
        $scope.left = false;
        // $scope.toggleLeft();
    }
    function closeallreport() {
        $scope.show_report1 = false;
        $scope.show_report2 = false;
        $scope.show_report3 = false;
        $scope.show_report4 = false;
        $scope.show_report5 = false;
    }
    function report1() {
        closeallreport();
        $scope.show_report1 = true;
        $scope.mlabel = "report1";
    }
    function report2(choosedate) {
        closeallreport();
        $scope.show_report2 = true;
        $scope.mlabel = "report2";
        daily(choosedate);
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
    function choosesite(site) {
        $scope.show_menu = true;
        if (site == "PSUV") {
            $scope.orguid = "59e865c8ab5f11532bab0537";
            selectsite();
        } else if (site == "PCH") {
            $scope.orguid = "5ad9ac20c3e29ccd1dc35eb0";
            selectsite();
        } else if (site == "PNP") {
            $scope.orguid = "5b6187eca03e2340f130e6fb";
            selectsite();
        } else {
            $scope.orguid = "";
        }

    }
    //-------------------------------------------------------------------------------------------
    function init() {
        $scope.site = '';
    }
    function selectsite() {
        $http.post('/nurse_time/listtimeact', {
            orguid: $scope.orguid
        }).success(function (data) {

            $scope.nursetimes = data.nurse_time;
            $scope.timea = data.nurse_time;
            console.log('$scope.nursetimes');
            console.log($scope.nursetimes);
        });
        $http.post('/formular/listformular_org', {
            orguid: $scope.orguid
        }).success(function (data) {
            $scope.warddesc = data.formular;
            console.log('$scope.warddesc');
            console.log($scope.warddesc);


        });

    }
    //-------------------report4
    function selectrepall(ward, ID) {
        var dmy = $scope.dmy;
        $scope.ward = ward;
        async.waterfall([

            function getformular(callback) {
                $http({
                    method: "POST",
                    url: '/formular/findformular',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        "ward": $scope.ward
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
                    callback();
                });

            },

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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid, 
                    "orguid": $scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
                    "ward": $scope.ward,
                    "orguid":$scope.orguid,
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
        ], function (
        ) {
                for (var j = 0; j < $scope.dayinmonth.length; j++) {
                    for (var i = 0; i < $scope.fall.length; i++) {
                        if ($scope.fall[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].fall = $scope.fall[i].fall;
                        }
                    }
                    for (var i = 0; i < $scope.ivf.length; i++) {
                        if ($scope.ivf[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].ivf = $scope.ivf[i].ivf;
                        }
                    }
                    for (var i = 0; i < $scope.aline.length; i++) {
                        if ($scope.aline[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].aline = $scope.aline[i].aline;
                        }
                    }
                    for (var i = 0; i < $scope.cline.length; i++) {
                        if ($scope.cline[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].cline = $scope.cline[i].cline;
                        }
                    }
                    for (var i = 0; i < $scope.heplock.length; i++) {
                        if ($scope.heplock[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].heplock = $scope.heplock[i].heplock;
                        }
                    }
                    for (var i = 0; i < $scope.foley.length; i++) {
                        if ($scope.foley[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].foley = $scope.foley[i].foley;
                        }
                    }
                    for (var i = 0; i < $scope.et.length; i++) {
                        if ($scope.et[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].et = $scope.et[i].et;
                        }
                    }
                    for (var i = 0; i < $scope.wound.length; i++) {
                        if ($scope.wound[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].wound = $scope.wound[i].wound;
                        }
                    }
                    for (var i = 0; i < $scope.bedsore.length; i++) {
                        if ($scope.bedsore[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].bedsore = $scope.bedsore[i].bedsore;
                        }
                    }
                    for (var i = 0; i < $scope.drain.length; i++) {
                        if ($scope.drain[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].drain = $scope.drain[i].drain;
                        }
                    }
                    for (var i = 0; i < $scope.isolation1.length; i++) {
                        if ($scope.isolation1[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation1 = $scope.isolation1[i].isolation;
                        }
                    }
                    for (var i = 0; i < $scope.isolation2.length; i++) {
                        if ($scope.isolation2[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation2 = $scope.isolation2[i].isolation;
                        }
                    }
                    for (var i = 0; i < $scope.isolation3.length; i++) {
                        if ($scope.isolation3[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation3 = $scope.isolation3[i].isolation;
                        }
                    }
                    for (var i = 0; i < $scope.isolation4.length; i++) {
                        if ($scope.isolation4[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation4 = $scope.isolation4[i].isolation;
                        }
                    }
                    for (var i = 0; i < $scope.isolation5.length; i++) {
                        if ($scope.isolation5[i]._id.date == $scope.dayinmonth[j].date) {
                            $scope.dayinmonth[j].isolation5 = $scope.isolation5[i].isolation;
                        }
                    }

                }

                console.log('$scope.dayinmonth');
                console.log($scope.dayinmonth);
                group_dailyall();
                show_dailyall();
            })
    }
    function show_dailyall() {
        $scope.show_table = true;
        //     $scope.show_table42 = false;
    }
    // function show_all4() {
    //     $scope.show_table4 = false;
    //     $scope.show_table42 = true;
    // }
    function group_dailyall() {
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

    }

    //-----------------------------------------
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

        var d1 = moment(date).format("YYYY-MM-DD") + mtfrom;
        if (mnext == 'Y') {
            var d2 = moment(date).add(1, 'days').format("YYYY-MM-DD") + mtto;
        } else {
            var d2 = moment(date).format("YYYY-MM-DD") + mtto;
        }

        $http.post('/maindata/getpatientbytime', {
            date1: d1,
            date2: d2,
            ward: $scope.ward
            // $http.post('/maindata/getpatient', {
            //     // $http.post('/maindata/getpatientbytime', {
            //     date: moment(day1).utc().format("DD/MM/YYYY"),
            //     timeact: timeact,
            //     ward: $scope.ward
        }).success(function (data) {
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
                date: moment(date).utc().format("DD/MM/YYYY"),
                timeact: $scope.timeact,
                ward: $scope.ward
            }).success(function (data) {
                if (data && data.nurse_onduty.length > 0) {
                    $scope.staffs = data.nurse_onduty[0];
                    // console.log('$scope.staffs');
                    // console.log($scope.staffs);
                    $scope.staffs.HOD = parseInt($scope.staffs.HOD) || 0;
                    $scope.staffs.PN = parseInt($scope.staffs.PN)|| 0;
                    $scope.staffs.RN = parseInt($scope.staffs.RN)|| 0;
                    $scope.actualstaffhour = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN) * parseFloat($scope.formular.staffhour);
                    $scope.actualtotalstaff = ($scope.staffs.HOD + $scope.staffs.PN + $scope.staffs.RN);

                    $scope.require_total_Staff = $scope.requirehour / parseFloat($scope.formular.staffhour);
                    $scope.require_RN = $scope.require_total_Staff * $scope.formular.RN / 100;
                    $scope.require_PN = $scope.require_total_Staff * $scope.formular.PN / 100;
                    console.log('$scope.staffs');
                    console.log($scope.staffs);


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
            });


        })
    }
    function calnextshift(RN, PN, reH, staffworkinghour) {
        return reH / ((parseInt(RN) + parseInt(PN)) * staffworkinghour);
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
})



