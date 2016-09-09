var myApp =  angular.module("myApp", []);



myApp.controller("mainController", ["$scope", function($scope){
  console.log('controller loaded');
  $scope.popup_newProject = true;

  $scope.hidePopup = function(){
    console.log('clicked hide popup');
    $scope.popup_newProject = true;
    console.log($scope.popup_newProject)
  }
  $scope.addNewProject = function(){
    console.log('clicked new project');
    $scope.popup_newProject = false;
    console.log($scope.popup_newProject)
  }

}]);









//
// myApp.config(["$routeProvider", function($routeProvider){
//   $routeProvider.
//     when("/storm",{
//       templateUrl: "/views/partials/stormInfo.html",
//       controller: "stormController"
//     }).
//     when("/magneto",{
//       templateUrl: "/views/partials/magnetoInfo.html",
//       controller: "magnetoController"
//     }).
//     when("/pyro",{
//       templateUrl: "/views/partials/pyroInfo.html",
//       controller: "pyroController"
//     }).
//     otherwise({
//       redirectTo: "/storm"
//     });
// }]);
