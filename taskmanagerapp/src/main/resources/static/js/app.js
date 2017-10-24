var taskManagerModule = angular.module('taskManagerApp', [ 'ngAnimate' ]);
taskManagerModule
		.controller(
				'taskManagerController',
				function($scope, $http) {
					var urlBase = "";
					$scope.toggle = true;
					$scope.selection = [];
					$scope.statuses = [ 'PENDING', 'COMPLETED' ];
					$http.defaults.headers.post["Content-Type"] = "application/json";
					function findAllTasks() {
						$http
								.get(urlBase + '/tasks/search/findByTaskArchived?archivedfalse=0')
								.success(
										function(data) {
											
											if (data._embedded != undefined) {
												$scope.tasks = data._embedded.tasks;
											} else {
												$scope.tasks = [];
											}
											for (var i = 0; i < $scope.tasks.length; i++) {
												
												var href = $scope.tasks[i]._links.self.href;
												var indexPos = href.indexOf("task");
												console.log("Data : "+href.substring(indexPos+6));
												data._embedded.tasks[i].id = href.substring(indexPos+6);
												if ($scope.tasks[i].taskStatus == 'COMPLETED') {
													$scope.selection.push($scope.tasks[i].taskId);
												}
											}
											$scope.taskName = "";
											$scope.taskDesc = "";											
											$scope.taskStatus = "";
											$scope.toggle = '!toggle';
										});
					}
					function findTasksByStatus(status) {
						$http
								.get(urlBase + '/tasks/search/findByTaskStatus?status='+status)
								.success(
										function(data) {
											if (data._embedded != undefined) {
												$scope.tasks = data._embedded.tasks;
											} else {
												$scope.tasks = [];
											}
											for (var i = 0; i < $scope.tasks.length; i++) {
												if ($scope.tasks[i].taskStatus == 'COMPLETED') {
													$scope.selection.push($scope.tasks[i].taskId);
												}
											}
											$scope.taskName = "";
											$scope.taskDesc = "";
											$scope.taskStatus = "";
											$scope.toggle = '!toggle';
										});
					}
					findAllTasks();
					//add a new task
					$scope.addTask = function addTask() {
						if ($scope.taskName == "" || $scope.taskDesc == ""
								|| $scope.taskStatus == "") {
							alert("Insufficient Data! Please provide values for task name, description, priortiy and status");
						} else {
							console.log(urlBase + '/tasks');
							$http.post(urlBase + '/tasks', {
								taskName : $scope.taskName,
								taskDescription : $scope.taskDesc,
								taskStatus : $scope.taskStatus
							}).success(function(data, status, headers) {
								alert("Task added");
								var newTaskUri = headers()["location"];
								findAllTasks();
							});
						}
					};
					
					$scope.cancel = function cancel() {
						findAllTasks();
					};
					
					$scope.onChangeDisplayTask = function () {
						findTasksByStatus($scope.itemSelected);
					};
					
					$scope.deleteTask = function (id) {
						$http
						.get(urlBase + '/tasks/search/deleteById?taskId='+id)
						.success(
								function(data) {
									if (data._embedded != undefined) {
										$scope.tasks = data._embedded.tasks;
									} else {
										$scope.tasks = [];
									}
									for (var i = 0; i < $scope.tasks.length; i++) {
										if ($scope.tasks[i].taskStatus == 'COMPLETED') {
											$scope.selection.push($scope.tasks[i].taskId);
										}
									}
									$scope.taskName = "";
									$scope.taskDesc = "";											
									$scope.taskStatus = "";
									$scope.toggle = '!toggle';
									
									findAllTasks();
								});
					};
					
					$scope.toggleSelection = function toggleSelection(taskUri) {
						var idx = $scope.selection.indexOf(taskUri);

						if (idx > -1) {
							$http.patch(taskUri, {
								taskStatus : 'PENDING'
							}).success(function(data) {
								alert("Task unmarked");
								findAllTasks();
							});
							$scope.selection.splice(idx, 1);
						}

						else {
							$http.patch(taskUri, {
								taskStatus : 'COMPLETED'
							}).success(function(data) {
								alert("Task marked completed");
								findAllTasks();
							});
							$scope.selection.push(taskUri);
						}
					};
					// Archive Completed Tasks
					$scope.archiveTasks = function archiveTasks() {
						$scope.selection.forEach(function(taskUri) {
							if (taskUri != undefined) {
								$http.patch(taskUri, {
									taskArchived : 1
								});
							}
						});
						alert("Successfully Archived");
						console.log("It's risky to run this without confirming all the patches are done. when.js is great for that");
						findAllTasks();
					};
				});
//Angularjs Directive for confirm dialog box
taskManagerModule.directive('ngConfirmClick', [ function() {
	return {
		link : function(scope, element, attr) {
			var msg = attr.ngConfirmClick || "Are you sure?";
			var clickAction = attr.confirmedClick;
			element.bind('click', function(event) {
				if (window.confirm(msg)) {
					scope.$eval(clickAction);
				}
			});
		}
	};
} ]);