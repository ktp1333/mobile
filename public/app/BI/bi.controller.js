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
  app.controller("biController", function (
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
    $scope.princ_opd = princ_opd;
    $scope.find_ward = find_ward;
    $scope.ipd = ipd;
    $scope.princ_ipd = princ_ipd;
    $scope.saveuser = saveuser;
    $scope.save_user = save_user;
    $scope.show_data = show_data;
    $scope.deleteuser = deleteuser;
    $scope.deletet_user = deletet_user;
    $scope.datafile = 'user.json';
    $scope.find_org = find_org;
    $scope.find_org_byorg = find_org_byorg;
    $scope.allrevenue = allrevenue;
    $scope.find_revenue = find_revenue;
    // $scope.find_visithour = find_visithour;
    // $scope.find_ward = find_ward;
    // $scope.find_depart = find_depart;
    // $scope.find_opddaily = find_opddaily;
    // $scope.find_admit = find_admit;
    $scope.revenue_chart = revenue_chart;
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
      // $scope.password = 'z';
      show_orguid();
      // $http.post('/centrix/organize', {
      // }).then(function (response) {

      //   if (response && response.data.data.length > 0) {
      //     $scope.organize = response.data.data;
      //     console.log($scope.organize);
      //     // mySplitter.content.load('opd.html');

      //   } else {
      //     $scope.organize = [];
      //   }
      // });
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
      });
      // $scope.orguid_psuv = '59e865c8ab5f11532bab0537';
      // $scope.orguid_pnp = '5b6187eca03e2340f130e6fb';
      // $scope.orguid_plpn = '5bebb874f649ccfbf0865c49';
      // $scope.orguid_putd = '5bf37ed6b304f66fb4c5c560';
      // $scope.orguid_pch = '5ad9ac20c3e29ccd1dc35eb0';
      // $scope.orguid_puth = '5bf38579b304f66fb4c5f3fc';
      // $scope.orguid_psv = '5d09fb1b80256a7b271319a9';
      // $scope.orguid_pcpn = '5e1ecd3eae73b9a94c2636b2';
      // $scope.orguid_pubn = '5f07f362f7bc4061b4fdc1b7';
      // $scope.orguid_psk = '5f07f3c0f7bc4061b4fdc1bc';
    }
    function find_org(params) {
      $http.post('/centrix/organize', {
        morg: params,
      }).then(function (response) {

        if (response && response.data.data.length > 0) {
          $scope.organize = response.data.data;
          console.log($scope.organize);
          // mySplitter.content.load('opd.html');

        } else {
          $scope.organize = [];
        }
      });
    }
    function find_org_byorg(params) {
      $http.post('/centrix/organize_byorg', {
      }).then(function (response) {

        if (response && response.data.data.length > 0) {
          $scope.organize = response.data.data;
          console.log('$scope.organize',$scope.organize);
          // mySplitter.content.load('opd.html');

        } else {
          $scope.organize = [];
        }
      });
    }
    function login(params) {
      // console.log(params);
      if (params == 'Admin@123') {
        find_org("all hospitals");
        show_data();
        mySplitter.content.load('admin.html');
      } else {
        for (var i = 0; i < $scope.user.length; i++) {
          if (params.toLowerCase() == ($scope.user[i].password).toLowerCase()) {

            console.log($scope.user[i].name);
            find_org($scope.user[i].name);
            // if ($scope.user[i].org=="569794170946a3d0d588efe6") {
            //    find_org(morg);
            // } else {
            //   // var morguid =[];
            //   // var res = morg.split(",");


            //   // for (var ii = 0; ii < res.length; ii++) {
            //   //   console.log(ObjectId(res[ii]));
            //   //     // morguid.push();

            //   // }
            //   // find_org_byorg();
            // }

            mySplitter.content.load('menuopd.html');
          } else {

          }
        }
      }

      // if (params == 'z') {
      //   mySplitter.content.load('menuopd.html');
      // } else {

      // }
      // mySplitter.content.load('menuopd.html');
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
    function princ_opd() {
      $http.post('/centrix/opd_princ', {
        "visitdate": moment($scope.todaydate).format(),
      }).then(function (response) {
        console.log(response.data.data);
        if (response && response.data.data.length > 0) {
          $scope.opdall = response.data.data;
          var total = 0;
          for (var i = 0; i < $scope.opdall.length; i++) {
            total = total + $scope.opdall[i].count;
          }
          $scope.total = total;
          mySplitter.content.load('opdall.html');

        } else {
          $scope.opdall = [];
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
          mySplitter.content.load('ipd.html');

        },

      ], function (
      ) {

      })
    }
    function princ_ipd(params) {
      $http.post('/centrix/ipd_princ', {
        // "visitdate": moment($scope.todaydate).format(),
      }).then(function (response) {
        console.log(response.data.data);
        if (response && response.data.data.length > 0) {
          $scope.ipdall = response.data.data;
          var total = 0;
          for (var i = 0; i < $scope.ipdall.length; i++) {
            total = total + $scope.ipdall[i].count;
          }
          $scope.total = total;
          mySplitter.content.load('ipdall.html');

        } else {
          $scope.ipdall = [];
        }
      });
    }
    //-------------------
    function allrevenue(params, site) {
      mySplitter.content.load('loading.html')
      console.log(params);
      console.log(site);
      $scope.site = site;
      $scope.orguid = params;
      // $scope.mlabel = moment(mdate).format('MMMM YYYY')
      // $scope.datetime = moment(mdate).format('DD/MM/YYYY  -  HH:mm')
      async.waterfall([
        function get1(callback) {
          find_revenue(today, $scope.orguid);
          callback();
        },
        // function get2(callback) {
        //   find_visithour(mdate, $scope.orguid);
        //   callback();
        // },
        // function get23(callback) {
        //   find_ward($scope.orguid);
        //   callback();
        // },
        // function get24(callback) {
        //   find_depart(mdate, $scope.orguid);
        //   callback();
        // },
        // function get25(callback) {
        //   find_opddaily(mdate, $scope.orguid);
        //   callback();
        // },
        // function get26(callback) {
        //   find_admit24h(mdate, $scope.orguid);
        //   callback();
        // },
        // function get27(callback) {
        //   find_opdvisit(mdate, $scope.orguid);
        //   callback();
        // },


      ], function (
      ) {
        // console.log($scope.titlelabel);
        // find_admit(mdate, $scope.orguid);


      })
    }
    function find_revenue(mdate, orguid) {
      $http.post('/centrix/revenuesplit', {
        "visitdate": moment(mdate).format(),
        "orguid": orguid
      }).then(function (response) {
        console.log(response.data.data);
        $scope.revenue=response.data.data;
        mySplitter.content.load('revenue.html')
        // revenue_chart(response.data.data);
      });
    }
    function revenue_chart(result) {
      result = $filter('orderBy')(result, 'tdate');
      // console.log(result);
      var categories = [];
      for (var j = 0; j < result.length; j++) {
        categories.push({
          total: (parseInt(result[j].OPD) + parseInt(result[j].IPD)),
          rev_opd: (parseInt(result[j].OPD)),
          rev_ipd: (parseInt(result[j].IPD)),
          tdate: result[j]._id.tdate
        })
      }
      console.log(categories);

      var chart = c3.generate({
        bindto: '#rev_chart',
        size: {
          height: 240,
          width: 600
        },
        padding: {
          top: 10,
          right: 80,
          bottom: 10,
          left: 50,
        },
        data: {
          json: categories,

          keys: {
            value: ['rev_opd', 'rev_ipd', 'total'],
          },
          labels: true,
          types: {
            total: 'area-spline',
            rev_opd: 'bar',
            rev_ipd: 'bar'
          },

          // fillColor: gradient
        },
        color: {
          pattern: ['#2ca9ba', '#363FBC', '#B73540', '#B73540']
          // pattern: ['url(#gradient)', '#2ca9ba', '#B73540', '#B73540']
        },
        title: {
          text: 'revenue'
        },
        legend: {
          show: true
        },
        axis: {
          // rotated: true,
          x: {

            type: 'category',
            position: 'inner-center',
            // json: categories,
            // categories: ['period'],
            categories: categories.map(function (cat) { return cat.tdate; }),
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
            // position: 'inner-center',

            tick: {

              rotate: 45,
              multiline: false,
              format: d3.format(".2s")
              //            format: d3.format(",")
            }
          }

        },
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
