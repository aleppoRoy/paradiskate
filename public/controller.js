var paradisApp = angular.module('paradis', []);
paradisApp.controller('paradisCtrl', function ($scope) {
	$scope.saisie=true;
	$scope.attache={"ligne1":"Join the community","ligne2":"Exciting news coming soon","ligne3":"Get registered to be the first informed"};
	$scope.scpStockerNom = function(){
		console.log($scope.nom, $scope.email);
		var socket = io();
		socket.emit('registration',{
		  "title": $scope.nom,  
		  "description": $scope.email,  
		  "style": $scope.email
		} );
	}
	socket.on('registration', function(msg){
		$scope.$apply(function(){
			$scope.attache.ligne2="bienvenu a toi "+ msg.title;
			$scope.attache.ligne3="";
			$scope.saisie=false;
		});
	});
});