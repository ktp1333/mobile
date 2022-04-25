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

    // vm.user = 'z';
    // vm.password = 'z';
    vm.serchen='';
    // $scope.chooseorg = chooseorg;
    $scope.caltime = caltime;
    // $scope.showdetail = showdetail;
    $scope.getAge = getAge;
    
    $scope.login = login;
    $scope.serchbyen = serchbyen;
    $scope.scanqr = scanqr;
    $scope.gohome = gohome;
    $scope.cameraRequested = false;

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
    function gohome() {
      init();
      $scope.show_case = $scope.casewait;
      mySplitter.left.close();
      mySplitter.content.load('login.html');
  }

    function scanqr() {
      mySplitter.content.load("qrscan.html");
      // $scope.cameraRequested = true;

    }
    function login(loginid) {
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
              mySplitter.content.load('search4d.html');

          }

      })
   
  }
    // function login(pwd) {

    //   console.log(pwd);
    //   // if (params == 'zz') {
    //   //     init();
    //   //     mySplitter.content.load('admin.html');
    //   //   } else {
    //   for (var i = 0; i < $scope.user.length; i++) {
    //     if (pwd == $scope.user[i].password) {
    //       $http.post('/centrix/organize', {
    //       }).then(function (response) {

    //         if (response && response.data.data.length > 0) {
    //           $scope.organize = response.data.data;
    //           console.log($scope.organize);


    //         } else {
    //           $scope.organize = [];
    //         }
    //       });
    //       // mySplitter.content.load('organise.html');
    //       mySplitter.content.load('search4d.html');
    //     } else {

    //     }
    //   }
    //   //   }
    // }

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

    $scope.processURLfromQR = function (url) {
      $scope.url = url;
      $scope.cameraRequested = false;
    }
  });
})();
