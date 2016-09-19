var SHOWCONSOLELOG_prettyTaskList = false;



var myApp = angular.module("myApp", ["firebase"]);

var objectDragged = {}
myApp.directive('draggable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].addEventListener('dragstart', scope.handleDragStart, false);
            element[0].addEventListener('dragend', scope.handleDragEnd, false);
        }
    }
});

myApp.directive('droppable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].addEventListener('drop', scope.handleDrop, false);
            element[0].addEventListener('dragover', scope.handleDragOver, false);
            element[0].addEventListener('dragleave', scope.handleDragLeave, false);
        }
    }
});
// function allowDrop(ev) {
//     ev.preventDefault();
// }
//
// function drag(ev) {
//     // ev.dataTransfer.setData("text", ev.target.id);
//     ev.dataTransfer.setData("task_id", ev.target.id);
//     console.log(ev.dataTransfer.getData("task_id"));
// }
//
// function drop(ev) {
//   console.log('TODO: add boolean to new columns: in_today/in_sprint/in_folder', ev.dataTransfer.getData("task_id"))
//     // ev.preventDefault();
//     // var data = ev.dataTransfer.getData("text");
//     // ev.target.appendChild(document.getElementById(data));
//     // console.log('data');
// }



myApp.controller("mainController", ["$scope", "$http", "$firebaseObject", "$firebaseAuth", function($scope, $http, $firebaseObject, $firebaseAuth) {
    console.log('mainController loaded');

    $scope.currentScrumCount = 0;
    $scope.currentFilterScrumCount = 0;
    $scope.currrentScumComplete = 0;
    // $scope.dragState = 'draggingOver test'
    $scope.sprint_view = false;
    $scope.drop_id = 'drop_none';
    $scope.sprintSetup = false;
    $scope.sprintSetup_itemDropped = false;
    $scope.currentSprintTasks = [];
    $scope.currentlySprinting = false;

    $scope.endSprintUnfinished = function(sprintList) {
        console.log('LIST OF SPRINTS:', sprintList);
        $scope.currentlySprinting = false;
    }
    $scope.startSprint = function() {
        console.log('STARTING SPRINT!!');
        console.log('CURRENT SPRINT TASKS: ', $scope.currentSprintTasks)
        $scope.currentlySprinting = true;
    }

    function sprintDisplayTasks(user) {
        $scope.currentSprintTasks = [];
        console.log('sprint ids', $scope.currentSprintIDs)
        var tempArray = [];
        user.taskList.forEach(function(task) {
            // console.log(task.id);
            var exlude = false;
            $scope.currentSprintIDs.forEach(function(id) {
                if (id == task.id) {
                    exlude = true;
                }
            });
            if (!exlude) {
                tempArray.push(task);
            } else {
                $scope.currentSprintTasks.push(task);
            }
        });

        var tempCount = 0;
        $scope.currentSprintTasks.forEach(function(task){
          tempCount += task.scrum
        });
        $scope.currentScrumCount = tempCount

        return tempArray;
    }
    var sprintViewHistory = [false, false]
    $scope.currentSprintIDs = [];

    $scope.clickedSprintTaskX = function(taskid) {
        console.log('clicked x on', taskid);
        console.log('current sprints', $scope.currentSprintIDs);

        var tempSprintIDList = _.filter($scope.currentSprintIDs, function(taskInSprint) {
            return taskInSprint != taskid;
        });
        // => [2, 4, 6]


        var tempSprintTaskList = []
        tempSprintIDList.forEach(function(id) {
            $scope.currentSprintTasks.forEach(function(task) {
                if (task.id == id) {
                    tempSprintTaskList.push(task);
                }
            });

            var tempCount = 0;
            $scope.currentSprintTasks.forEach(function(task){
              tempCount += task.scrum
            });
            $scope.currentScrumCount = tempCount
        });

        //----------SPRINTING: removes deleted task from console view
        console.log('currentTasks:', $scope.currentSprintTasks);
        console.log('temp id list: ', tempSprintIDList);
        console.log('temp task list: ', tempSprintTaskList);

        $scope.currentSprintTasks = tempSprintTaskList;
        $scope.currentSprintIDs = tempSprintIDList;
        console.log($scope.currentSprintTasks);

        var tempCount = 0;
        $scope.currentSprintTasks.forEach(function(task){
          tempCount += task.scrum
        });
        $scope.currentScrumCount = tempCount

        updateList($scope.currentListView);
        //----------SPRINTING: updates sprint draggable list with deleted task

    }

    $scope.handleDragStart = function(e) {
        console.log($scope.drop_id);
        this.style.opacity = '0.4';
        e.dataTransfer.setData('task_id', this.getAttribute('id'));
        // console.log('DRAG START:', this.getAttribute('id'));
    };

    $scope.handleDragLeave = function(e) {
        console.log('LEFT DRAG AREA');
        console.log('THIS:', this);
        console.log('EVENT:', e);
        this.style.opacity = 1.0;

        if (this.getAttribute('class') == 'projectFilter ng-scope') {
            this.style.background = 'white';
        }
        this.style.opacity = '1.0';
    }
    $scope.handleDragEnd = function(e) {
        this.style.opacity = '1.0';
        $scope.$apply(function() {
            // $scope.dragState = 'notDraggingOver test'
        });
        //consoleDiv.style.opacity = '1.0'
    };

    $scope.handleDrop = function(e) {
        // console.log('WTF?!!?!?@#?!#?!@?#!@#', this);
        var div = this;
        if (this.getAttribute('class') == 'projectFilter ng-scope') {

            this.style.background = 'white';
            this.style.opacity = '1.0'
            console.log("TODO: put request to change project_of depending on task")
            console.log("TODO: update task list to show item has moved(ie delete that shit)")

            // })
        }
        if ($scope.drop_id == 'drop_sprint') {
            e.preventDefault();
            e.stopPropagation();
            var dataText = e.dataTransfer.getData('task_id');

              this.style.background = 'none';
              this.style.opacity = '1.0';
                // console.log('DROPPED:', dataText);

            if (this.getAttribute('id') == 'drop_sprint') {
                $scope.$apply(function() {
                    $scope.currentSprintIDs.push(dataText)
                    $scope.sprintSetup = false;
                    $scope.sprintSetup_itemDropped = true;
                    $scope.currentTaskDisplay = sprintDisplayTasks($scope.userData);

                    var tempCount = 0;
                    $scope.currentSprintTasks.forEach(function(task){
                      tempCount += task.scrum
                    });
                    $scope.currentScrumCount = tempCount
                });

                // console.log('dropped new task into SPRINT, $scope.currentSprintIDs:', $scope.currentSprintIDs)

            }
        }

        // console.log(this.getAttribute('id'));
    };

    $scope.handleDragOver = function(e) {
        console.log('DRAGGING OVER DROPPABLE!!!!');
        if (this.getAttribute('class') == 'projectFilter ng-scope') {
            this.style.background = 'rgba(0, 0, 0, 0.2)';
        }
        if (this.id == 'drop_sprint') {
            this.style.opacity = '0.5';
            this.style.background = 'rgba(0,0,0,0.3)'
        }

        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
        $scope.$apply(function() {
            // $scope.dragState = 'draggingOver test'
        });

        return false;

    };



    // var drag = function(ev, task) {
    // ev.dataTransfer.setData("text", ev.target.id);
    // console.log(ev)
    // objectDragged = task
    // }

    $scope.test = 'not working'


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
        if (SHOWCONSOLELOG_prettyTaskList) {
            console.log('--------------------------------------------------------------------')
            console.log('                            TASK LIST     ')
            console.log('                     ', email)
        }
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
                    if (SHOWCONSOLELOG_prettyTaskList) {
                        console.log('--------------------------------------------------------------------')
                        console.log('-id     | ', task.id)
                        console.log('-title  | ', task.title);
                        console.log('-project| ', task.project_of);
                        console.log('-email  | ', task.user_email);
                    } else {
                        console.log("GRABBING TASK DATA FROM DB");
                    }
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
            if (currentFilter != 'all') {
                updateList(currentFilter);
                $scope.currentListview = currentfilter;
            } else {
                // sortByProject
                updateList('all');
                $scope.currentListView = 'all';
                // $scope.currentTaskDisplay = sortByProject($scope.userData);

            }

            // console.log('HEY!');
            sortByProject($scope.userData);
            // console.log(testVar);

            // {1: [1.3], 2: [2.1, 2.4]}
        });


    }
    getTaskData('all');

    function sortByProject(user) {
        // // console.log($scope.currentListView)
        // if ($scope.currentListView != 'sprint'){
        //   $scope.sprintSetup = false;
        //   $scope.sprintSetup_itemDropped = false;
        // } else {
        //   $scope.sprintSetup_itemDropped = true;
        // }
        // var tempArray = [];
        // user.taskList.forEach(function(task) {
        //     if (task.project_of == null) {
        //         tempArray.push(task);
        //     }
        // });
        // user.projectList.forEach(function(project) {
        //     user.taskList.forEach(function(task) {
        //         if (task.project_of == project) {
        //             tempArray.push(task);
        //         }
        //     })
        // });
        //
        // // tempArray.forEach(function(task){
        // //   console.log(task.project_of);
        // // })
        // return tempArray;

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
    $scope.clickedHistory();


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
        getTaskData($scope.currentListView);
    }


    $scope.currentTaskDisplay = [];
    $scope.currentListView = 'all';
    $scope.clickedFilter = function(filter) {
        $scope.currentListView = filter;
        updateList(filter);
        if (filter != 'sprint') {
            $scope.sprint_view = false;
        } else {
            $scope.sprint_view = true;
        }
    }


    $scope.currentTaskDisplay = [];
    var updateList = function(filter) {
        console.log('-updating list to current filter')
        if (filter == 'all') {

            // $scope.sprintSetup = false;
            // $scope.sprintSetup_itemDropped = false;
            $scope.currentTaskDisplay = $scope.userData.taskList
            $scope.currentListView = 'all';

            var tempCount = 0;
            var tempCompletedCount = 0;
            $scope.currentTaskDisplay.forEach(function(task){
              tempCount += task.scrum
              console.log(task.project_of);
              var counter = 0
              $scope.userData.projectList.forEach(function(project){
                if (task.project_of == project){
                  task.bgColor = 'rgb('+counter+','+counter+','+counter+')'
                }
                counter += 20;
              }) ;
              if (task.is_complete){
                tempCompletedCount += task.scrum;
              }
            });


            $scope.currentFilterScrumCount = tempCount;
            $scope.currrentScumComplete = tempCount - tempCompletedCount;


        } else if (filter == 'sprint') {
            $scope.drop_id = 'drop_sprint';

            if (sprintDisplayTasks($scope.userData).length == $scope.userData.taskList.length) {
                console.log('nothing in currentSprintTasks');
                // $scope.currentTaskDisplay = sprintDisplayTasks($scope.userData)
                $scope.sprintSetup = true;
                $scope.currentTaskDisplay = $scope.userData.taskList;
            } else {
                console.log('items are in currentSprintTasks');
                $scope.currentTaskDisplay = sprintDisplayTasks($scope.userData)
                $scope.sprintSetup = false;
                $scope.sprintSetup_itemDropped = true;

                var tempCount = 0;
                $scope.currentSprintTasks.forEach(function(task){
                  tempCount += task.scrum
                });
                $scope.currentScrumCount = tempCount

            }

        } else {
            $scope.drop_id = "drop_" + filter
            var tempArray = [];
            $scope.userData.taskList.forEach(function(task) {
                // console.log(task);
                if (task.project_of == filter) {
                    // console.log(task.project_of);
                    tempArray.push(task);
                }

            });;

            $scope.currentTaskDisplay = tempArray;
            var tempCount = 0;
            var tempCompletedCount = 0;
            $scope.currentTaskDisplay.forEach(function(task){
              tempCount += task.scrum

              if (task.is_complete){
                tempCompletedCount += task.scrum;
              }
            });
            $scope.currentFilterScrumCount = tempCount;
            $scope.currrentScumComplete = tempCount - tempCompletedCount;
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
            console.log('1. ADDING TASK OBJECT TO DB');

            //---------checks for #x > adds to scrum
            var fullLength = taskObject.task.length;
            var stringEnd = taskObject.task[fullLength - 2] + taskObject.task[fullLength - 1];

            if (stringEnd[0] == '#') {
                taskObject.task = taskObject.task.substring(0, fullLength - 2);
                taskObject.scrum = stringEnd[1];
            } else {
                taskObject.scrum = 0;
            };

            console.log('taskObject:', taskObject);
            $http.post('/userdata/task', taskObject).then(function(data) {
                // console.log('task complete, data back?: ', data)
                getTaskData($scope.currentListView);
            });
            $scope.newTask = {};

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
