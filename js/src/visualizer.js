function Visualizer(){
	this.trigCount = 0;
	this.visPos = {};
	this.currentVisuals = [];

	this.lastTimeReset = Date.now();
	this.animationTime = 16000;

	//Classic Colors
	//'rgba(29,144,153,1)',
	//'rgba(213,58,51,1)',
	//'rgba(231,156,16,1)',
	//'rgba(86,199,75,1)'

	this.visColors = {
		blue: {
			C900: '#0D47A1',
			C700: '#1976D2',
			C500: '#2196F3',
			A700: '#2962FF'
		},
		red:{
			C900: '#B71C1C',
			C700: '#D32F2F',
			C500: '#F44336',
			A700: '#D50000'
		},
		brown:{
			C900: '#3E2723',
			C700: '#5D4037',
			C500: '#795548',
			A700: '#A1887F'
		},
		green:{
			C900: '#004D40',
			C700: '#00796B',
			C500: '#009688',
			A700: '#00BFA5'
		},
		orange:{
			C900: '#BF360C',
			C700: '#E64A19',
			C500: '#FF5722',
			A700: '#DD2C00'
		},
		purple:{
			C900: '#4A148C',
			C700: '#7B1FA2',
			C500: '#9C27B0',
			A700: '#AA00FF'

		}
	};

	this.currentColorPalette = this.visColors.orange;

	this.visuals = {
		0:function(){
			this.setColor('C500');
			for(var i=5;i<=10;i++){
				this.drawCircle(this.visPos.x,this.visPos.y,i,2,1,1);
			}
		}.bind(this),
		1:function(){
			this.setColor('C900');
			this.drawCircle(this.visPos.x,this.visPos.y,6+Math.sin(this.trigCount)*3,3,-2,-2);
			this.setColor('C500');
			this.drawCircle(this.visPos.x,this.visPos.y,6+Math.sin(this.trigCount)*3,3,2,2);
		}.bind(this),
		2:function(){
			this.setColor('C700');
			this.drawCircle(this.visPos.x,this.visPos.y,10+Math.cos(this.trigCount)*5,30);
		}.bind(this),
		3:function(){
			this.setColor('C500');
			this.drawCircle(this.visPos.x,this.visPos.y,5,30,1);
			this.setColor('C900');
			this.drawCircle(this.visPos.x,this.visPos.y,5,2,1,1);
		}.bind(this),
		4:function(){
			this.setColor('C700');
			this.drawCircle(this.visPos.x,this.visPos.y,2,2,1,1);
			this.setColor('C900');
			this.drawCircle(this.visPos.x,this.visPos.y,5,3,1,1);
			this.setColor('C500');
			this.drawCircle(this.visPos.x,this.visPos.y,10,5,1,1);
		}.bind(this),
		5:function(){
			this.setColor('A700');
			this.drawCircle(this.visPos.x,this.visPos.y,5,3,-1,1);
		}.bind(this),
		6:function(){
			for(var i=0;i<this.canvas.width;i++){
				if(i%2===0) {
					this.setColor('C700');
					this.drawRect(i, (this.canvas.height / 2) + Math.sin(this.trigCount * (i + 1)) * (this.canvas.height / 4));
				}
			}
		}.bind(this),
		7:function(){
			for(var i=0;i<this.canvas.width;i++){
				if(i%2!==0){
					this.setColor('C500');
					this.drawRect(i, (this.canvas.height / 2) + Math.sin(this.trigCount * (i + 1)) * (this.canvas.height / 4));
				}
			}
		}.bind(this),
		8:function(){
			this.setColor('A700');
			// -2 to 2
			for(var i=-2;i<=2;i++){
				var pos = (Math.sin(this.trigCount)*288)+288;
				pos = pos+(i);
				this.drawRect((pos%32),Math.floor(pos/32));
			}
		}.bind(this)
	};

	//Count visual functions above!
	this.numVisuals = Object.keys(this.visuals).length;

	this.canvas = document.querySelector('#visualizer');
	//32 x 18
	this.canvasCtx = this.canvas.getContext("2d");
	this.canvasCtx.fillStyle = 'rgb(51,51,51)';
	this.canvasCtx.fillRect(0, 0, this.canvas.width,  this.canvas.height);

	this.visPos.x = this.canvas.width/2;
	this.visPos.y = this.canvas.height/2;

	requestAnimationFrame(this.draw.bind(this));

	this.changeVisual();
}

Visualizer.prototype.setColorPalette = function(palette){
	this.currentColorPalette = this.visColors[palette];
};

Visualizer.prototype.setColor = function(color){
	this.canvasCtx.fillStyle = this.currentColorPalette[color];
};

Visualizer.prototype.changeVisual = function(){
	this.currentVisuals[0] = Math.floor(Math.random()*(this.numVisuals));
	this.currentVisuals[1] = Math.floor(Math.random()*(this.numVisuals));
};

Visualizer.prototype.draw = function(){

	//stats.begin();

	this.canvasCtx.drawImage(this.canvasCtx.canvas,0,0,this.canvas.width,this.canvas.height,-1,-1,this.canvas.width+2,this.canvas.height+2);
	this.canvasCtx.fillStyle = 'rgba(51,51,51,0.01)';
	//canvasCtx.fillStyle = 'rgba(51,51,51,1)';
	this.canvasCtx.fillRect(0,0,this.canvas.width,this.canvas.height);

	var animationTime = Date.now() - this.lastTimeReset;
	var percentComplete = animationTime/this.animationTime;
	if(percentComplete>=1){
		percentComplete = 1;
		this.lastTimeReset = Date.now();
		this.changeVisual();
	}
	this.trigCount = percentComplete*(Math.PI*2);

	//this.trigCount+=0.005;
	//if(this.trigCount > Math.PI*2){
	//	this.trigCount = 0;
	//	this.changeVisual();
	//}

	//run current visuals
	for(var i in this.currentVisuals){
		this.visuals[this.currentVisuals[i]]();
	}

	//stats.end();

	requestAnimationFrame(this.draw.bind(this));
};

//Hope you know your trig! I left some notes so maybe you can learn off of me
//<3 Jake
Visualizer.prototype.drawCircle = function(x,y,width,numPixels,spinX,spinY){
	for(var i=0;i<(2*Math.PI);i+=(2*Math.PI/numPixels)){ //'numPixels' point(s) in a circle, will loop over and spit evenly
		this.drawRect(
			x //Center X
			+(
				Math.cos((spinX?this.trigCount*spinX:0)+i) // Cos = X edge of circle
				*width //Width of circle
			)
			,
			y //Center Y
			+(
				Math.sin((spinY?this.trigCount*spinY:0)+i)
				*width
			)
		);
	}
};

Visualizer.prototype.drawRect = function(x,y){
	//32 x 18
	this.canvasCtx.fillRect(x,y,1,1);
};