var paradisApp = angular.module('paradis', []);
paradisApp.controller('paradisCtrl', function ($scope,socket,$http) {
	$scope.saisie=true;
	$scope.attache={"ligne1":"Join the community","ligne2":"Exciting news coming soon","ligne3":"Get registered to be the first informed"};
	$scope.scpStockerNom = function(){
		console.log($scope.nom, $scope.email);
		/*$http.get('/test').
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		console.log("data",data,"status",status,"headers",headers,"config",config);
		$scope.nom=data;
		$scope.attache.ligne2="bienvenu a toi "+ data.title;
		$scope.attache.ligne3="";
		$scope.saisie=false;
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log(data,status,headers,config);
		});
		socket.emit('registration',{
		"title": $scope.nom,  
		"description": $scope.email,  
		"style": $scope.email
		}, true);
		socket.on('registration', function (data) {
			$scope.saisie=false;
			$scope.attache.ligne2="bienvenu a toi "+ data.title;
			$scope.attache.ligne3="";
		});*/
		$http.get('/download',{'filename':'tumblr.png'}).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		console.log("data",data,"status",status,"headers",headers,"config",config);
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log(data,status,headers,config);
		});;
		/*var socket = io();
		socket.emit('registration',{
		  "title": $scope.nom,  
		  "description": $scope.email,  
		  "style": $scope.email
		} );*/
	};
	/*socket.on('registration', function(msg){
		$scope.$apply(function(){
			$scope.attache.ligne2="bienvenu a toi "+ msg.title;
			$scope.attache.ligne3="";
			$scope.saisie=false;
		});
	});*/
}).factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				if (callback) {
					callback.apply(socket, args);
				}
			});
			})
		}
	};
});