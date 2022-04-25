(function () {
  "use strict";

  var app = angular.module("app", [
    "ngRoute",
    "ngAnimate",
    "ngMessages",
    "angularMoment",
    "angular.filter",
    "angular-md5",
    "onsen",
    "webcam",
    "bcQrReader"
  ]);
  app.controller("trackController", function (
    $scope,
    $location,
    $http,
    $filter,
    $timeout,
    $window,
    $q,

  ) {
    // $scope.site = localStorage.getItem('site');
    // $scope.site = $location.search()['site'];
    // console.log($scope.site);
    var vm = this;
    $scope.datafile = 'user.json';

    vm.user = 'z';
    vm.password = 'z';
    vm.serchen='O21036301';
    // $scope.chooseorg = chooseorg;
    $scope.caltime = caltime;
    $scope.showdetail = showdetail;
    $scope.getAge = getAge;
    // $scope.myTimer = myTimer;
    $scope.choosedepartment = choosedepartment;
    $scope.gohome = gohome;
    $scope.loadabout = loadabout;
    $scope.loaddepartment = loaddepartment;
    $scope.loadsearch4d = loadsearch4d;
    $scope.loadlist = loadlist;
    $scope.login = login;
    $scope.findnote = findnote;
    $scope.search4digit = search4digit;
    $scope.serchbyen = serchbyen;
    $scope.scanqr = scanqr;
    $scope.searchhn = searchhn;
    $scope.cameraRequested = false;
    // $scope.stopScanning = stopScanning;
    // $scope.stopScanning=stopScanning;
    // var myVar = setInterval(myTimer, 1000);
    // $scope.apiip149 = "https://203.154.49.149:3000";
    // $scope.apiipQ = "http://203.154.49.149:9990";
    $scope.todaydate = new Date();
    init();
    function init() {

      $scope.todaydate = new Date();
      $http.post('/centrix/find_status', {
        // "orguid": $scope.orguid,
      }).then(function (response) {
        console.log(response);
        $scope.status_q = response.data.data;
        console.log('status_q');
        console.log($scope.status_q);

      })

      $http({
        method: "POST",
        url: 'local_json/readjson',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "mfile": $scope.datafile,
        })
      }).then(function (data) {
        $scope.user = data.data.data;
        console.log($scope.user);
      });
    }
    function init1() {
      console.log($scope.orguid);
      ($scope.entypeuid_opd = "59f2dd8ac4a1788835afd8c7"),
        ($scope.todaydate = new Date());
      $http
        .post($scope.apiipQ + "/centrix/find_status", {
          // "orguid": $scope.orguid,
        })
        .then(function (response) {
          // console.log(response);
          $scope.status_q = response.data.statusq;
          console.log("status_q");
          console.log($scope.status_q);
          $http
            .post($scope.apiipQ + "/centrix/tracking", {
              entypeuid: $scope.entypeuid_opd,
              orguid: $scope.orguid,
              fromdate: moment($scope.todaydate).startOf("day").format(),
              todate: moment($scope.todaydate).endOf("day").format(),
            })
            .then(function (response) {
              $scope.allcase = response.data.data;
              $scope.departcase = response.data.data;
              console.log("response.data.data");
              console.log(response.data.data);
              for (var j = 0; j < $scope.departcase.length; j++) {
                $scope.departcase[j].a1_Registered = "";
                $scope.departcase[j].a2_Arrived = "";
                $scope.departcase[j].ax_Triaged = "";
                $scope.departcase[j].a3_ScreeningCompleted = "";
                $scope.departcase[j].a4_ConsultationStarted = "";
                $scope.departcase[j].a5_ConsultationCompleted = "";
                $scope.departcase[j].a6_UnderObservation = "";
                $scope.departcase[j].a7_MedicalDischarge = "";
                $scope.departcase[j].a8_BillingInprogress = "";
                $scope.departcase[j].a9_BillFinalized = "";
                $scope.departcase[j].a10_FinancialDischarge = "";
              }
              // console.log('$scope.departcase');
              // console.log($scope.departcase);
              //selct distinct department

              for (var i = 0; i < $scope.departcase.length; i++) {
                if ($scope.departcase[i].department) {
                  $scope.departcase[i].a_department =
                    $scope.departcase[i].department[0].description;
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
                  $scope.departcase[i].a_department = "";
                }

                for (
                  var k = 0;
                  k < $scope.departcase[i].visitjourneys.length;
                  k++
                ) {
                  if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae15"
                  ) {
                    $scope.departcase[i].a1_Registered =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae16"
                  ) {
                    $scope.departcase[i].a2_Arrived =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5a0ac84700d17a9459beab28"
                  ) {
                    $scope.departcase[i].ax_Triaged =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae17"
                  ) {
                    $scope.departcase[i].a3_ScreeningCompleted =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae18"
                  ) {
                    $scope.departcase[i].a4_ConsultationStarted =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae19"
                  ) {
                    $scope.departcase[i].a5_ConsultationCompleted =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "57c6712c4f362d6b9c5ef09e"
                  ) {
                    $scope.departcase[i].a6_UnderObservation =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae1b"
                  ) {
                    $scope.departcase[i].a7_MedicalDischarge =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "57c4446aa454a0ba852ce690"
                  ) {
                    $scope.departcase[i].a8_BillingInprogress =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae1a"
                  ) {
                    $scope.departcase[i].a9_BillFinalized =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else if (
                    $scope.departcase[i].visitjourneys[k].statusuid ==
                    "5784c4d032f3003ef802ae1c"
                  ) {
                    $scope.departcase[i].a10_FinancialDischarge =
                      $scope.departcase[i].visitjourneys[k].modifiedat;
                  } else {
                  }
                }
                // if ($scope.departcase[i].a10_FinancialDischarge == '') {
                //     $scope.departcase[i].waiting = caltime('now', 1, $scope.departcase[i].a1_Registered);
                // } else {
                //     $scope.departcase[i].waiting = caltime('', 1, $scope.departcase[i].a1_Registered, $scope.departcase[i].a10_FinancialDischarge);
                // }
                if ($scope.departcase[i].a10_FinancialDischarge == "") {
                  if ($scope.departcase[i].a2_Arrived == "") {
                    $scope.waitingminute = 0;
                  } else {
                    $scope.departcase[i].waiting = caltime(
                      "now",
                      1,
                      $scope.departcase[i].a2_Arrived
                    );
                  }
                } else {
                  $scope.departcase[i].waiting = caltime(
                    "",
                    1,
                    $scope.departcase[i].a2_Arrived,
                    $scope.departcase[i].a10_FinancialDischarge
                  );
                }
                $scope.departcase[i].waitingcolor = $scope.mcolor;
                $scope.departcase[i].timewait = $scope.waitingminute;
                if ($scope.departcase[i].a2_Arrived != "") {
                  $scope.departcase[i].w12 = caltime(
                    "",
                    0,
                    $scope.departcase[i].a1_Registered,
                    $scope.departcase[i].a2_Arrived
                  );
                  $scope.departcase[i].w12c = $scope.mcolor;
                  $scope.departcase[i].w12t = $scope.waitingminute;
                }

                if ($scope.departcase[i].a7_MedicalDischarge != "") {
                  $scope.departcase[i].w27 = caltime(
                    "",
                    0,
                    $scope.departcase[i].a2_Arrived,
                    $scope.departcase[i].a7_MedicalDischarge
                  );
                  $scope.departcase[i].w27c = $scope.mcolor;
                  $scope.departcase[i].w27t = $scope.waitingminute;
                }

                if ($scope.departcase[i].a8_BillingInprogress != "") {
                  $scope.departcase[i].w78 = caltime(
                    "",
                    0,
                    $scope.departcase[i].a7_MedicalDischarge,
                    $scope.departcase[i].a8_BillingInprogress
                  );
                  $scope.departcase[i].w78c = $scope.mcolor;
                  $scope.departcase[i].w78t = $scope.waitingminute;
                }

                if ($scope.departcase[i].a10_FinancialDischarge != "") {
                  $scope.departcase[i].w810 = caltime(
                    "now",
                    0,
                    $scope.departcase[i].a8_BillingInprogress,
                    $scope.departcase[i].a10_FinancialDischarge
                  );
                  $scope.departcase[i].w810c = $scope.mcolor;
                  $scope.departcase[i].w810t = $scope.waitingminute;
                }
                if ($scope.waitingnote && $scope.waitingnote.length > 0) {
                  for (var ww = 0; ww < $scope.waitingnote.length; ww++) {
                    if (
                      $scope.waitingnote[ww].EN == $scope.departcase[i].visitid
                    ) {
                      $scope.departcase[i].note = $scope.waitingnote[ww].NB;
                    }
                  }
                }
              }
              console.log("departcase");
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
              $scope.casewait = $scope.departcase.filter(function (opd) {
                return opd.a10_FinancialDischarge == "";
              });
              console.log("casewait");
              console.log($scope.casewait);

              $scope.casedc = {};
              $scope.casedc = $scope.departcase.filter(function (opd) {
                return opd.a10_FinancialDischarge != "";
              });
              console.log("casedc");
              console.log($scope.casedc);

              //find distict department
              // var data = $scope.departcase;
              var data = $scope.casewait;
              $scope.department = [];
              for (i = 0; i < data.length; i++) {
                var drExist = $scope.department.find(
                  (dr) => dr.department == data[i].a_department
                );
                if (!drExist) {
                  $scope.department.push({
                    department: data[i].a_department,
                  });
                }
              }
              console.log("$scope.department");
              console.log($scope.department);
              $scope.show_case = $scope.casewait;
            });
        });
    }
    // function chooseorg(params) {
    //   mySplitter.content.load('loading.html')
    //   console.log(params);
    //   $scope.orguid = params._id;
    //   $scope.orgname = params.description;
    //   $http.post('/centrix/tracking', {
    //     "entypeuid": $scope.entypeuid_opd,
    //     "orguid": $scope.orguid,
    //     "fromdate": moment($scope.todaydate).startOf('day').format(),
    //     "todate": moment($scope.todaydate).endOf('day').format()
    //   }).then(function (response) {
    //     $scope.allcase = response.data.data;
    //     $scope.departcase = response.data.data;
    //     console.log('response.data.data');
    //     console.log(response.data.data);
    //     for (var j = 0; j < $scope.departcase.length; j++) {
    //       $scope.departcase[j].a1_Registered = '';
    //       $scope.departcase[j].a2_Arrived = '';
    //       $scope.departcase[j].ax_Triaged = '';
    //       $scope.departcase[j].a3_ScreeningCompleted = '';
    //       $scope.departcase[j].a4_ConsultationStarted = '';
    //       $scope.departcase[j].a5_ConsultationCompleted = '';
    //       $scope.departcase[j].a6_UnderObservation = '';
    //       $scope.departcase[j].a7_MedicalDischarge = '';
    //       $scope.departcase[j].a8_BillingInprogress = '';
    //       $scope.departcase[j].a9_BillFinalized = '';
    //       $scope.departcase[j].a10_FinancialDischarge = '';
    //     }
    //     // console.log('$scope.departcase');
    //     // console.log($scope.departcase);
    //     //selct distinct department

    //     for (var i = 0; i < $scope.departcase.length; i++) {
    //       if ($scope.departcase[i].department) {
    //         $scope.departcase[i].a_department = $scope.departcase[i].department[0].description;
    //         // for (var ii = 0; ii < $scope.departcase[i].department.length; ii++) {
    //         //     $scope.departcase[i].a_department = '';
    //         //     if ($scope.departcase[i].department[ii].description) {
    //         //         if (ii == 0) {
    //         //             $scope.departcase[i].a_department = $scope.departcase[i].department[ii].description;
    //         //         } else {
    //         //             $scope.departcase[i].a_department = $scope.departcase[i].a_department + ',' + $scope.departcase[i].department[ii].description;
    //         //         }
    //         //     } else {
    //         //         $scope.departcase[i].a_department = '';
    //         //     }
    //         // }
    //       } else {
    //         $scope.departcase[i].a_department = '';
    //       }


    //       for (var k = 0; k < $scope.departcase[i].visitjourneys.length; k++) {

    //         if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae15") {
    //           $scope.departcase[i].a1_Registered = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae16") {
    //           $scope.departcase[i].a2_Arrived = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5a0ac84700d17a9459beab28") {
    //           $scope.departcase[i].ax_Triaged = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae17") {
    //           $scope.departcase[i].a3_ScreeningCompleted = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae18") {
    //           $scope.departcase[i].a4_ConsultationStarted = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae19") {
    //           $scope.departcase[i].a5_ConsultationCompleted = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "57c6712c4f362d6b9c5ef09e") {
    //           $scope.departcase[i].a6_UnderObservation = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1b") {
    //           $scope.departcase[i].a7_MedicalDischarge = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "57c4446aa454a0ba852ce690") {
    //           $scope.departcase[i].a8_BillingInprogress = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1a") {
    //           $scope.departcase[i].a9_BillFinalized = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else if ($scope.departcase[i].visitjourneys[k].statusuid == "5784c4d032f3003ef802ae1c") {
    //           $scope.departcase[i].a10_FinancialDischarge = $scope.departcase[i].visitjourneys[k].modifiedat;
    //         } else {
    //         }
    //       }
    //       // if ($scope.departcase[i].a10_FinancialDischarge == '') {
    //       //     $scope.departcase[i].waiting = caltime('now', 1, $scope.departcase[i].a1_Registered);
    //       // } else {
    //       //     $scope.departcase[i].waiting = caltime('', 1, $scope.departcase[i].a1_Registered, $scope.departcase[i].a10_FinancialDischarge);
    //       // }
    //       if ($scope.departcase[i].a10_FinancialDischarge == '') {
    //         if ($scope.departcase[i].a2_Arrived == '') {
    //           $scope.waitingminute = 0;
    //         } else {
    //           $scope.departcase[i].waiting = caltime('now', 1, $scope.departcase[i].a2_Arrived);
    //         }

    //       } else {
    //         $scope.departcase[i].waiting = caltime('', 1, $scope.departcase[i].a2_Arrived, $scope.departcase[i].a10_FinancialDischarge);
    //       }
    //       $scope.departcase[i].waitingcolor = $scope.mcolor;
    //       $scope.departcase[i].timewait = $scope.waitingminute;
    //       if ($scope.departcase[i].a2_Arrived != "") {
    //         $scope.departcase[i].w12 = caltime('', 0, $scope.departcase[i].a1_Registered, $scope.departcase[i].a2_Arrived);
    //         $scope.departcase[i].w12c = $scope.mcolor;
    //         $scope.departcase[i].w12t = $scope.waitingminute;
    //       }

    //       if ($scope.departcase[i].a7_MedicalDischarge != "") {
    //         $scope.departcase[i].w27 = caltime('', 0, $scope.departcase[i].a2_Arrived, $scope.departcase[i].a7_MedicalDischarge);
    //         $scope.departcase[i].w27c = $scope.mcolor;
    //         $scope.departcase[i].w27t = $scope.waitingminute;
    //       }

    //       if ($scope.departcase[i].a8_BillingInprogress != "") {
    //         $scope.departcase[i].w78 = caltime('', 0, $scope.departcase[i].a7_MedicalDischarge, $scope.departcase[i].a8_BillingInprogress);
    //         $scope.departcase[i].w78c = $scope.mcolor;
    //         $scope.departcase[i].w78t = $scope.waitingminute;
    //       }

    //       if ($scope.departcase[i].a10_FinancialDischarge != "") {
    //         $scope.departcase[i].w810 = caltime('now', 0, $scope.departcase[i].a8_BillingInprogress, $scope.departcase[i].a10_FinancialDischarge);
    //         $scope.departcase[i].w810c = $scope.mcolor;
    //         $scope.departcase[i].w810t = $scope.waitingminute;
    //       }
    //       if ($scope.waitingnote && $scope.waitingnote.length > 0) {
    //         for (var ww = 0; ww < $scope.waitingnote.length; ww++) {
    //           if ($scope.waitingnote[ww].EN == $scope.departcase[i].visitid) {
    //             $scope.departcase[i].note = $scope.waitingnote[ww].NB;
    //           }
    //         }
    //       }
    //     }
    //     console.log('departcase');
    //     console.log($scope.departcase);

    //     var result = _.groupBy($scope.departcase, "a_department");
    //     $scope.result = [];

    //     Object.keys(result).forEach((key) => {
    //       $scope.result.push({
    //         dep: key,
    //       });
    //     });
    //     console.log($scope.result);

    //     $scope.casewait = {};
    //     $scope.casewait = $scope.departcase.filter(function (opd) { return opd.a10_FinancialDischarge == '' });
    //     console.log('casewait');
    //     console.log($scope.casewait);

    //     $scope.casedc = {};
    //     $scope.casedc = $scope.departcase.filter(function (opd) { return opd.a10_FinancialDischarge != '' });
    //     console.log('casedc');
    //     console.log($scope.casedc);



    //     //find distict department
    //     // var data = $scope.departcase;
    //     var data = $scope.casewait;
    //     $scope.department = [];
    //     for (i = 0; i < data.length; i++) {
    //       var drExist = $scope.department.find((dr) => dr.department == data[i].a_department);
    //       if (!drExist) {
    //         $scope.department.push({
    //           department: data[i].a_department
    //         });
    //       }
    //     }
    //     console.log('$scope.department');
    //     console.log($scope.department);
    //     $scope.show_case = $scope.casewait;
    //   })
    //   mySplitter.content.load('department.html')
    // }
    //   function startScanning() {
    //     $('#reader').html5_qrcode(function(data){
    //       // do something when code is read
    //    },
    //    function(error){
    //     //show read errors 
    //   }, function(videoError){
    //     //the video stream could be opened
    //   }
    // );
    // return;
    //     const Html5Qrcode = new Html5Qrcode("reader");
    //      var devices;
    //     // This method will trigger user permissions
    //     Html5Qrcode.getCameras()
    //       .then((devicesResult) => {
    //         devices = devicesResult;
    //       })
    //       .catch((err) => {
    //         // handle err
    //       });
    //       console.log(devices);
    //     // .. use this to start scanning.
    //     if (devices.length > 1) {
    //       var cameraId = devices[1].id;
    //     } else {
    //       var cameraId = devices[0].id;
    //     }
    //     var cameraId = devices[1].id;
    //     html5QrCode
    //       .start(
    //         cameraId,
    //         {
    //           fps: 10, // Optional frame per seconds for qr code scanning
    //           qrbox: 250, // Optional if you want bounded box UI
    //         },
    //         (qrCodeMessage) => {
    //           // do something when code is read
    //           console.log(qrCodeMessage);
    //           document.getElementById("qr_result").innerText = qrCodeMessage;
    //         },
    //         (errorMessage) => {
    //           // parse error, ignore it.
    //           console.log(errorMessage);
    //         }
    //       )
    //       .catch((err) => {
    //         // Start failed, handle it
    //         console.log(err);
    //       });
    //     setTimeout(() => {
    //       var video = document.getElementsByTagName("video");
    //       video[0].setAttribute("autoplay", "");
    //     }, 1000);
    //   }
    //   function stopScanning() {
    //     html5QrCode
    //       .stop()
    //       .then((ignore) => {
    //         // QR Code scanning is stopped.
    //       })
    //       .catch((err) => {
    //         // Stop failed, handle it.
    //       });
    //   }
    function scanqr() {
      mySplitter.content.load("qrscan.html");
      // $scope.cameraRequested = true;

    }
    // $scope.start = function() {
    //   $scope.cameraRequested = true;
    // }
    function searchhn(params) {
      console.log(params);
      // mySplitter.content.load("search4d.html")
      $scope.cameraRequested = true;

    }
    function findnote() {
      $http
        .post($scope.apiipQ + "/waitingnote/find_fromto", {
          orguid: $scope.orguid,
          fromdate: moment($scope.todaydate).startOf("day").format(),
          todate: moment($scope.todaydate).endOf("day").format(),
        })
        .then(function (data) {
          if (data.data && data.data.finddata.length > 0) {
            $scope.waitingnote = data.data.finddata;
            console.log("$scope.waitingnote");
            console.log($scope.waitingnote);
          }
        });
    }
    function login(pwd) {

      console.log(pwd);
      // if (params == 'zz') {
      //     init();
      //     mySplitter.content.load('admin.html');
      //   } else {
      for (var i = 0; i < $scope.user.length; i++) {
        if (pwd == $scope.user[i].password) {
          $http.post('/centrix/organize', {
          }).then(function (response) {

            if (response && response.data.data.length > 0) {
              $scope.organize = response.data.data;
              console.log($scope.organize);


            } else {
              $scope.organize = [];
            }
          });
          // mySplitter.content.load('organise.html');
          mySplitter.content.load('search4d.html');
        } else {

        }
      }
      //   }
    }
    function login1(user, pwd) {
      console.log(user);
      console.log(pwd);
      if (user.toUpperCase() == "PUTD" && pwd == "123") {
        $scope.orguid = "5bf37ed6b304f66fb4c5c560";
        $scope.site = "PUTD";
        findnote();
        init();
        mySplitter.content.load("search4d.html");
      } else if (user.toUpperCase() == "PSUV" && pwd == "123") {
        $scope.orguid = "59e865c8ab5f11532bab0537";
        $scope.site = "PSUV";
        findnote();
        init();
        mySplitter.content.load("search4d.html");
      } else if (user.toUpperCase() == "PSV" && pwd == "123") {
        $scope.orguid = "5d09fb1b80256a7b271319a9";
        $scope.site = "PSV";
        findnote();
        init();
        mySplitter.content.load("search4d.html");
      } else {
        // $http.post($scope.apiip149 + '/user/login', {
        $http
          .post($scope.apiipQ + "/centrix/logon", {
            // "orguid": $scope.orguid,
            loginid: user,
            password: pwd,
          })
          .then(function (response) {
            if (response.data.users.length > 0) {
              $scope.user = response.data.users[0];
              $scope.userID = $scope.user.code;
              $scope.username = $scope.user.name;
              $scope.orguid = $scope.user.orguid;
              console.log("$scope.orguid");
              console.log($scope.orguid);

              if ($scope.orguid == "5bf37ed6b304f66fb4c5c560") {
                $scope.site = "PUTD";
                init();
                mySplitter.content.load("search4d.html");
                // } else if ($scope.orguid == "59e865c8ab5f11532bab0537") {
                //     $scope.site = "PSUV";
                //     init();
                //     mySplitter.content.load('search4d.html');
              } else {
              }
            } else {
            }
          });
      }
    }
    function serchbyen(params) {
      console.log(params);
      $http
      .post("/centrix/trackingen", {
        orguid: $scope.orguid,
        entypeuid: $scope.entypeuid_opd,
        visitid: params,
        fromdate: moment($scope.todaydate).startOf("day").format(),
        todate: moment($scope.todaydate).endOf("day").format(),
      })
      .then(function (data) {
        if (data.data && data.data.data.length > 0) {
          $scope.seach4d = data.data.data;

          console.log("$scope.seach4d");
          console.log($scope.seach4d);

          for (var i = 0; i < $scope.seach4d.length; i++) {
            if ($scope.seach4d[i].department) {
              $scope.seach4d[i].a_department =
                $scope.seach4d[i].department[0].description;
              // for (var ii = 0; ii < $scope.seach4d[i].department.length; ii++) {
              //     $scope.seach4d[i].a_department = '';
              //     if ($scope.seach4d[i].department[ii].description) {
              //         if (ii == 0) {
              //             $scope.seach4d[i].a_department = $scope.seach4d[i].department[ii].description;
              //         } else {
              //             $scope.seach4d[i].a_department = $scope.seach4d[i].a_department + ',' + $scope.seach4d[i].department[ii].description;
              //         }
              //     } else {
              //         $scope.seach4d[i].a_department = '';
              //     }
              // }
            } else {
              $scope.seach4d[i].a_department = "";
            }

            for (var k = 0; k < $scope.seach4d[i].visitjourneys.length; k++) {
              if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae15"
              ) {
                $scope.seach4d[i].a1_Registered =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae16"
              ) {
                $scope.seach4d[i].a2_Arrived =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5a0ac84700d17a9459beab28"
              ) {
                $scope.seach4d[i].ax_Triaged =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae17"
              ) {
                $scope.seach4d[i].a3_ScreeningCompleted =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae18"
              ) {
                $scope.seach4d[i].a4_ConsultationStarted =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae19"
              ) {
                $scope.seach4d[i].a5_ConsultationCompleted =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "57c6712c4f362d6b9c5ef09e"
              ) {
                $scope.seach4d[i].a6_UnderObservation =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae1b"
              ) {
                $scope.seach4d[i].a7_MedicalDischarge =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "57c4446aa454a0ba852ce690"
              ) {
                $scope.seach4d[i].a8_BillingInprogress =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae1a"
              ) {
                $scope.seach4d[i].a9_BillFinalized =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else if (
                $scope.seach4d[i].visitjourneys[k].statusuid ==
                "5784c4d032f3003ef802ae1c"
              ) {
                $scope.seach4d[i].a10_FinancialDischarge =
                  $scope.seach4d[i].visitjourneys[k].modifiedat;
              } else {
              }
            }
            // if ($scope.seach4d[i].a10_FinancialDischarge == '') {
            //     $scope.seach4d[i].waiting = caltime('now', 1, $scope.seach4d[i].a1_Registered);
            // } else {
            //     $scope.seach4d[i].waiting = caltime('', 1, $scope.seach4d[i].a1_Registered, $scope.seach4d[i].a10_FinancialDischarge);
            // }
            if ($scope.seach4d[i].a10_FinancialDischarge == "") {
              if ($scope.seach4d[i].a2_Arrived == "") {
                $scope.waitingminute = 0;
              } else {
                $scope.seach4d[i].waiting = caltime(
                  "now",
                  1,
                  $scope.seach4d[i].a2_Arrived
                );
              }
            } else {
              $scope.seach4d[i].waiting = caltime(
                "",
                1,
                $scope.seach4d[i].a2_Arrived,
                $scope.seach4d[i].a10_FinancialDischarge
              );
            }
            $scope.seach4d[i].waitingcolor = $scope.mcolor;
            $scope.seach4d[i].timewait = $scope.waitingminute;
            if ($scope.seach4d[i].a2_Arrived != "") {
              $scope.seach4d[i].w12 = caltime(
                "",
                0,
                $scope.seach4d[i].a1_Registered,
                $scope.seach4d[i].a2_Arrived
              );
              $scope.seach4d[i].w12c = $scope.mcolor;
              $scope.seach4d[i].w12t = $scope.waitingminute;
            }

            if ($scope.seach4d[i].a7_MedicalDischarge != "") {
              $scope.seach4d[i].w27 = caltime(
                "",
                0,
                $scope.seach4d[i].a2_Arrived,
                $scope.seach4d[i].a7_MedicalDischarge
              );
              $scope.seach4d[i].w27c = $scope.mcolor;
              $scope.seach4d[i].w27t = $scope.waitingminute;
            }

            if ($scope.seach4d[i].a8_BillingInprogress != "") {
              $scope.seach4d[i].w78 = caltime(
                "",
                0,
                $scope.seach4d[i].a7_MedicalDischarge,
                $scope.seach4d[i].a8_BillingInprogress
              );
              $scope.seach4d[i].w78c = $scope.mcolor;
              $scope.seach4d[i].w78t = $scope.waitingminute;
            }

            if ($scope.seach4d[i].a10_FinancialDischarge != "") {
              $scope.seach4d[i].w810 = caltime(
                "now",
                0,
                $scope.seach4d[i].a8_BillingInprogress,
                $scope.seach4d[i].a10_FinancialDischarge
              );
              $scope.seach4d[i].w810c = $scope.mcolor;
              $scope.seach4d[i].w810t = $scope.waitingminute;
            }
            if ($scope.waitingnote && $scope.waitingnote.length > 0) {
              for (var ww = 0; ww < $scope.waitingnote.length; ww++) {
                if ($scope.waitingnote[ww].EN == $scope.seach4d[i].visitid) {
                  $scope.seach4d[i].note = $scope.waitingnote[ww].NB;
                }
              }
            }
          }
          console.log("seach4d");
          console.log($scope.seach4d);

          mySplitter.content.load("search4d.html");
        }
      });
    }
    function search4digit(params) {
      console.log(params);
      $http
        .post($scope.apiipQ + "/centrix/tracking4digit", {
          orguid: $scope.orguid,
          entypeuid: $scope.entypeuid_opd,
          visitid: params,
          fromdate: moment($scope.todaydate).startOf("day").format(),
          todate: moment($scope.todaydate).endOf("day").format(),
        })
        .then(function (data) {
          if (data.data && data.data.data.length > 0) {
            $scope.seach4d = data.data.data;

            console.log("$scope.seach4d");
            console.log($scope.seach4d);

            for (var i = 0; i < $scope.seach4d.length; i++) {
              if ($scope.seach4d[i].department) {
                $scope.seach4d[i].a_department =
                  $scope.seach4d[i].department[0].description;
                // for (var ii = 0; ii < $scope.seach4d[i].department.length; ii++) {
                //     $scope.seach4d[i].a_department = '';
                //     if ($scope.seach4d[i].department[ii].description) {
                //         if (ii == 0) {
                //             $scope.seach4d[i].a_department = $scope.seach4d[i].department[ii].description;
                //         } else {
                //             $scope.seach4d[i].a_department = $scope.seach4d[i].a_department + ',' + $scope.seach4d[i].department[ii].description;
                //         }
                //     } else {
                //         $scope.seach4d[i].a_department = '';
                //     }
                // }
              } else {
                $scope.seach4d[i].a_department = "";
              }

              for (var k = 0; k < $scope.seach4d[i].visitjourneys.length; k++) {
                if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae15"
                ) {
                  $scope.seach4d[i].a1_Registered =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae16"
                ) {
                  $scope.seach4d[i].a2_Arrived =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5a0ac84700d17a9459beab28"
                ) {
                  $scope.seach4d[i].ax_Triaged =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae17"
                ) {
                  $scope.seach4d[i].a3_ScreeningCompleted =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae18"
                ) {
                  $scope.seach4d[i].a4_ConsultationStarted =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae19"
                ) {
                  $scope.seach4d[i].a5_ConsultationCompleted =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "57c6712c4f362d6b9c5ef09e"
                ) {
                  $scope.seach4d[i].a6_UnderObservation =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae1b"
                ) {
                  $scope.seach4d[i].a7_MedicalDischarge =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "57c4446aa454a0ba852ce690"
                ) {
                  $scope.seach4d[i].a8_BillingInprogress =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae1a"
                ) {
                  $scope.seach4d[i].a9_BillFinalized =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else if (
                  $scope.seach4d[i].visitjourneys[k].statusuid ==
                  "5784c4d032f3003ef802ae1c"
                ) {
                  $scope.seach4d[i].a10_FinancialDischarge =
                    $scope.seach4d[i].visitjourneys[k].modifiedat;
                } else {
                }
              }
              // if ($scope.seach4d[i].a10_FinancialDischarge == '') {
              //     $scope.seach4d[i].waiting = caltime('now', 1, $scope.seach4d[i].a1_Registered);
              // } else {
              //     $scope.seach4d[i].waiting = caltime('', 1, $scope.seach4d[i].a1_Registered, $scope.seach4d[i].a10_FinancialDischarge);
              // }
              if ($scope.seach4d[i].a10_FinancialDischarge == "") {
                if ($scope.seach4d[i].a2_Arrived == "") {
                  $scope.waitingminute = 0;
                } else {
                  $scope.seach4d[i].waiting = caltime(
                    "now",
                    1,
                    $scope.seach4d[i].a2_Arrived
                  );
                }
              } else {
                $scope.seach4d[i].waiting = caltime(
                  "",
                  1,
                  $scope.seach4d[i].a2_Arrived,
                  $scope.seach4d[i].a10_FinancialDischarge
                );
              }
              $scope.seach4d[i].waitingcolor = $scope.mcolor;
              $scope.seach4d[i].timewait = $scope.waitingminute;
              if ($scope.seach4d[i].a2_Arrived != "") {
                $scope.seach4d[i].w12 = caltime(
                  "",
                  0,
                  $scope.seach4d[i].a1_Registered,
                  $scope.seach4d[i].a2_Arrived
                );
                $scope.seach4d[i].w12c = $scope.mcolor;
                $scope.seach4d[i].w12t = $scope.waitingminute;
              }

              if ($scope.seach4d[i].a7_MedicalDischarge != "") {
                $scope.seach4d[i].w27 = caltime(
                  "",
                  0,
                  $scope.seach4d[i].a2_Arrived,
                  $scope.seach4d[i].a7_MedicalDischarge
                );
                $scope.seach4d[i].w27c = $scope.mcolor;
                $scope.seach4d[i].w27t = $scope.waitingminute;
              }

              if ($scope.seach4d[i].a8_BillingInprogress != "") {
                $scope.seach4d[i].w78 = caltime(
                  "",
                  0,
                  $scope.seach4d[i].a7_MedicalDischarge,
                  $scope.seach4d[i].a8_BillingInprogress
                );
                $scope.seach4d[i].w78c = $scope.mcolor;
                $scope.seach4d[i].w78t = $scope.waitingminute;
              }

              if ($scope.seach4d[i].a10_FinancialDischarge != "") {
                $scope.seach4d[i].w810 = caltime(
                  "now",
                  0,
                  $scope.seach4d[i].a8_BillingInprogress,
                  $scope.seach4d[i].a10_FinancialDischarge
                );
                $scope.seach4d[i].w810c = $scope.mcolor;
                $scope.seach4d[i].w810t = $scope.waitingminute;
              }
              if ($scope.waitingnote && $scope.waitingnote.length > 0) {
                for (var ww = 0; ww < $scope.waitingnote.length; ww++) {
                  if ($scope.waitingnote[ww].EN == $scope.seach4d[i].visitid) {
                    $scope.seach4d[i].note = $scope.waitingnote[ww].NB;
                  }
                }
              }
            }
            console.log("seach4d");
            console.log($scope.seach4d);

            mySplitter.content.load("search4d.html");
          }
        });
    }

    function gohome() {
      init();
      $scope.show_case = $scope.casewait;
      mySplitter.left.close();
      mySplitter.content.load("search4d.html");
    }

    function loaddepartment() {
      mySplitter.left.close();
      mySplitter.content.load("department.html");
    }

    function loadsearch4d() {
      mySplitter.left.close();
      mySplitter.content.load("search4d.html");
    }

    function loadlist() {
      mySplitter.left.close();
      mySplitter.content.load("list.html");
    }

    function loadabout() {
      mySplitter.left.close();
      mySplitter.content.load("about.html");
    }

    function choosedepartment(params) {
      $scope.casedepartment = {};
      $scope.casedepartment = $scope.casewait.filter(function (opd) {
        return opd.a_department == params;
      });
      console.log("casedepartment");
      console.log($scope.casedepartment);
      $scope.show_case = $scope.casedepartment;
      mySplitter.content.load("search4d.html");
    }

    // function myTimer() {
    //     $scope.t = moment(new Date()).format('HH:mm');
    //     document.getElementById("atime").innerHTML = 'Time  ' + $scope.t;
    // }
    // this.load = function (page) {

    //     mySplitter.content.load(page)
    //         .then(function () {
    //             mySplitter.left.close();
    //         });
    // };

    function caltime(checkendtime, target, sTime, eTime) {
      var mtime = "";
      if (sTime != "") {
        var startTime = moment(sTime);
        if (eTime == "") {
          if (checkendtime == "now") {
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
        $scope.waitingminute = hours * 60 + minutes;
        // var mhint=Math.round(hours)+100;
        if (hours < 1) {
          var mhint = "00";

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
        mtime = mhint + " h " + mmint + " m ";
        if (target == 1) {
          $scope.t1 = 30;
          $scope.t2 = 45;
          $scope.t3 = 60;
        } else {
          $scope.t1 = 5;
          $scope.t2 = 10;
          $scope.t3 = 15;
        }
        if (mhint > 0) {
          $scope.mcolor = "red";
        } else {
          if (mmint <= $scope.t1) {
            $scope.mcolor = "teal";
          } else if (mmint <= $scope.t2) {
            $scope.mcolor = "GoldenRod";
          } else if (mmint <= $scope.t3) {
            $scope.mcolor = "orange";
          } else {
            $scope.mcolor = "red";
          }
        }
      } else {
        mtime = "";
      }
      // mtime = hours +':' + minutes+'/   '+mhint +':' + mmint;
      if (mtime == "00 h 00 m ") {
        mtime = "";
        $scope.mcolor = "white";
      }

      return mtime;
    }

    function getAge(myDate) {
      var currentDate = moment();
      var dateOfBirth = moment(myDate);
      var years = currentDate.diff(dateOfBirth, "years");
      dateOfBirth.add(years, "years");
      var months = currentDate.diff(dateOfBirth, "months");
      dateOfBirth.add(months, "months");
      var days = currentDate.diff(dateOfBirth, "days");
      var mage = years + " Y /" + months + " M /" + days + "D";
      return mage;
    }

    function DateThai(myDate) {
      // var dateOfBirth = moment(myDate);
      // months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      var dt = myDate.split(/\-|\s/);
      var tyear = (parseInt(dt[0]) + 543).toString();
      var eyear = dt[0];
      var tday = dt[2].substring(0, 2);
      var tmonth = dt[1];

      var thday = new Array(
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัส",
        "ศุกร์",
        "เสาร์"
      );

      var thmonth = new Array(
        "",
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
      );
      var t2month = thmonth[parseInt(dt[1])];

      return tday + " " + t2month + " " + tyear;
    }

    function showdetail(item) {
      console.log(item);
      mySplitter.content.load("result.html");
      // findlab($scope.HN);
      // emr_lab(item.patientvisituid),
      //     emr_xray(item.visitid, item.orguid)
      // ons.notification.alert('Congratulations!');
    }



    $scope.processURLfromQR = function (url) {
      $scope.url = url;
      $scope.cameraRequested = false;
    }
  });
})();
