angular
	.module('App')
	.provider('Api', function ApiProvider(){
		//this is the login token, do not confuse with the appToken
		var token = localStorage.token || '0';

		return {
			$get: function (){
				return {
					'backend': 'location',
					//after a successful login stores the token
					setToken: function (value){
						localStorage.token = value;
						token = value;
					},
					//when logging out then needs to clear the token from storage
					removeToken: function(){
						token = '0';
						localStorage.removeItem('token');
					},
					getToken: function(){
						return token;
					}
				};
			}
		};
	});