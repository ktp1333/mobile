(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMessages', 'angularMoment', 'angular.filter', 'angular-md5', 'onsen']);
    app.controller("emarController", function ($scope, $location, $http, $filter, $timeout, $window, $q) {

        // $scope.site = localStorage.getItem('site');
        // $scope.site = $location.search()['site'];
        // console.log($scope.site);
        var vm = this;
        vm.loginid = ''
        // $scope.datafile_user = 'user.json';
        $scope.datafile_time = 'time.json';
        $scope.entypeuidipd = "59ef351fd2bbe66c36f99862";
        $scope.patientonward = patientonward;
        $scope.getmed = getmed;
        $scope.chooseorg = chooseorg;
        $scope.chooseward = chooseward;
        $scope.gohome = gohome;
        $scope.login = login;
        $scope.showemarinj = showemarinj;
        init();

        function init() {
            $http.post('/centrix/find_status', {
                // "orguid": $scope.orguid,
            }).then(function (response) {
                console.log(response);
                $scope.status_q = response.data.data;
                console.log('status_q');
                console.log($scope.status_q);

            })

            // $http({
            //     method: "POST",
            //     url: 'local_json/readjson',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     data: JSON.stringify({
            //         "mfile": $scope.datafile_user,
            //     })
            // }).then(function (data) {
            //     $scope.alluser = data.data.data;
            //     console.log($scope.alluser);
            // });

            $http({
                method: "POST",
                url: 'local_json/readjson',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "mfile": $scope.datafile_time,
                })
            }).then(function (data) {
                $scope.uniqtime = data.data.data;
                console.log($scope.uniqtime);
            });
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
                            $scope.hospname ="test";
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
        function login1(loginid) {
            loginid = loginid.toLowerCase();
            console.log(loginid);

            $http.post('/centrix/find_user', {
                "loginid": loginid,
            }).then(function (response) {
                if (response && response.data.data.length > 0) {
                    console.log(response);
                    $scope.loginuser = response.data.data[0];
                    $scope.hospname = $scope.loginuser.defaultorguid.description;
                    $scope.orguid = $scope.loginuser.defaultorguid._id;
                    $scope.orgname = $scope.loginuser.defaultorguid;
                    // console.log('loginuser');
                    // console.log($scope.loginuser);
                    chooseorg($scope.orguid);
                } else {
                    mySplitter.content.load('login.html')

                }

            })
            // if (params == 'zz') {
            //     init();
            //     mySplitter.content.load('admin.html');
            //   } else {
            // for (var i = 0; i < $scope.alluser.length; i++) {
            //     if (pwd == $scope.alluser[i].loginid) {
            //         $http.post('/centrix/organize', {
            //         }).then(function (response) {

            //             if (response && response.data.data.length > 0) {
            //                 $scope.organize = response.data.data;
            //                 console.log($scope.organize);


            //             } else {
            //                 $scope.organize = [];
            //             }
            //         });
            //         mySplitter.content.load('organise.html');
            //         // mySplitter.content.load('ward.html');
            //     } else {

            //     }
            // }
            //   }
        }
        function chooseorg(params) {
            mySplitter.content.load('loading.html')
            console.log(params);

            $http.post('/centrix/getwardbyorg', {
                "orguid": params,
            }).then(function (response) {
                console.log(response);
                $scope.ward = response.data.data;
                console.log('ward');
                console.log($scope.ward);
            })

            mySplitter.content.load('ward.html')
        }
        function chooseward(params) {



            console.log($scope.hospname);
            $scope.wardname = params.name;
            console.log($scope.wardname);
            // console.log(params);
            patientonward(params._id)

            mySplitter.content.load('loading.html');
        }
        function patientonward(warduid) {
            $scope.patient = {};
            $scope.patient_order = {};
            $scope.emar_schedule = [];
            $scope.sumemar = [];

            $http.post('/centrix/emar_patientonward_byorg', {
                'orguid': $scope.orguid,
                'warduid': warduid,

            }).then(function (data) {
                if (data && data.data.data.length > 0) {
                    $scope.patient = data.data.data;
                    console.log('$scope.patient');
                    console.log($scope.patient);
                    $scope.wardname = $scope.patient[0].bedoccupancy.warduid.description;
                    async.eachOfSeries($scope.patient, function (episode, index, callback) {
                        if (episode) {
                            var mptname = episode.patientuid.firstname + ' ' + episode.patientuid.lastname;
                            getmed(episode._id, episode.bedoccupancy.beduid.name, episode.bedoccupancy.beduid._id, mptname, function () {

                                callback();
                            });
                        } else {
                            callback();
                        }


                    }, function () {
                        mySplitter.content.load('emar.html');

                    });



                } else {
                    $scope.utime = [];
                    $scope.utime_length = 0;
                    mySplitter.content.load('emar.html');
                }
                // formToggle();
            });

        }
        function getmed(ID, bed, beduid, ptname, callback) {
            var mdate = moment(new Date()).startOf('day').format();
            $http.post('/centrix/emar_med_byPTVUID', {
                'orguid': $scope.orguid,
                "patientvisituid": ID,
                "entypeuid": $scope.entypeuidipd,
                "fromdate": mdate,
                "beduid": beduid,
            }).then(function (data) {
                if (data && data.data.data.length > 0) {
                    $scope.patient_order = data.data.data;
                    console.log(ID);
                    console.log(bed);
                    console.log('$scope.patient_order');
                    console.log($scope.patient_order);

                    $scope.emar_detail = [];
                    for (var i = 0; i < $scope.patient_order.length; i++) {
                        var mbed = $scope.patient_order[i].beduid.name;
                        var mbeduid = $scope.patient_order[i].beduid._id;
                        var mname = $scope.patient_order[i].patientorderitems.orderitemname;
                        if ($scope.patient_order[i].patientorderitems.frequencyuid && $scope.patient_order[i].patientorderitems.frequencyuid.length > 0) {
                            var mdosage = $scope.patient_order[i].patientorderitems.frequencyuid[0].description;
                        } else {
                            var mdosage = '';
                        }

                        var mstatus = $scope.patient_order[i].patientorderitems.statusuid.valuedescription;
                        var mptname = $scope.patient_order[i].patientuid.firstname + ' ' + $scope.patient_order[i].patientuid.lastname;
                        if ($scope.patient_order[i].stockauditgroup && $scope.patient_order[i].stockauditgroup.valuedescription.length > 0) {
                            var mdrugtype = $scope.patient_order[i].stockauditgroup.valuedescription;
                        } else {
                            var mdrugtype = '';
                        }

                        if ($scope.patient_order[i].patientorderitems.frequencyuid && $scope.patient_order[i].patientorderitems.frequencyuid.length > 0) {
                            var mfrequency = $scope.patient_order[i].patientorderitems.frequencyuid[0].timings;
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
                                    drugtype: mdrugtype,
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
                    // console.log('$scope.emar_detail');
                    // console.log($scope.emar_detail);
                    var json1 = $scope.sumemar;
                    var json2 = $scope.emar_detail;

                    $scope.sumemar = json1.concat(json2);
                    console.log('$scope.sumemar');
                    console.log($scope.sumemar);
                    $scope.gutime = $filter('groupBy')($scope.sumemar, '[time]');
                    $scope.uutime = Object.entries($scope.gutime);
                    $scope.utime = $filter("orderBy")($scope.uutime, parseInt("time"));
                    console.log('$scope.utime');
                    console.log($scope.utime);
                    $scope.utime_length = $scope.utime.length;
                    callback();
                } else {
                    callback();
                }
            });
        }
        function showemarinj(params) {
            $scope.filtermed = params;
            mySplitter.content.load('emarinj.html')
            mySplitter.left.close();
        }
        function gohome() {
            init();
            $scope.show_case = $scope.casewait;
            mySplitter.left.close();
            mySplitter.content.load('emar.html');
        }
    });
})();