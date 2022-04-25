var app = angular.module('myApp', ['ngMaterial', 'ja.qr']);
app.controller('trackingController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, globalSetting) {

    var vm = this;
    // $scope.orguid = "59e865c8ab5f11532bab0537";
    // $scope.entypeuid = "59f2dd8ac4a1788835afd8c7";

    //-----------------------------------
    $scope.site = $location.search()['site'];
    console.log(globalSetting.checkOrg($scope.site));
    //----global-------------------
    $scope.orguid =globalSetting.checkOrg($scope.site);
    $scope.apiip = globalSetting.setting.apiip;
    $scope.apiip12 = globalSetting.setting.apiip12;
    $scope.ippub = globalSetting.setting.ippub;
    $scope.entypeuid = globalSetting.setting.entypeuid_opd;
    

    $scope.showjourney = showjourney;
    $scope.caltime = caltime;
    $scope.left = true;
    $scope.right = true;

    $scope.initdata = initdata;
    $scope.calduration = calduration;
    $scope.findbyEN = findbyEN;
    $scope.getAge = getAge;
    $scope.showdepart = showdepart;
    $scope.casewaiting = casewaiting;
    $scope.showall = showall;
    $scope.avgtime = avgtime;
    var today = new Date();
    $scope.dtp = {
        // value: new Date(today.getFullYear(), today.getMonth(), 1)
        value: today
    };
    $scope.dtp2 = {
        value: today
    };
    $scope.todaydate = new Date();
    moment.locale('th')
    $scope.todaymoment = moment(new Date()).format('LLLL') ;
    $scope.b1 = 'app/image/t_top_grey.png';
    $scope.b2 = 'app/image/t_mid_grey.png';
    $scope.b3 = 'app/image/t_mid_grey.png';
    $scope.b4 = 'app/image/t_mid_grey.png';
    $scope.b5 = 'app/image/t_mid_grey.png';
    $scope.b6 = 'app/image/t_mid_grey.png';
    $scope.b7 = 'app/image/t_mid_grey.png';
    $scope.b8 = 'app/image/t_mid_grey.png';
    $scope.b9 = 'app/image/t_mid_grey.png';
    $scope.b10 = 'app/image/t_bot_grey.png';

    // setInterval(() => {
    //     initdata();
    // }, 50000);

    initdata();
    function initdata() {
        $http.post('/centrix/find_status', {
            "orguid": $scope.orguid,
        }).success(function (response) {
            $scope.status_q = response.statusq;
            console.log('status_q');
            console.log($scope.status_q);
            $http.post('/centrix/tracking', {
                "entypeuid": $scope.entypeuid,
                "orguid": $scope.orguid,
                "fromdate": moment($scope.todaydate).startOf('day').format(),
                "todate": moment($scope.todaydate).endOf('day').format()
            }).success(function (response) {
                $scope.allcase = response.data;
                $scope.departcase = response.data;
                for (var j = 0; j < $scope.departcase.length; j++) {
                    $scope.departcase[j].a1_Registered = '';
                    $scope.departcase[j].a2_Arrived = '';
                    $scope.departcase[j].ax_Triaged = '';
                    $scope.departcase[j].a3_ScreeningCompleted = '';
                    $scope.departcase[j].a4_ConsultationStarted = '';
                    $scope.departcase[j].a5_ConsultationCompleted = '';
                    $scope.departcase[j].a6_UnderObservation = '';
                    $scope.departcase[j].a7_MedicalDischarge = '';
                    $scope.departcase[j].a8_BillingInprogress = '';
                    $scope.departcase[j].a9_BillFinalized = '';
                    $scope.departcase[j].a10_FinancialDischarge = '';
                }
                // console.log('$scope.departcase');
                // console.log($scope.departcase);
                for (var i = 0; i < $scope.departcase.length; i++) {
                    if ($scope.departcase[i].department) {
                        $scope.departcase[i].a_department = $scope.departcase[i].department[0].description;
                        // for (var ii = 0; ii < $scope.departcase[i].department.length; ii++) {
                        //     $scope.departcase[i].a_department = '';
                        //     if ($scope.departcase[i].department[ii].description) {
                        //         if (ii == 0) {
                        //             $scope.departcase[i].a_department = $scope.departcase[i].department[ii].description;
                        //         } else {
                        //             $scope.departcase[i].a_department = $scope.departcase[i].a_department + ',' + $scope.departcase[i].department[ii].description;
                        //         }
                        //     } else {
                        //         $scope.departcase[i].a_department = '';
                        //     }
                        // }
                    } else {
                        $scope.departcase[i].a_department = '';
                    }


                    for (var k = 0; k < $scope.departcase[i].visitjourneys.length; k++) {

                        if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae15") {
                            $scope.departcase[i].a1_Registered = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae16") {
                            $scope.departcase[i].a2_Arrived = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5a0ac84700d17a9459beab28") {
                            $scope.departcase[i].ax_Triaged = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae17") {
                            $scope.departcase[i].a3_ScreeningCompleted = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae18") {
                            $scope.departcase[i].a4_ConsultationStarted = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae19") {
                            $scope.departcase[i].a5_ConsultationCompleted = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "57c6712c4f362d6b9c5ef09e") {
                            $scope.departcase[i].a6_UnderObservation = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1b") {
                            $scope.departcase[i].a7_MedicalDischarge = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "57c4446aa454a0ba852ce690") {
                            $scope.departcase[i].a8_BillingInprogress = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1a") {
                            $scope.departcase[i].a9_BillFinalized = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1c") {
                            $scope.departcase[i].a10_FinancialDischarge = $scope.departcase[i].visitjourneys[k].modifiedat;
                        } else {
                        }
                    }
                    if ($scope.departcase[i].a10_FinancialDischarge == '') {
                        $scope.departcase[i].waiting = caltime('now',1, $scope.departcase[i].a1_Registered);
                    } else {
                        $scope.departcase[i].waiting = caltime('',1, $scope.departcase[i].a1_Registered, $scope.departcase[i].a10_FinancialDischarge);
                    }

                    $scope.departcase[i].waitingcolor = $scope.mcolor;
                    $scope.departcase[i].timewait = $scope.waitingminute;

                    $scope.departcase[i].w12 = caltime('',0, $scope.departcase[i].a1_Registered, $scope.departcase[i].a2_Arrived);
                    $scope.departcase[i].w12c = $scope.mcolor;
                    $scope.departcase[i].w12t = $scope.waitingminute;

                    $scope.departcase[i].w27 = caltime('',0, $scope.departcase[i].a2_Arrived, $scope.departcase[i].a7_MedicalDischarge);
                    $scope.departcase[i].w27c = $scope.mcolor;
                    $scope.departcase[i].w27t = $scope.waitingminute;

                    $scope.departcase[i].w78 = caltime('',0, $scope.departcase[i].a7_MedicalDischarge, $scope.departcase[i].a8_BillingInprogress);
                    $scope.departcase[i].w78c = $scope.mcolor;
                    $scope.departcase[i].w78t = $scope.waitingminute;

                    $scope.departcase[i].w810 = caltime('now',0, $scope.departcase[i].a8_BillingInprogress, $scope.departcase[i].a10_FinancialDischarge);
                    $scope.departcase[i].w810c = $scope.mcolor;
                    $scope.departcase[i].w810t = $scope.waitingminute;
                }
                console.log('departcase');
                console.log($scope.departcase);

                var result = _.groupBy($scope.departcase, "a_department");
                $scope.result = [];

                Object.keys(result).forEach((key) => {
                    $scope.result.push({
                        dep: key,
                    });
                });
                console.log($scope.result);

                $scope.casewait = {};
                $scope.casewait = $scope.departcase.filter(function (opd) { return opd.a10_FinancialDischarge == '' });
                console.log('casewait');
                console.log($scope.casewait);

                $scope.casedc = {};
                $scope.casedc = $scope.departcase.filter(function (opd) { return opd.a10_FinancialDischarge != '' });
                console.log('casedc');
                console.log($scope.casedc);

                casewaiting();
            })
        })
    }
    function avgtime() {
        // $scope.casedc = {};
        // $scope.casedc = $scope.departcase.filter(function (opd) { return opd.a10_FinancialDischarge != '' });
        // console.log('casedc');
        // console.log($scope.casedc);

        $scope.maxvalue = _.max($scope.casedc, function (casedc) { return casedc.timewait; });
        $scope.minvalue = _.min($scope.casedc, function (casedc) { return casedc.timewait; });
        $scope.avgvalue = $scope.casedc.reduce((item, num) => {
            return (item.timewait || item) + num.timewait
        }) / $scope.casedc.length;
        if ($scope.avgvalue == NaN) {
            $scope.avgvalue = $scope.maxvalue;
        }
        console.log($scope.casedc.length);
        console.log($scope.maxvalue.timewait);
        console.log($scope.minvalue.timewait);
        console.log($scope.avgvalue);
        $scope.avgvalue=parseInt($scope.avgvalue);
        if ( $scope.avgvalue>59) {
            var mh1=parseInt($scope.avgvalue/60);
            var mm1=$scope.avgvalue-(parseInt($scope.avgvalue/60)*60);
            $scope.avgvt=mh1 + ' ชั่วโมง '+ mm1 + ' นาที';
        } else {
            $scope.avgvt=parseInt($scope.avgvalue) + ' นาที';
        }

        $scope.casev=$scope.casedc.length;
        $scope.maxv=$scope.maxvalue.timewait;
        if ( $scope.maxv>59) {
            var mh=parseInt($scope.maxv/60);
            var mm=$scope.maxv-(parseInt($scope.maxv/60)*60);
            $scope.maxvt=mh + ' ชั่วโมง '+ mm + ' นาที';
        } else {
            $scope.maxvt=$scope.maxv + ' นาที';
        }
        $scope.minv=$scope.minvalue.timewait;
        if ( $scope.minv>59) {
            var mh2=parseInt($scope.minv/60);
            var mm2=$scope.minv-(parseInt($scope.minv/60)*60);
            $scope.minvt=mh2 + ' ชั่วโมง '+ mm2 + ' นาที';
        } else {
            $scope.minvt=$scope.minv + ' นาที';
        }
        $scope.show1 = false;
        $scope.show2 = true;
        console.log('casedc');
        console.log($scope.casedc);
        $scope.opdwt = {
            t0030: 0,
            t3060: 0,
            t6090: 0,
            t90120: 0,
            t120150: 0,
            t150180: 0,
            t180p: 0
        };
        for (var i = 0; i < $scope.casedc.length; i++) {
            mtimewait = 0;
            mtimewait = $scope.casedc[i].timewait;

                if (mtimewait > 0 && mtimewait <= 30) {
                    $scope.opdwt.t0030 +=1;
                } else if (mtimewait > 30 && mtimewait <= 60) {
                    $scope.opdwt.t3060 +=1;
                } else if (mtimewait > 60 && mtimewait <= 90) {
                    $scope.opdwt.t6090 +=1;
                } else if (mtimewait > 90 && mtimewait <= 120) {
                    $scope.opdwt.t90120 +=1;
                } else if (mtimewait > 120 && mtimewait <= 150) {
                    $scope.opdwt.t120150 +=1;
                } else if (mtimewait > 150 && mtimewait <= 180) {
                    $scope.opdwt.t150180 +=1;
                } else if (mtimewait > 180) {
                    $scope.opdwt.t180p +=1;
                } else {
                }

        }
        console.log($scope.opdwt);
    }

    function caltime(checkendtime,target, sTime, eTime) {
        if (sTime != '') {


            var startTime = moment(sTime);
            if (eTime == '') {
                if (checkendtime == 'now') {
                    var endTime = moment(new Date());
                } else {
                    var endTime = moment(sTime);
                }

            } else {
                var endTime = moment(eTime);
            }

            var duration = moment.duration(endTime.diff(startTime));
            var hours = duration.hours();
            var minutes = duration.minutes();
            $scope.waitingminute = (hours * 60) + minutes;
            // var mhint=Math.round(hours)+100;
            if (hours < 1) {
                var mhint = '00';

                var mmint2 = minutes + 100;
                var mmint1 = mmint2.toString();
                var mmint = mmint1.substring(1, 3);

            } else {
                var mhint2 = hours + 100;
                var mhint1 = mhint2.toString();
                var mhint = mhint1.substring(1, 3);

                var mmint2 = minutes + 100;
                var mmint1 = mmint2.toString();
                var mmint = mmint1.substring(1, 3);

            }
            mtime = mhint + ' h ' + mmint + ' m ';
            if (target==1) {
                $scope.t1=30;
                $scope.t2=45;
                $scope.t3=60;
            } else {
                $scope.t1=5;
                $scope.t2=10;
                $scope.t3=15;    
            }
            if (mhint > 0) {
                $scope.mcolor = "red"
            } else {
                if (mmint <= $scope.t1) {
                    $scope.mcolor = "green"
                } else if (mmint <= $scope.t2) {
                    $scope.mcolor = "yellow"
                } else if (mmint <= $scope.t3) {
                    $scope.mcolor = "orange"
                } else {
                    $scope.mcolor = "red"
                }
            }
        } else {
            mtime = '';
        }
        // mtime = hours +':' + minutes+'/   '+mhint +':' + mmint;
        if (mtime == "00 h 00 m ") {
            mtime = '';
            $scope.mcolor = 'white';

        }

        return mtime;
    }

    function calduration(duration) {
        var seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24)
            , days = parseInt(duration / (1000 * 60 * 60 * 24));

        var hoursDays = parseInt(days * 24);
        hours += hoursDays;
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + ":" + minutes + ":" + seconds;
    }
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
    function showdepart(params) {
        console.log(params);
        $scope.searchquery = params;
        console.log($scope.searchquery);

    }


    function casewaiting() {
        $scope.searchquery ='',
        $scope.show1 = true;
        $scope.show2 = false;
        $scope.showcase = $scope.casewait;
    }
    function showall() {
        $scope.searchquery ='',
        $scope.show1 = true;
        $scope.show2 = false;
        $scope.showcase = $scope.departcase;
    }
    function showjourney(EN) {
        // $scope.showstatus = false;
        console.log(EN);
        // $scope.Qno = '';


        // $scope.journey = $scodepartcase.filter(function (opd) { return opd._id == _id });
        findbyEN(EN);

        $scope.Qno = EN.substring(5, 9)

    }
    function findbyEN(EN) {
        $scope.journey = {};
        $http.post('/centrix/getQ_byEN', {
            "EN": EN,
            "orguid": $scope.orguid,
            "fromdate": moment($scope.todaydate).startOf('day').format(),
            "todate": moment($scope.todaydate).endOf('day').format()
        }).success(function (response) {
            $scope.journey = response.data;
            $scope.visitjourneys = response.data[0].visitjourneys;
            console.log('visitjourneys');
            console.log($scope.visitjourneys);

            async.waterfall([
                function a1(callback) {
                    $scope.a1 = '';
                    $scope.a2 = '';
                    $scope.a3 = '';
                    $scope.a4 = '';
                    $scope.a5 = '';
                    $scope.a6 = '';
                    $scope.a7 = '';
                    $scope.a8 = '';
                    $scope.a9 = '';
                    $scope.a10 = '';
                    for (var i = 0; i < $scope.visitjourneys.length; i++) {
                        switch ($scope.visitjourneys[i].statusuid.valuedescription) {
                            case "Registered":
                                $scope.a1 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Arrived":
                                $scope.a2 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Screening Completed":
                                $scope.a3 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Consultation Started":
                                $scope.a4 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Consultation Completed":
                                $scope.a5 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Under Observation":
                                $scope.a6 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Medical Discharge":
                                $scope.a7 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Billing Inprogress":
                                $scope.a8 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Bill Finalized":
                                $scope.a9 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            case "Financial Discharge":
                                $scope.a10 = moment($scope.visitjourneys[i].modifiedat).format("HH:mm");
                                break;
                            default:
                                break;
                        }
                    }
                    callback();
                },

                function a2(callback) {
                    // console.log($scope.a10);
                    $scope.b1 = 'app/image/t_top_green.png';
                    $scope.b2 = 'app/image/t_mid_green.png';
                    $scope.b3 = 'app/image/t_mid_green.png';
                    $scope.b4 = 'app/image/t_mid_green.png';
                    $scope.b5 = 'app/image/t_mid_green.png';
                    $scope.b6 = 'app/image/t_mid_green.png';
                    $scope.b7 = 'app/image/t_mid_green.png';
                    $scope.b8 = 'app/image/t_mid_green.png';
                    $scope.b9 = 'app/image/t_mid_green.png';
                    $scope.b10 = 'app/image/t_bot_green.png';
                    if ($scope.a10 != '') {
                    } else {
                        if ($scope.a9 != '') {
                            $scope.b10 = 'app/image/t_bot_grey.png';
                        } else {
                            if ($scope.a8 != '') {
                                $scope.b9 = 'app/image/t_mid_grey.png';
                                $scope.b10 = 'app/image/t_bot_grey.png';
                            } else {
                                if ($scope.a7 != '') {
                                    $scope.b8 = 'app/image/t_mid_grey.png';
                                    $scope.b9 = 'app/image/t_mid_grey.png';
                                    $scope.b10 = 'app/image/t_bot_grey.png';
                                } else {
                                    if ($scope.a6 != '') {
                                        $scope.b7 = 'app/image/t_mid_grey.png';
                                        $scope.b8 = 'app/image/t_mid_grey.png';
                                        $scope.b9 = 'app/image/t_mid_grey.png';
                                        $scope.b10 = 'app/image/t_bot_grey.png';
                                    } else {
                                        if ($scope.a5 != '') {
                                            $scope.b6 = 'app/image/t_mid_grey.png';
                                            $scope.b7 = 'app/image/t_mid_grey.png';
                                            $scope.b8 = 'app/image/t_mid_grey.png';
                                            $scope.b9 = 'app/image/t_mid_grey.png';
                                            $scope.b10 = 'app/image/t_bot_grey.png';
                                        } else {
                                            if ($scope.a4 != '') {
                                                $scope.b5 = 'app/image/t_mid_grey.png';
                                                $scope.b6 = 'app/image/t_mid_grey.png';
                                                $scope.b7 = 'app/image/t_mid_grey.png';
                                                $scope.b8 = 'app/image/t_mid_grey.png';
                                                $scope.b9 = 'app/image/t_mid_grey.png';
                                                $scope.b10 = 'app/image/t_bot_grey.png';
                                            } else {
                                                if ($scope.a3 != '') {
                                                    $scope.b4 = 'app/image/t_mid_grey.png';
                                                    $scope.b5 = 'app/image/t_mid_grey.png';
                                                    $scope.b6 = 'app/image/t_mid_grey.png';
                                                    $scope.b7 = 'app/image/t_mid_grey.png';
                                                    $scope.b8 = 'app/image/t_mid_grey.png';
                                                    $scope.b9 = 'app/image/t_mid_grey.png';
                                                    $scope.b10 = 'app/image/t_bot_grey.png';
                                                } else {
                                                    if ($scope.a2 != '') {
                                                        $scope.b3 = 'app/image/t_mid_grey.png';
                                                        $scope.b4 = 'app/image/t_mid_grey.png';
                                                        $scope.b5 = 'app/image/t_mid_grey.png';
                                                        $scope.b6 = 'app/image/t_mid_grey.png';
                                                        $scope.b7 = 'app/image/t_mid_grey.png';
                                                        $scope.b8 = 'app/image/t_mid_grey.png';
                                                        $scope.b9 = 'app/image/t_mid_grey.png';
                                                        $scope.b10 = 'app/image/t_bot_grey.png';
                                                    } else {
                                                        if ($scope.a1 != '') {
                                                            $scope.b2 = 'app/image/t_mid_grey.png';
                                                            $scope.b3 = 'app/image/t_mid_grey.png';
                                                            $scope.b4 = 'app/image/t_mid_grey.png';
                                                            $scope.b5 = 'app/image/t_mid_grey.png';
                                                            $scope.b6 = 'app/image/t_mid_grey.png';
                                                            $scope.b7 = 'app/image/t_mid_grey.png';
                                                            $scope.b8 = 'app/image/t_mid_grey.png';
                                                            $scope.b9 = 'app/image/t_mid_grey.png';
                                                            $scope.b10 = 'app/image/t_bot_grey.png';
                                                        } else {

                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    callback();
                }
            ], function () {
                $scope.$apply();
            })

        })
        // console.log('thisjourney');
        // console.log($scope.thisjourney);
        // $scope.HN = $scope.thisjourney.patientuid.mrn;
        // $scope.EN = $scope.thisjourney.visitid;
        // showr1();
    }
    // }




})






