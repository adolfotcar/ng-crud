angular
	.module('App')
	.directive('dbForm', function(){
		return {
			restrict: 'EA',
			scope: {
				backend: '@',
				idName: '@',
				formUrl: '@',
				editUrl: '@',
				mainPermission: '@',
				reload: '@',
				forceLoad: '@',
			},
			templateUrl: 'app/templates/db-form.html',
			controller: function($scope, $http, $routeParams, $filter, $location, $rootScope, Api){
				//for date-ui
				$scope.dateOptions = {
					minDate: null,
					maxDate: null
				};

				//a child directive sends this signal to update a field on the form
				$scope.$on('updateItem', function(event, field, val){
					$scope.data[field] = val;
				});

				//verifiy if user can access a certain URL with a specified METHOD
				$scope.verifyPermission = function(url, method){
					return $rootScope.verifyPermission(url, method);
				}

				//if the requested URL has an ID, means it's being edited
				$scope.editing = $routeParams[$scope.idName];
				var url = Api.backend+$scope.backend+$scope.editing+'?token='+Api.getToken();
				//if force-load attribute is true, then needs requesting the CREATE method to the API
				if ($scope.forceLoad)
					url = Api.backend+$scope.backend+'create/?token='+Api.getToken();
				
				$scope.load = function(){
					$scope.token = Api.getToken();
					//clears data before loading from the backend
					$scope.data = {};
					//if in edit mode or force-load then loads the data
					if ($scope.editing || $scope.forceLoad){
						$http
							.get(url)
							.success(function(response){
								$scope.data = response.data;
							})
							.catch(function(response){
								toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
							});
					}
				};
				
				$scope.save = function(form){
					//data is the form
					var data = form;
					data.token = Api.getToken();
					//method is POST unless editing, then it'll change to PUT and add the ID to the URL bellow
					var method = 'POST';
					var url = Api.backend+$scope.backend;
					if ($scope.editing){
						method = 'PUT',
						url = url+data.id;
					}
					$http({
						'method': method,
						'url': url,
						'data': data
					})
					.success(function(response){
						$scope.data = response.data;
						//in some cases will be necessary reload the entire user data
						if ($scope.reload) $rootScope.user.reload();
						//if not editing, means it's a new registry, so needs being redirected to the new URL after saving data
						if (!$scope.editing)
							$location.path($scope.editUrl+response.data.id);
						toastr.success($filter('translate')('DATA_SAVED')+'!', $filter('translate')('SUCCESS'));
					})
					.catch(function(response){
						toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
					});
				};
			},
			link: function(scope){
				scope.load();
			}
		};
	});