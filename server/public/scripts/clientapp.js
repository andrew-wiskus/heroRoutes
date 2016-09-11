var myApp = angular.module("myApp", []);



myApp.controller("mainController", ["$scope", "$http", function($scope, $http) {
    console.log('mainController loaded');

    //------------------ check user/login ---------------//
    $scope.isLoggedIn = false;
    $scope.userLogin = function(email, password) {
        var userInfo = {
            email: email,
            password: password
        };

        $http.post('/login', userInfo).then(function() {


            console.log('user info sent', userInfo);
        });
    }
    $scope.userSignup = function(email, password) {
        var userInfo = {
            email: email,
            password: password
        };
        console.log('user info sent', userInfo);
        $http.post('/signup', userInfo).then(function(response) {
            console.log('hey data', response.data);
        });
        // $http({
        //     method: 'POST',
        //     url: '/signup',
        //     data: userInfo
        // }).then(function successCallback(response) {
        //     // this callback will be called asynchronously
        //     // when the response is available
        //     console.log(response);
        // }, function errorCallback(response) {
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        //     console.log(response);
        // });
    }

    //-------------------- main display --------------------//
    $scope.popup_newProject = true;
    $scope.newTask = {};
    $scope.currentfilter = "filter_today";
    $scope.displayTitle = "Todays tasks";
    $scope.newProject = {};
    $scope.userProjects = [];
    $scope.addProject = function(project) {
        console.log(project.title);
        $scope.userProjects.push(project);
        $scope.newProject = {};
        $scope.popup_newProject = true;
    }
    $scope.changeDisplay = function(filter) {
        $scope.currentfilter = filter;
        console.log(filter);
        switch (filter) {
            case "filter_inbox":
                $scope.displayTitle = "My inbox";
                break;
            case "filter_today":
                $scope.displayTitle = "Todays tasks";
                break;
            default:
                $scope.displayTitle = filter;
        }
    }
    $scope.hidePopup = function() {
        console.log('clicked hide popup');
        $scope.popup_newProject = true;
        console.log($scope.popup_newProject)
    }
    $scope.addNewProject = function() {
        console.log('clicked new project');
        $scope.popup_newProject = false;
        console.log($scope.popup_newProject)
    }

    $scope.test = function() {
        console.log("TESTING WORKS");
        $scope.newTask.projectOf = $scope.currentfilter;
        console.log($scope.newTask);
        $scope.newTask.task_title = "";
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
