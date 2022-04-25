var app = angular.module('myApp', ['ngMaterial', 'angular.filter']);
app.controller('reportallController', function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $filter) {
    $scope.selectdate = selectdate;
    // $scope.refreshmenu = refreshmenu;
    // $scope.report1 = report1;
    // $scope.report2 = report2;
    // $scope.show_period = show_period;
    $scope.show_reportall = true;
    $scope.choosesite = choosesite;
    // $scope.show_daily = show_daily;
    // $scope.report4 = report4;
    // $scope.report5 = report5;
    // $scope.timeact = 0;
    // $scope.ward = $location.search()['ward'];
    // --------------------------------------------
    $scope.init = init;
    // $scope.selectdata = selectdata;
    // $scope.daily = daily;
    // $scope.nextRN = 0;
    // $scope.nextPN = 0;
    // $scope.calnextshift = calnextshift;
    // $scope.staffworkinghour = 0;
    // $scope.nextproduct = 0;
    $scope.exitwindows = exitwindows;
    $scope.selectsite = selectsite;
    $scope.getdata = getdata;
    // $scope.show_dailyall = show_dailyall;
    // $scope.show_all4 = show_all4;
    // $scope.JSONToCSVConvertor = JSONToCSVConvertor;
    // $scope.json2xls = json2xls;
    // $scope.group_dailyall = group_dailyall;
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
    // function refreshmenu() {
    //     $scope.right = false;
    //     $scope.left = false;
    //     // $scope.toggleLeft();
    // }
    // function closeallreport() {
    //     $scope.show_report1 = false;
    //     $scope.show_report2 = false;
    //     $scope.show_report3 = false;
    //     $scope.show_report4 = false;
    //     $scope.show_report5 = false;
    // }
    // function report1() {
    //     closeallreport();
    //     $scope.show_report1 = true;
    //     $scope.mlabel = "report1";
    // }
    // function report2(choosedate) {
    //     closeallreport();
    //     $scope.show_report2 = true;
    //     $scope.mlabel = "report2";
    //     daily(choosedate);
    // }
    // function show_period() {
    //     // closeallreport();
    //     $scope.show_report3 = false;
    //     $scope.show_report2 = true;
    // }
    // function show_daily() {
    //     // closeallreport();
    //     $scope.show_report3 = true;
    //     $scope.show_report2 = false;
    // }
    // function report4() {
    //     closeallreport();
    //     $scope.show_report4 = true;
    //     $scope.mlabel = "report4";
    // }
    // function report5() {
    //     closeallreport();
    //     $scope.show_report5 = true;
    //     $scope.mlabel = "report5";
    // }
    function choosesite(site,dtp) {
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
        getdata($scope.orguid,dtp);
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
    function getdata(orguid,dtp) {
        $http.post('/maindata/chk_inputdata', {
            date:dtp,
            orguid: orguid
        }).success(function (data) {

            $scope.showdata = data.maindata;
            console.log('$scope.showdata');
            console.log($scope.showdata);
            $scope.show_table = true;
        });

    }
})



