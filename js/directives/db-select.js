angular
	.module('App')
	.directive('dbSelect', function(){
		return {
			restrict: 'EA',
			scope: {
				backend: '@', //URL of the backend, it will be appended to the backend in the Api
				idName: '@', //when opening an item this will be ID
				name: '@', //when opening an item this will be the label
				fieldBind: '@', //field in the parent directive which will be bound to this directive
				textPlaceholder: '@' //placeholder
			},
			templateUrl: 'app/templates/db-select.html',
			controller: function($scope, $http, Api){
				//this should be broadcasted from the parent directive if needed to make the select empty
				$scope.$on('makeBlank', function(event){
					$scope.select = {};
					$scope.data = {};
					$scope.idName = $scope.name = '';
					$scope.options = [{'id': '', 'name': ''}];
				});

				$scope.search = function(search){
					if (search) {
						$http({
							method: 'get',
							url: Api.backend+$scope.backend+'?token='+Api.getToken()+'&search='+search
						})
						.success(function(response){
							if (response.data) {
								var list = response.data.list;
								//it accepts a list from the backend containing elements in the following formats:
								//{id: 1, name: 'A'} or
								//{id:1, title: 'A'}
								angular.forEach(list, function(item){
									item.name = item.name ? item.name : item.title;
								});
								$scope.options = response.data.list;
							}
						});
					}
				};

				$scope.selected = function(id) {
					//emits the signal to the parent directive that it must update the value of the bound field
					$scope.$emit('updateItem', $scope.fieldBind, id);
					angular.forEach($scope.options, function(item){
						if (item.id==id) {
							$scope.data = item;
							return; //skipping foreach once the element is found
						}
					});
					//each option can be an element with various attributes
					//and sometimes this directive is responsible for loading all the information into the form (which is the select parent directive)
					//sending the signal to the parent directive (the form) to update the data
					$scope.$emit('setData', $scope.data);
				}
			},
			link: function(scope){
				//as the name most likely will be an angular variable, it may take a while until it's ready...
				//so keeps and eye on the name until it has a value, and when it gets that value creates the array of options with only one element
				scope.$watch('name', function(value){
					if (value!='') {
						scope.select = {};
						scope.options = [{'id': scope.idName, 'name': scope.name}];
						scope.select.selected = scope.options[0];
					}
				});
			}
		};
	});