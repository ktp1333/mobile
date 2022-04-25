(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMessages', 'angularMoment', 'angular.filter', 'angular-md5', 'onsen']);
    app.controller("np_psvController", function ($scope, $rootScope, $location, $http, $filter, $timeout, $window, $q) {
        // $scope.HN = $location.search()['HN'];
        console.log('success');
        init();
        $scope.timestart1 = timestart1;
        $scope.timestop1 = timestop1;
        $scope.timestart2 = timestart2;
        $scope.timestop2 = timestop2;
        $scope.timestart3 = timestart3;
        $scope.timestop3 = timestop3;
        $scope.timestart4 = timestart4;
        $scope.timestop4 = timestop4;
        $scope.timestart5 = timestart5;
        $scope.timestop5 = timestop5;
        $scope.reset = reset;
        // var today = new Date();
        // $scope.ptnote={};
        //     $scope.dtp = {
        //     // value: new Date(today.getFullYear(), today.getMonth(), 1)
        //     value: today
        // };
        // $scope.dtp2 = {
        //     value: today
        // };
        // $scope.todaydate = new Date();
        var myVar = setInterval(myTimer, 1000);
        var myVar2 = setInterval(myTimer2, 100);
        init();
        function init() {
            
            $scope.show_a = false;
            $scope.show_ans1 = false;
            $scope.show_ans2 = false;
            $scope.show_ans3 = false;
            $scope.show_ans4 = false;
            $scope.dis_start1 = false;
            $scope.dis_stop1 = true;
            $scope.dis_start2 = true;
            $scope.dis_stop2 = true;
            $scope.dis_start3 = true;
            $scope.dis_stop3 = true;
            $scope.dis_start4 = true;
            $scope.dis_stop4 = true;
            $scope.dis_start5 = true;
            $scope.dis_stop5 = true;

            $scope.value_fixa = '';
            $scope.value_b2 = '';
            $scope.value_c2 = '';

            $scope.value_b3 = '';
            $scope.value_c3 = '';
            $scope.ans2 = 0;
            $scope.value_b4 = '';
            $scope.value_c4 = '';
            $scope.ans3 = 0;
            $scope.value_b5 = '';
            $scope.value_c5 = '';
            $scope.ans4 = 0;
            $scope.ans5 = 0;
            $scope.start = '';
            $scope.stop = '';
            $scope.start2 = '';
            $scope.stop2 = '';
            $scope.start3 = '';
            $scope.stop3 = '';
            $scope.start4 = '';
            $scope.stop4 = '';
            $scope.start5 = '';
            $scope.stop5 = '';
            $scope.start2 = '';
            $scope.ans1 = '';
            $scope.ans2 = '';
            $scope.ans3 = '';
            $scope.ans4 = '';
            $scope.t = '';
            $scope.s = '';
        }

        function reset() {
            // mySplitter.content.load('home.html');
            init();
            document.getElementById("atime").innerHTML = '';
            document.getElementById("btime").innerHTML = '';
        }
        function myTimer() {
            $scope.t = moment(new Date()).format('mm:ss');
            document.getElementById("atime").innerHTML = 'Time :' + $scope.t;
        }
        function myTimer2() {
            // var m=moment(new Date()).diff(moment($scope.start), 'minutes');
            // var secs=moment(new Date()).diff(moment($scope.start), 'seconds');
            if ($scope.start == '') {
                document.getElementById("btime").innerHTML = '';
            } else {
                var secs = moment(new Date()).diff(moment($scope.start));
                $scope.s = moment.utc(secs).format('HH:mm:ss SSS');
                document.getElementById("btime").innerHTML = 'Timer :' + $scope.s;
            }

        }
        // function showtime() {
        //     $scope.mtime = moment(new Date()).format('m s');
        // }

        this.load = function (page) {

            mySplitter.content.load(page)
                .then(function () {
                    mySplitter.left.close();
                });
        };
        function timestart1() {
            $scope.start = new Date();
            // console.log($scope.start);
            $scope.dis_start1 = true;
            $scope.dis_stop1 = false;
        }
        function timestop1() {
            $scope.dis_stop1 = true;
            $scope.dis_start2 = false;
            $scope.show_a = true;
            $scope.stop = new Date();
            console.log($scope.stop);
            var b = moment($scope.start);
            $scope.a = moment($scope.stop);
            $scope.value_fixa = ($scope.a).diff(b, 'seconds');
        }

        function timestart2() {
            $scope.start2 = new Date();
            $scope.dis_start2 = true;
            $scope.dis_stop2 = false;
            // console.log($scope.start2);
        }
        function timestop2() {
            $scope.show_ans1 = true;
            $scope.dis_stop2 = true;
            $scope.dis_start3 = false;
            $scope.stop2 = new Date();
            console.log($scope.stop2);
            var mstart2 = moment($scope.start2);
            var mstop2 = moment($scope.stop2);

            $scope.value_b2 = mstop2.diff(mstart2, 'seconds');
            $scope.value_c2 = mstart2.diff($scope.start, 'seconds');
            $scope.ans2 = (1 - ($scope.value_fixa / $scope.value_b2)) / ($scope.value_c2 * 100/60)
        }

        function timestart3() {
            $scope.start3 = new Date();
            $scope.dis_start3 = true;
            $scope.dis_stop3 = false;
            // console.log($scope.start3);
        }
        function timestop3() {
            $scope.show_ans2 = true;
            $scope.dis_stop3 = true;
            $scope.dis_start4 = false;
            $scope.stop3 = new Date();
            console.log($scope.stop3);
            var mstart3 = moment($scope.start3);
            var mstop3 = moment($scope.stop3);

            $scope.value_b3 = mstop3.diff(mstart3, 'seconds');
            $scope.value_c3 = mstart3.diff($scope.start, 'seconds');
            $scope.ans3 = (1 - ($scope.value_fixa / $scope.value_b3)) / ($scope.value_c3 * 100/60)
        }

        function timestart4() {
            $scope.start4 = new Date();
            $scope.dis_start4 = true;
            $scope.dis_stop4 = false;
            // console.log($scope.start4);
        }
        function timestop4() {
            $scope.show_ans3 = true;
            $scope.dis_stop4 = true;
            $scope.dis_start5 = false;
            $scope.stop4 = new Date();
            console.log($scope.stop4);
            var mstart4 = moment($scope.start4);
            var mstop4 = moment($scope.stop4);

            $scope.value_b4 = mstop4.diff(mstart4, 'seconds');
            $scope.value_c4 = mstart4.diff($scope.start, 'seconds');
            $scope.ans4 = (1 - ($scope.value_fixa / $scope.value_b4)) / ($scope.value_c4 * 100/60)
        }
        function timestart5() {
            $scope.start5 = new Date();
            $scope.dis_start5 = true;
            $scope.dis_stop5 = false;
            // console.log($scope.start5);
        }
        function timestop5() {
            $scope.show_ans4= true;
            $scope.dis_stop5 = true;
            $scope.stop5 = new Date();
            console.log($scope.stop5);
            var mstart5 = moment($scope.start5);
            var mstop5 = moment($scope.stop5);

            $scope.value_b5 = mstop5.diff(mstart5, 'seconds');
            $scope.value_c5 = mstart5.diff($scope.start, 'seconds');
            $scope.ans5 = (1 - ($scope.value_fixa / $scope.value_b5)) / ($scope.value_c5 * 100/60)
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
    });
})();