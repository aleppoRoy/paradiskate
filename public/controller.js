var paradisApp = angular.module('paradis', ['ngCookies']);
paradisApp.controller('paradisCtrl', function ($scope,socket,$http,$cookies) {
	console.log($cookies);
	$scope.saisie=true;
	$scope.users= new Array();
	$scope.hash="boutonpetit.jpg";
	$scope.attache={"ligne1":"Join the community","ligne2":"Exciting news coming soon","ligne3":"Get registered to be the first informed"};
	$scope.scpStockerNom = function(){
		console.log($scope.nom, $scope.email);
		$http.get('/test',{'user':$scope.nom}).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available/*
		console.log("data",data,"status",status,"headers",headers,"config",config);
		$scope.attache.ligne3="";
		$scope.attache.ligne2=config.user;
		$scope.saisie=false;
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log(data,status,headers,config);
		});/*
		socket.emit('registration',{
		"title": $scope.nom,  
		"description": $scope.email,  
		"style": $scope.email
		}, true);
		socket.on('registration', function (data) {
			$scope.saisie=false;
			$scope.attache.ligne2="bienvenu a toi "+ data.title;
			$scope.attache.ligne3="";
		});
		socket.on('les autres', function (data) {
			$scope.users=data;
		});
		socket.on('pub', function (data) {
			$scope.hash=data;
		});/*
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
		});/*
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
function hexToBase64(str) {
return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
var mesImagesApp = angular.module('mesimages', []);
mesImagesApp.controller('imagesCtrl', function ($scope,socket,$http) {
	$scope.mesimages="";
	$scope.chargerImages=function(){
		$http.get('/mesimages').
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available/*
		$scope.mesimages=data;
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log(data,status,headers,config);
		});
	}
	$scope.afficherImage=function(image){
		$http.get('/test/'+image.filename).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available/*
		$scope.hash= "data:image/jpeg;base64,"+data;
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log(data,status,headers,config);
		});
	}
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