angular
	.module('App')
	.directive('dbSelect', function(){
		return {
			restrict: 'EA',
			scope: {
				backend: '@',
				idName: '@',
				name: '@',
				backend: '@',
				fieldBind: '@',
				textPlaceholder: '@'
			},
			templateUrl: 'app/templates/db-select.html',
			controller: function($scope, $http, Api){

				//sometimes the parent directive needs making the values of this directive completely blank
				$scope.$on('makeBlank', function(event){
					$scope.select = {};
					$scope.data = {};
					$scope.options = [{'id': '', 'name': ''}];
					$scope.select.selected = $scope.options[0];
					$scope.select.selected.name = "";
					$scope.$$childTail.select.selected = {};
				});

				$scope.search = function(search){
					if (search) {
						$http({
							method: 'get',
							url: Api.backend+$scope.backend+'?token='+Api.getToken()+'&search='+search
						})
						.success(function(response){
							//the desired response must be a json element called list
							if (response.data) {
								var list = response.data.list;
								angular.forEach(list, function(item){
									//in case the backend sends title instead of name
									item.name = item.name? item.name : item.title;
								});
								$scope.options = response.data.list;
							}
						});
					}
				};

				$scope.selected = function(id) {
					//after selecting an item, sends the updateItem call to the parent directive
					$scope.$emit('updateItem', $scope.fieldBind, id);
					angular.forEach($scope.options, function(item){
						if (item.id==id) $scope.data = item;
					});
					$scope.$emit('setData', $scope.data);
				}
			},
			link: function(scope){
				//as it may take a while until the directive is built, keeps watching the value of name...when it's filled then it creates options with a single item and makes it the selected one
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