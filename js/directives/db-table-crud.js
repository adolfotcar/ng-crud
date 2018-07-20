angular
	.module('App')
	.directive('dbTableCrud', function($location){
		return { 
			restrict: 'EA',
			scope: {
				limit: '@',
				page: '@',
				last_page: '@',
				backend: '@',
				tableUrl: '@',
				modalUrl: '@',
				parentId: '@', //as this directive is meant to be used as a child directive, needs watching the parent directive ID in order to only load when parent directive has finished building
				topTitle: '@',
				hideAdd: '@',
				large: '@'
			},
			templateUrl: 'app/templates/db-table-crud.html',
			controller: function($scope, $http, $translate, $filter, $rootScope, $location, Api, Dialog){

				$scope.$on('reload', function(){
					$scope.load();
				});

				$scope.$on('updateItem', function(event, field, val){
					if (typeof($scope.modal)!='undefined')
						$scope.modal[field] = val;
				});

				$scope.$on('setData', function(event, data) {
					//can't loose old ID but sometimes the data passed to this funcition has an ID
					var oldId = $scope.modal.id;
					$scope.modal = data;
					$scope.modal.id = oldId;
				});
				
				$scope.load = function(){
					$http
						.get(Api.backend+$scope.backend+'?token='+Api.getToken()+'&limit='+$scope.limit+'&page='+$scope.page, Api.httpConf)
						.success(function(response){
							$scope.data = response.data.list;
							$scope.last_page = response.data.last_page;
						})
						.catch(function(response){
							toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
						});
				};

				$scope.openItem = function(id) {
					$http
						.get(Api.backend+$scope.backend+'/'+id+'?token='+Api.getToken()+'&limit='+$scope.limit+'&page='+$scope.page, Api.httpConf)
						.success(function(response){
							$scope.modal = response.data;
							$('.modal').modal();
						})
						.catch(function(response){
							toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
						});
				}

				$scope.openNew = function() {
					$scope.modal = {};
				}
				
				$scope.search = function(){
					if ($scope.query=='') return $scope.quitSearch();
					$http
						.get(Api.backend+$scope.backend+'?token='+Api.getToken()+'&search='+$scope.query)
						.success(function(response){
							$scope.data = response.data.list;
							$scope.searching = true;
						})
						.catch(function(response){
							toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
						});
				};
				
				$scope.quitSearch = function(){
					$scope.searching = false;
					$scope.query = '';
					$scope.load();
				};
				
				$scope.paginate = function(page){
					switch (page){
						case 'first':
							$scope.page = 1;
							break;
						case 'last':
							$scope.page = $scope.last_page;
							break;
						default:
							$scope.page = $scope.page+page;
							break
					}
					if ($scope.page<1) 
						return $scope.page = 1;
					if ($scope.page>$scope.last_page) 
						return $scope.page = $scope.last_page;
					$scope.load();
				};

				$scope.save = function(form, closeModal){
					var data = form;
					data.token = Api.getToken();
					var method = 'POST';
					var url = Api.backend+$scope.backend;
					if ((typeof($scope.modal)!="undefined")&&(typeof($scope.modal.id)!="undefined")){
						method = 'PUT',
						url = url+'/'+data.id;
					}
					$http({
						'method': method,
						'url': url,
						'data': data
					})
					.success(function(response){
						if (closeModal)
							$('.modal').modal('toggle');
						$scope.modal = {};
						$scope.$broadcast('makeBlank');
						$scope.load();
						toastr.success($filter('translate')('DATA_SAVED')+'!', $filter('translate')('SUCCESS'));
					})
					.catch(function(response){
						toastr.error($filter('translate')('ERROR_MSG')+' [Status: '+response.status+']', $filter('translate')('ERROR'));
					});
				};

				$scope.saveAndAdd = function(fieldToFocus){
					$scope.save($scope.modal, false);
				};

			},
			link: function(scope){
				scope.$watch('parentId', function(value){
					if (value!='') scope.load();
				});
			}
		}
	});