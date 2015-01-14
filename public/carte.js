var map;
var brooklyn = new google.maps.LatLng(40.6743890, -73.9455);
var geocoder;
var listeParadis = new Array();
listeParadis=[{"address":[48.8989080,2.0937610],"texte":'<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Paradiskateboards</h1>'+
	  '<h2>Luc</h2>'+
	  '<h2>Poissy</h2>'+
	  '<h2> le 23 d&eacutecembre 2013</h2>'+
      '<div id="bodyContent">'+
	  '<a href="https://eshop.petitsfrenchies.com/Product/Index/67322">'+
      'cocuou'+
	  '</a>'+
      '</div>'+
      '</div>'},
{"address":[48.9295840,2.0469820],"texte":'<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Paradiskateboards</h1>'+
	  '<h2>Lucas A</h2>'+
	  '<h2>Versailles</h2>'+
	  '<h2> le 23 d&eacutecembre 2013</h2>'+
      '<div id="bodyContent">'+
	  '<a href="https://eshop.petitsfrenchies.com/Product/Index/67325">'+
      'cocuou'+
	  '</a>'+
      '</div>'+
      '</div>'},
{"address":[48.8014080,2.1301220],"texte":'<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Paradiskateboards</h1>'+
	  '<h2>Pierre V</h2>'+
	  '<h2>La muette</h2>'+
	  '<h2> le 23 d&eacutecembre 2013</h2>'+
      '<div id="bodyContent">'+
	  '<a href="https://eshop.petitsfrenchies.com/Product/Index/67324">'+
      'cocuou'+
	  '</a>'+
      '</div>'+
      '</div>'}];


var MY_MAPTYPE_ID = 'custom_style';
function initialize() {
	geocoder = new google.maps.Geocoder();  
  var featureOpts = [
    {
      stylers: [
        { hue: '#FFFF00' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#00CC00' }
      ]
    }
  ];

  var mapOptions = {
    zoom: 12,
    center: brooklyn,
	disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
	
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var image = {
    url: 'tumblr.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(24, 24),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(-24, 24)
  };

  var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  var styledMapOptions = {
    name: 'Custom Style'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);
  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
	var iParadis=0;
  while(iParadis<listeParadis.length){
		var coucou= new google.maps.LatLng(listeParadis[iParadis].address[0],listeParadis[iParadis].address[1]);
		map.setCenter(coucou);
		var marker = new google.maps.Marker({
		position: coucou,
		map: map,
		icon: image,
		shape: shape,
		title: 'coucou'+iParadis,
		zIndex: 1
		});
		attachSecretMessage(marker, iParadis)
		iParadis++;
	}
}
function attachSecretMessage(marker, num) {
  var infowindow = new google.maps.InfoWindow({
    content: listeParadis[num].texte
  });
	console.log(infowindow);
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);