//var stats = null;
var vis = null;

window.onload = function() {
	//stats = new Stats();
	//document.body.appendChild( stats.dom );

	showTitle();
	vis = new Visualizer();
	initMenu();

	window.onresize = function() {
		centerContent();
	};
};