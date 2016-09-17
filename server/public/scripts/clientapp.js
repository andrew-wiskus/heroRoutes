var myApp = angular.module("myApp", ["firebase"]);

    var objectDragged = {}

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        // ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("task_id", ev.target.id);
        console.log(ev.dataTransfer.getData("task_id"));
    }

    function drop(ev) {
      console.log('TODO: add boolean to new columns: in_today/in_sprint/in_folder', ev.dataTransfer.getData("task_id"))
        // ev.preventDefault();
        // var data = ev.dataTransfer.getData("text");
        // ev.target.appendChild(document.getElementById(data));
        // console.log('data');
    }



myApp.controller("mainController", ["$scope", "$http", "$firebaseObject", "$firebaseAuth", function($scope, $http, $firebaseObject, $firebaseAuth) {
    console.log('mainController loaded');

    // var drag = function(ev, task) {
    // ev.dataTransfer.setData("text", ev.target.id);
    // console.log(ev)
    // objectDragged = task
    // }
    $scope.test = objectDragged;


    //------------------ init page ---------------------//

    $scope.userData = {
        username: 'testuser',
        email: 'testemail@email.com',
        taskList: [],
        projectList: []
    };


    function getTaskData(currentFilter) {
        var username = 'Wizzy+Dream'
        var email = 'andrewwiskus@gmail.com'
        console.log('--------------------------------------------------------------------')
        console.log('                            TASK LIST     ')
        console.log('                     ', email)

        $http.get('/userData/task', {
            params: {
                email: email
            }
        }).then(function(response) {

            $scope.userData.taskList = [];
            var tempProjectArray = [];
            $scope.userData.username = "Wizzy+Dream"
            var organizedIds = [];
            // var organizedObject = _.indexBy(response.data, 'id');
            //



            response.data.forEach(function(task) {
                if (task.title != 'o58j6ckq') {
                    console.log('--------------------------------------------------------------------')
                    console.log('-id     | ', task.id)
                    console.log('-title  | ', task.title);
                    console.log('-project| ', task.project_of);
                    console.log('-email  | ', task.user_email);
                    $scope.userData.taskList.push(task);

                }
                if (task.project_of !== null) {
                    tempProjectArray.push(task.project_of);
                }
            });
            $scope.userData.projectList = _.uniq(tempProjectArray);
            $scope.userData.email = response.data[0].user_email;
            // $scope.userData.user_name;
            console.log('Current User Data: ', $scope.userData);
            if (currentFilter != 'all'){
              updateList(currentFilter);
              $scope.currentListview = currentfilter;
            } else {
              // sortByProject
              $scope.currentListView = 'all';
              $scope.currentTaskDisplay = sortByProject($scope.userData);

            }

            console.log('HEY!');
            sortByProject($scope.userData);
            // console.log(testVar);

          // {1: [1.3], 2: [2.1, 2.4]}
        });

    }
    getTaskData('all');
    function sortByProject(user){
      var tempArray = [];
      user.taskList.forEach(function(task){
        if (task.project_of == null){
          tempArray.push(task);
        }
      });
      user.projectList.forEach(function(project){
        user.taskList.forEach(function(task){
          if (task.project_of == project){
            tempArray.push(task);
          }
        })
      });

      // tempArray.forEach(function(task){
      //   console.log(task.project_of);
      // })
      return tempArray;

    }


    //------------------- click functions -------------------//
    $scope.currentListView = 'all'
    $scope.historyIsShowing = true;
    $scope.is_complete = 'is_complete'
    $scope.clickedHistory = function() {
        var history = $scope.historyIsShowing;
        $scope.historyIsShowing = !history;

        if (history) {
            $scope.is_complete = 'hiddenHistory'
        } else {
            $scope.is_complete = 'is_complete'
        }
    }


    $scope.showEdits = false;
    $scope.clickedEdit = function() {
        var editShowing = $scope.showEdits;
        $scope.showEdits = !editShowing;
        // $scope.showEdits = true;

    }

    $scope.clickedDeleteButton = function(task) {
        console.log('deleteing', task.id);
        $http.delete('/userdata/task/' + task.id).then(function(response) {
            // getTaskData($scope.currentListView);


        });
        //TODO: THIS DOESNT FEEL RIGHT.. RACE PROB??
        getTaskData('all');
    }


    $scope.currentTaskDisplay = [];
    $scope.currentListView = 'all';
    $scope.clickedFilter = function(filter) {
        $scope.currentListView = filter;
        updateList(filter);
    }


    $scope.currentTaskDisplay = [];
    var updateList = function(filter) {
      console.log('-updating list to current filter')
        if (filter == 'all') {
            $scope.currentTaskDisplay = sortByProject($scope.userData);
            $scope.currentListView = 'all';


        } else {
            var tempArray = [];
            $scope.userData.taskList.forEach(function(task) {
                // console.log(task);
                if (task.project_of == filter) {
                    // console.log(task.project_of);
                    tempArray.push(task);
                }

            });;


            $scope.currentTaskDisplay = tempArray;
        }
    }



    //------------------ check user/login ---------------//
    $scope.isLoggedIn = true;


    //-------------------- console display -------------------//
    $scope.newTask = {};
    $scope.addTask = function(taskObject) {

            //TODO: FIND PROJECT OF
            //FUTURE: ADD SCRUM POINTS
            if (taskObject.project_of === undefined) {
                if ($scope.currentListView == 'all') {
                    taskObject.project_of = null;
                } else {

                    taskObject.project_of = $scope.currentListView;
                }
            }
            taskObject.user_email = $scope.userData.email;

            //TODO: POST REQUEST
            console.log('works?', taskObject)
            $http.post('/userdata/task', taskObject).then(function(data) {
                // console.log('task complete, data back?: ', data)
                getTaskData($scope.currentListView);
            });
            $scope.newTask = {};
            console.log('adding to db:', taskObject);
        }
        //-------------------- tasklist display --------------------//


    $scope.clickedTaskCheckbox = function(task) {
        console.log('complted', task);
        $http.put('/userdata/task/' + task.id, task).then(function() {
            console.log('put went through');
            getTaskData($scope.currentListView);
        });
    }


    $scope.newProject = {};
    $scope.addProject = function(projectObject) {
        console.log(projectObject);
        var object = {
            project_of: projectObject.title,
            user_email: $scope.userData.email,
            task: 'o58j6ckq'

        }
        console.log('ADDING THIS ', object)
        $scope.addTask(object);
        $scope.popup_newProject = true;
        $scope.newProject = {};
    }




    //--------------------project display-----------------//

    // $scope.currentUser.projectList;

    //--------------------pop up display------------------//
    $scope.addProject_popUp = function() {
        console.log('popup pushed')
        $scope.popup_newProject = false;
    }
    $scope.hidePopup = function() {
        $scope.popup_newProject = true;
    }
    $scope.popup_newProject = true;
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
