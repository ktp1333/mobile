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

  ]);
  app.controller("nursebiController", function (
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
    var bi = this;
    $location.url($location.path());
    $scope.login = login;
    $scope.opd = opd;
    $scope.find_visitcount = find_visitcount;
    $scope.find_ward = find_ward;
    $scope.ipd = ipd;
    $scope.saveuser = saveuser;
    $scope.save_user = save_user;
    $scope.show_data = show_data;
    $scope.deleteuser = deleteuser;
    $scope.deletet_user = deletet_user;

    // var myVar = setInterval(myTimer, 1000);
    var today = new Date();
    init();
    this.load = function (page) {

      mySplitter.content.load(page)
        .then(function () {
          mySplitter.left.close();
        });
    };
    function init() {
  
    }
    
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
                  find_visitcount($scope.orguid);
                  find_ward($scope.orguid);
                  mySplitter.content.load('opd.html');
              } else {
                  if (loginid == 'z') {
                      $scope.hospname = "test";
                      $scope.orguid = "5d09fb1b80256a7b271319a9";
                      // $scope.orguid = "5b6187eca03e2340f130e6fb";
                      // $scope.orguid = "59e865c8ab5f11532bab0537";
                      find_ward($scope.orguid);
                      find_visitcount($scope.orguid);

                  }
              }

          })
      } else {
          mySplitter.content.load('login.html')
      }
  }
    function saveuser(u, p) {
      console.log($scope.organize);
      if (u) {
        var muser = u.toLowerCase();
      } else {
        var muser = '';
      }
      if (p) {
        var mpass = p.toLowerCase();
      } else {
        var mpass = '';
      }
      var org = [];
      var name = [];
      for (var i = 0; i < $scope.organize.length; i++) {
        if ($scope.organize[i].checked == true) {
          org.push($scope.organize[i]._id);
          name.push($scope.organize[i].description);
        }
      }
      console.log(org);
      console.log(name);
      console.log(muser, mpass);
      if (p && u) {
        save_user(muser, mpass, org, name);
      }

      bi.muser = '';
      bi.mpassword = '';
    }
    function deleteuser(params) {
      console.log(params);
      deletet_user(params);
    }
    function opd(params, site) {
      console.log(params);
      console.log(site);
      $scope.site = site;
      $scope.orguid = params;
      console.log($scope.site, $scope.orguid);
      if (params == "569794170946a3d0d588efe6") {
        princ_opd();
      } else {
        find_visitcount($scope.orguid);
      }
    }
    function find_visitcount(params) {
      $http.post('/centrix/visitcount', {
        "visitdate": moment($scope.todaydate).format(),
        "orguid": params
      }).then(function (response) {
        console.log(response.data.data);
        if (response && response.data.data.length > 0) {
          $scope.opdvisit = response.data.data;
          var total = 0;
          for (var i = 0; i < $scope.opdvisit.length; i++) {
            total = total + $scope.opdvisit[i].count;
          }
          $scope.total = total;
          mySplitter.content.load('opd.html');

        } else {
          $scope.opdvisit = [];
        }
      });
    }
  
    function ipd(params, site) {
      mySplitter.content.load('loading.html')
      console.log(params);

      $scope.site = site;
      $scope.orguid = params;
      console.log($scope.site, $scope.orguid);
      if (params == "569794170946a3d0d588efe6") {
        princ_ipd();
      } else {
        find_ward($scope.orguid);
      }
    }
    function find_ward(params) {

      async.waterfall([
        function get1(callback) {
          $http.post('/centrix/warddetail', {
            "orguid": params
          }).then(function (response) {
            // console.log(166,response);
            if (response && response.data.data.length > 0) {
              $scope.warddetail = response.data.data;
            } else {
              $scope.warddetail = {};
            }
            // console.log(172,$scope.warddetail);
            callback();
          });



        },
        function get2(callback) {
          $http.post('/centrix/ward', {
            "orguid": params
          }).then(function (response) {
            // console.log(185,response);
            if (response && response.data.data.length > 0) {

              $scope.warddata = response.data.data;
              console.log(187, $scope.warddata);
              var ward = 0;
              for (var i = 0; i < $scope.warddata.length; i++) {
                ward = ward + $scope.warddata[i].count;
              }
              $scope.total = ward;
              // console.log(192,$scope.warddata);
              var totalbed = 0;
              for (var ii = 0; ii < $scope.warddetail.length; ii++) {
                totalbed = totalbed + $scope.warddetail[ii].bedcount;
                $scope.warddetail[ii].count = 0;
                for (var ij = 0; ij < $scope.warddata.length; ij++) {
                  if ($scope.warddata[ij].ward == $scope.warddetail[ii].wardname) {
                    $scope.warddetail[ii].count = $scope.warddata[ij].count;
                  }
                }
              }
              $scope.totalbed = totalbed;
              $scope.newwarddata = $filter("orderBy")($scope.warddetail, "displayorder");
              console.log($scope.totalbed);

            }
            callback();
          });
          // mySplitter.content.load('ipd.html');

        },

      ], function (
      ) {

      })
    }
   
    //---------------------------------
    function save_user(user, pwd, org, name) {

      var indata = {
        "user": user,
        "password": pwd,
        "org": org,
        "name": name,
      }
      $http.post('/local_json/writejson', {
        // "department": department,
        // "password": password,
        "indata": indata,
        "mfile": $scope.datafile,
      }).then(function (data) {
        // $scope.show_newtemplate = false;
        show_data();
      });
    }
    function show_data() {

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

        $scope.alluser = data.data.data;
        console.log($scope.alluser);
        // show_main();


      });
    }
    function show_orguid() {

      $http({
        method: "POST",
        url: 'local_json/readjson',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "mfile": $scope.orguid,
        })
      }).then(function (data) {

        $scope.orguid = data.data.data;
        console.log($scope.orguid);
      });
    }
    function deletet_user(params) {
      // console.log(params);
      $http.post('/local_json/deletejson', {
        "idx": params,
        "mfile": $scope.datafile,
      }).then(function (data) {
        show_data();
      });
    }

    function updatetemplate(idx, params) {
      $scope.idx = idx;
      console.log($scope.idx);

      console.log(params);
      $scope.edittp = params;
      $scope.show_edittemplate = true;
    }


    function shownewtemplate() {
      $scope.show_newtemplate = true;
    }
  });
})();
