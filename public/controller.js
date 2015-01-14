var paradisApp = angular.module('paradis', []);
paradisApp.controller('paradisCtrl', function ($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
  $scope.scpStockerNom = function(){
	console.log($scope.nom, $scope.email);
	jQuery.post("/api/products", {
	  "title": $scope.nom,  
	  "description": $scope.email,  
	  "style": $scope.email
	}, function (data, textStatus, jqXHR) { 
		console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR); 
	});
	}
});