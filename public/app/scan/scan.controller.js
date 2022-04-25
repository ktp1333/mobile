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
  app.controller("scanController", function (
    $scope,
    $location,
    $http,
    $filter,
    $timeout,
    $window,
    $q,
    
  ) {
   
    $scope.caltime = caltime;
    $scope.showdetail = showdetail;
    $scope.getAge = getAge;
    // $scope.myTimer = myTimer;
    // $scope.choosedepartment = choosedepartment;
    $scope.gohome = gohome;
    $scope.loadabout = loadabout;
    // $scope.loaddepartment = loaddepartment;
    // $scope.loadsearch4d = loadsearch4d;
    // $scope.loadlist = loadlist;
    // $scope.login = login;
    // $scope.findnote = findnote;
    // $scope.search4digit = search4digit;
    $scope.scanqr = scanqr;
    // $scope.searchhn = searchhn;
    // $scope.stopScanning = stopScanning;
    // $scope.stopScanning=stopScanning;
    // var myVar = setInterval(myTimer, 1000);
    // $scope.apiip149 = "https://203.154.49.149:3000";
    $scope.apiipQ = "http://203.154.49.149:9990";
    $scope.todaydate = new Date();
    // init();

    function init() {
      console.log($scope.orguid);
      ($scope.entypeuid_opd = "59f2dd8ac4a1788835afd8c7"),
        ($scope.todaydate = new Date());
   
    }

    function scanqr() {
      mySplitter.content.load("qrscan.html");
      $scope.cameraRequested = true;
      Html5Qrcode.getCameras().then(devices => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        if (devices && devices.length) {
            var cameraId = devices[0].id;
            // .. use this to start scanning.
            const html5QrCode = new Html5Qrcode(/* element id */ "reader");
            html5QrCode.start(
                cameraId,
                {
                    fps: 60,    // Optional frame per seconds for qr code scanning
                    qrbox: 500  // Optional if you want bounded box UI
                },
                qrCodeMessage => {
                    // do something when code is read
                    console.log(qrCodeMessage);
                    document.getElementById('qr_result').innerText = qrCodeMessage;
                },
                errorMessage => {
                    // parse error, ignore it.
                    console.log(errorMessage);
                })
                .catch(err => {
                    // Start failed, handle it
                    console.log(err);
                });
        }
    }).catch(err => {
        // handle err
    });
     
    }
    // $scope.start = function() {
    //   $scope.cameraRequested = true;
    // }
    function searchhn(params) {
      console.log(params);
      // mySplitter.content.load("track.html");
      
    }
  


    function gohome() {
      init();
      $scope.show_case = $scope.casewait;
      mySplitter.left.close();
      mySplitter.content.load("track.html");
    }


    function loadabout() {
      mySplitter.left.close();
      mySplitter.content.load("about.html");
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
