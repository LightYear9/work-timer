// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic','ngRoute'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($routeProvider){
   $routeProvider
      .when('/settings',{
          url:"/settings",
          templateUrl:"settings.html"
      })
      .when('/',{
           url:'/grid.html',
           controller:'mainController',
           templateUrl:'grid.html'
      })
      .when('/reports',{
           url:'/reports.html',
           controller:'reportController',
           templateUrl:'reports.html'
      })
      .when('/grid',{
           url:'/grid.html',
           controller:'mainController',
           templateUrl:'grid.html'
      });
})

.factory('tileData',function(){
    var tile = {};
    tile.tilesList = [
            {name:'task1',sec:0,min:0,hr:0,amt:0,amount:0},
            {name:'task2',sec:0,min:0,hr:0,amt:0,amount:0},
            {name:'task3',sec:0,min:0,hr:0,amt:0,amount:0},
            {name:'task4',sec:0,min:0,hr:0,amt:0,amount:0}
          ];
    tile.num = 4;
    tile.selectedTile = null;
    tile.options = [4,6,8];
    
    tile.colors = [
      '#FA847E',
      '#B6D15D',
      '#3BA686',
      '#FFD495',
      '#AC6C82',
      '#A5F799',
      '#6B98BF',
      '#068587'
    ];
    
    return tile;
  })

.factory('timeTracker',function($interval,tileData){
    var time = {};
    time.timer = {
      sec:00,
      min:00,
      hr:00,
      totla:0
    };
    
    time.unm = {
      sec:00,
      min:00,
      hr:00,
      totla:0
    };
    
    time.timeInc = $interval(function(){
        time.timer.total++;
        time.timer.sec++;
        if(time.timer.sec == 60){
          time.timer.sec = 0;
          time.timer.min++;
          if(time.timer.min == 60){
            time.timer.hr++;
            time.timer.min = 0;
          }
        }
        if(tileData.selectedTile != null){
          tileData.tilesList[tileData.selectedTile].sec++;
          if(tileData.tilesList[tileData.selectedTile].sec == 60){
            tileData.tilesList[tileData.selectedTile].sec = 0;
            tileData.tilesList[tileData.selectedTile].min++;
            if(tileData.tilesList[tileData.selectedTile].min == 60){
              tileData.tilesList[tileData.selectedTile].hr++;  
              tileData.tilesList[tileData.selectedTile].min = 0;
            }
          }
        }
        if(tileData.selectedTile == null){
          time.unm.sec++;
          if(time.unm.sec == 60){
            time.unm.sec = 0;
            time.unm.min++;
            if(time.unm.min == 60){
              time.unm.hr++;  
              time.unm.min = 0;
            }
          }
        }
    }, 1000);
    
    return time;
})

.controller('setTile',function($scope,tileData){
      function change(){
         if(tileData.tilesList.length == 4 && $scope.num == 8)
         {
             tileData.tilesList.push({name:'task5',sec:0,min:0,hr:0,amt:0,amount:0});
             tileData.tilesList.push({name:'task6',sec:0,min:0,hr:0,amt:0,amount:0});
             tileData.tilesList.push({name:'task7',sec:0,min:0,hr:0,amt:0,amount:0});
             tileData.tilesList.push({name:'task8',sec:0,min:0,hr:0,amt:0,amount:0});
         }
         if(tileData.tilesList.length == 8 && $scope.num == 4){
             tileData.tilesList.pop();
             tileData.tilesList.pop();
             tileData.tilesList.pop();
             tileData.tilesList.pop();
          }
      }
      $scope.$watch('num',change);
})

.controller('settingsController',function($scope,tileData,timeTracker){
     $scope.tiles = tileData.tilesList;
})

.controller('mainController',function($scope,$interval,$ionicSideMenuDelegate,tileData,timeTracker){
     $scope.tiles = tileData.tilesList;
     $scope.select = tileData.selectedTile;
     $scope.color = tileData.colors;
     $scope.time = timeTracker.timer;
     $scope.selected = tileData.selected;
     
     $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
     
     $scope.clicked = function(id){
        $scope.select = id;
        if(id == tileData.selectedTile){
          selected = false;
          id = null;
        }
        if(id != null){
          selected = true;
          document.getElementById(id).style.opacity = 100;
          for(i=0; i<tileData.tilesList.length;i++){
            if(i != id)
              document.getElementById(i).style.opacity = 0.1;
          }
        }
        if(tileData.selectedTile != null){
          document.getElementById(tileData.selectedTile).style.backgroundColor = tileData.colors[tileData.selectedTile];
        }
        if(id == null){
          selected = false;
          document.getElementById(tileData.selectedTile).style.backgroundColor = tileData.colors[tileData.selectedTile];
          for(i=0; i<tileData.tilesList.length;i++){
            document.getElementById(i).style.opacity = 1;
          }
        }
        tileData.selected = selected;
        tileData.selectedTile = id;
     };

})

.controller('optionCont',function($scope,$ionicSideMenuDelegate){
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('reportController',function($scope,timeTracker,tileData){
  $scope.time = timeTracker.timer.hr+'hrs '+timeTracker.timer.min+'mins '+timeTracker.timer.sec+'sec';
  $scope.unmeasured = timeTracker.unm.hr+'hrs '+timeTracker.unm.min+'mins '+timeTracker.unm.sec+'sec';
  for(i=0; i<tileData.tilesList.length; i++){
    tileData.tilesList[i].amount = tileData.tilesList[i].amt*(tileData.tilesList[i].hr + tileData.tilesList[i].min/60 + tileData.tilesList[i].sec/3600);
  }
  $scope.tiles = tileData.tilesList;
})

.directive('direct',function(){
    return{
       require: 'ngModel'
    }
});
