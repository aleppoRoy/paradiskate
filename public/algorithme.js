// intégrer momentjs pour avoir le temps
var mPosition= new Array();
mPosition = [{"address":[48.8989080,2.0937610],"temps":10,"delta":2},{"address":[48.9295840,2.0469820],"temps":12,"delta":2},{"address":[48.8014080,2.1301220],"temps":13,"delta":2}];
var v = 10;
var tau=function(i,j){
((mPosition[j]["address"][0]-mPosition[i]["address"][0])**2 + (mPosition[j]["address"][1]-mPosition[i]["address"][1])**2)/v - (mPosition[j]["temps"]-mPosition[i]["temps"]);
};
var xPosition=0;
var mTemps = new Array();
while ( xPosition < mPosition.length){
//positions
	mTemps[xPosition] = new Array();
	yPosition=0;
	while (yPosition < mPosition.length){
	// autreposition
		mTemps[xPosition][yPosition]=tau(xPosition,yPosition);
		controler(mTemps[xPosition][yPosition], mPosition[yPosition]);
		yPosition++;
	}
	xPosition++;
}
var Tposition =0;
while ( Tposition<mTemps.length){
	
}