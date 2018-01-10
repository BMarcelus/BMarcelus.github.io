

			var superview = 'body';
			var CANVAS_WIDTH =  window.innerWidth-30;
			var CANVAS_HEIGHT =  window.innerHeight-30;

			var screenDiv = document.getElementById("gameScreen");
			if(screenDiv)
			{
				CANVAS_WIDTH = parseInt( screenDiv.style.width);
				CANVAS_HEIGHT = parseInt(screenDiv.style.height);
				superview=screenDiv;
			}
			else
			{
				window.addEventListener("resize", resize);
				window.addEventListener("orientationchange", resize);                     
			}


			Number.prototype.clamp = function(min, max) {
				return Math.min(Math.max(this, min), max);
			};


			var canvasElement = document.getElementById('gc');
			canvasElement.width = CANVAS_WIDTH;
			canvasElement.height = CANVAS_HEIGHT;
			var canvas = canvasElement.getContext("2d");




			var distanceCount = 0;

			var score = 0;

			var FPS = 35;
			var pause = false;
			var increment = false;
			setInterval(function() {
					if(pause&&!increment) return;
					increment=false;
					update();
  				draw();
			}, 1000/FPS);
			// setInterval(function() {
  	// 			makePipe();
			// }, 2000);

			var baseRatio = CANVAS_WIDTH/10;
			if(CANVAS_WIDTH>CANVAS_HEIGHT)baseRatio=CANVAS_HEIGHT/10;

			var grav = (baseRatio*35*.9)/FPS/FPS;// px/sec

			




			var dead=false;

			var speed = 3*baseRatio/FPS;

			var holeHeight = baseRatio*2.7;

			var jumpPower = grav*9*FPS/35;



			var sounds=false;

			var state = "menu";


			var timeFrame=0;

			var image = new Image();
			// image.crossOrigin="anonymous";
			image.src = "./Hart2.png";

			
			var playButtonimg = new Image();
			playButtonimg.src = "./tapInstructions.png";


			var sprites=1;
			var resolutionRatio=5;

			
			function getPlayerHitbox(player) {
				var cx = player.x+player.width/2;
				var cy = player.y+player.height/2;
				var w = player.width*.5;
				var h = player.height*.5;
				return { x: cx-w/2, y: cy-h/2, width: w, height: h };
			}

			var player = {
	          color: "#00A",
	          x: CANVAS_WIDTH/2,
	          y: CANVAS_HEIGHT/2,
	          width: baseRatio,
	          height: baseRatio,
	          vy: 0.0,
	          vx: 0.0,
	          dirR: true,
	          draw: function() {
	            canvas.fillStyle = this.color;
	            canvas.fillRect(this.x, this.y, this.width, this.height);
	          },
	          jump: function()
	          {
	          	if(state=="play")
	          	{
								// if(this.vy>0)
								// this.vy=-jumpPower;
								// else this.vy -= jumpPower*.7;
								this.vy = -jumpPower;
	          		if(sounds)
	          		Sound.play("flap");
	          	}
	            
	          },
	          flip: function(){
	          	if(state=="play") {
								if(this.vx<0)
								this.vx=jumpPower;
								else this.vx += jumpPower*.7;
							}
	          	// if(this.dirR)
	          	// {
	          	// 	this.dirR=false;
	          	// }
	          	// else this.dirR=true;
	          },
	          update: function(){
 				player.height=player.width*image.height/(image.width/sprites);
 				if(state!="menu")
 				{
 					this.vy+=grav;
 					if(state=="play")
	          		this.vx+=-grav;
	          		else this.vx=0;
 				}
 				else
 				{
 					this.vy=Math.cos(timeFrame*3.14159/FPS/.5)*2;
 				}
 				
	          	

	          	this.y+=this.vy;
	          	this.x+=this.vx;


		 		 this.y = this.y.clamp(0, CANVAS_HEIGHT - player.height);
		 		 this.x = this.x.clamp(0, CANVAS_WIDTH - player.width);
		 		 if(state=="play")
		 		 {
			 		 if(this.x==0||this.x==CANVAS_WIDTH-player.width)
			 		 {
			 		 	this.vx=0;
			 		 	die();
			 		 }
			 		 if(this.y==0||this.y==CANVAS_HEIGHT-player.height)
			 		 {
			 		 	die();
			 		 }		 		 	
		 		 }

	          }
	          
	        };

	        function resize()
			{
				CANVAS_WIDTH =  window.innerWidth-30;
				CANVAS_HEIGHT =  window.innerHeight-30;
				canvas.canvas.width=CANVAS_WIDTH;
				canvas.canvas.height=CANVAS_HEIGHT;
				baseRatio = CANVAS_WIDTH/10;
				if(CANVAS_WIDTH>CANVAS_HEIGHT)baseRatio=CANVAS_HEIGHT/10;

				// grav = (baseRatio*.9)/FPS;// px/sec
				// jumpPower = grav*.9;

				grav = (baseRatio*35*.9)/FPS/FPS;
				jumpPower = grav*9*FPS/35;

				player.width=baseRatio;
				player.height=player.width*image.height/(image.width/sprites);
				player.x=CANVAS_WIDTH/2;
				player.y=CANVAS_HEIGHT/2;
			}
			
			var laserballImage=new Image();
			//laserballImage.src="images/laserball.png";

			var laserballs = [];
			function Laserball(I)
			{
				I.active=true;
				I.entered=false;
				
				I.speed=(200+300*Math.random())/FPS;
				I.update=function()
				{
					I.x+=Math.cos(I.angle)*I.speed;
					I.y+=Math.sin(I.angle)*I.speed;
					if(I.x+I.width<0||I.x>CANVAS_WIDTH||I.y+I.height<0||I.y>CANVAS_HEIGHT)
					{
						if(I.entered)
						{
							I.active=false;
							score++;
						}
					}
					else
					{
						I.entered=true;
					}
					if(collides(I,getPlayerHitbox(player)))
					{
						die();
					}
				}
				I.draw=function()
				{
					var fw = laserballImage.width/3;
					canvas.save();
					canvas.translate(I.x+I.width/2, I.y+I.height/2);
					canvas.rotate(I.angle+timeFrame*3.14159/5);
					canvas.drawImage(laserballImage, fw*(Math.floor(timeFrame/3)%3), 0, fw, laserballImage.height,-I.width/2, -I.height/2, I.width,I.height);
					canvas.restore();
					
				}
				return I;
			}
			function makeLaserBall()
			{
				var ang = Math.random()*3.14159*2;
				var prelb = {
					x:CANVAS_WIDTH/2+Math.cos(ang)*-CANVAS_WIDTH, 
					y:CANVAS_HEIGHT/2+Math.sin(ang)*-CANVAS_HEIGHT,
					width:baseRatio*3, 
					height:baseRatio*3, 
					angle:ang
				};
				var lb = Laserball(prelb);
				laserballs.push(lb);

			}

			var laserbeamImage= new Image(); 
			// laserbeamImage.crossOrigin="anonymous";
			laserbeamImage.src="./laserbeams2.png";//https://1047453e9e4e393e272ddf14694425e519f2a7e9.googledrive.com/host/0B-OAkgnJaF8jVS05eFVNSUY3Mmc/Game/images/laserbeamsprite.png"; //9frames
			
			laserbeamImage.onload=function()
			{
				// laserbeamImage=colorize(laserbeamImage, 0);
			}
			
			

			// var laserbeams = [];
			var animationSpeed=3;
			function Laserbeam(I)
			{
				I.sprites = laserbeamImage;//colorize(laserbeamImage, Math.floor((Math.random()*(360-36)+Math.random()*36)));
				I.active=true;
				I.myTime=0;
				I.angle=3.14159*Math.floor(Math.random()*2);
				if(I.height>I.width)I.angle+=3.14159/2;
				
				I.update=function()
				{
					I.myTime+=35/FPS;

					if(I.myTime>9*animationSpeed&&collides(I,getPlayerHitbox(player)))
					{
						die();
					}
					if(I.myTime>9*animationSpeed*3)
					{
						I.active=false;
					}
				}
				I.draw=function()
				{
					var fw = laserbeamImage.width;
					var fh = laserbeamImage.height/9;
					var f=Math.floor(I.myTime/animationSpeed);
					if(f>0)
					f-=3;
					if(f<0)f=1+f%2;
					if(f>8)f=6+f%3;
					canvas.save();
					if(I.height>I.width)
					{
						canvas.translate(I.x+I.width/2, CANVAS_HEIGHT/2);
					}
					else
					{
						canvas.translate(I.x+I.width/2, I.y+I.height/2);
					}
					
					canvas.rotate(I.angle);
					canvas.globalAlpha=1.0;
					if(I.myTime<9*animationSpeed)
					canvas.globalAlpha=.5;
					if(I.height>I.width)
					{
						canvas.drawImage(I.sprites, 0, fh*f, fw, fh,-I.height/2, -I.width/2, I.height,I.width);
					}
					else
					{
						canvas.drawImage(I.sprites, 0, fh*f, fw, fh,-I.width/2, -I.height/2, I.width,I.height);	
					}
				
					canvas.restore();
					
				}
				// if(I.height>I.width)
				// 	I.draw=function()
				// {
				// 	var fw = laserbeamImage.width;
				// 	var fh = laserbeamImage.height/9;
				// 	var f=Math.floor(I.myTime/animationSpeed);
				// 	if(f>0)
				// 	f-=3;
				// 	if(f<0)f=1+f%2;
				// 	if(f>8)f=6+f%3;


				// 	canvas.save();
				// 	canvas.translate(I.x+I.width/2, CANVAS_HEIGHT/2);
				// 	canvas.rotate(3.14159/2);
				// 	canvas.globalAlpha=1.0;
				// 	if(I.myTime<9*animationSpeed)
				// 	canvas.globalAlpha=.5;
				// 	canvas.drawImage(laserbeamImage, 0, fh*f, fw, fh,-I.height/2, -I.width/2, I.height,I.width);
				// 	canvas.restore();
				// }
				return I;
			}
			
			function makeVertLaserbeam()
			{
					var prelb={
						x:baseRatio+Math.random()*(CANVAS_WIDTH- baseRatio*2),
						y:0,
						width:baseRatio,
						height:CANVAS_HEIGHT
					}
					laserballs.push(Laserbeam(prelb));	
			}
			function makeHoriLaserbeam()
			{
					var prelb={
						x:0,
						y:baseRatio+Math.random()*(CANVAS_HEIGHT- baseRatio*2),
						width:CANVAS_WIDTH,
						height:baseRatio
					}
					laserballs.push(Laserbeam(prelb));					
			}

			function collides(a, b) {
	          return a.x < b.x + b.width &&
	            a.x + a.width > b.x &&
	            a.y < b.y + b.height &&
	            a.y + a.height > b.y;
	        }
			
			

			function reset()
			{
				pipes=[];
				dead=false;
				score=0;
				player.y=CANVAS_HEIGHT/2;
				player.jump();
			}


			function drawPlayButton()
			{
				var w = baseRatio*playButtonimg.width/(player.image.width/sprites)*resolutionRatio/3;
				var h = w*playButtonimg.height/playButtonimg.width;
				canvas.drawImage(playButtonimg, CANVAS_WIDTH*3/4-w/2, CANVAS_HEIGHT/2-h/2,w,h);

				canvas.save();
				canvas.translate(CANVAS_WIDTH/4,CANVAS_HEIGHT/2);
				canvas.rotate(3.14159/2);
				canvas.drawImage(playButtonimg,-w/2,-h/2,w,h);
				canvas.restore();

				canvas.fillStyle='#000';
          		canvas.font= baseRatio/2+"px Impact";
				canvas.fillText("Use A and L keys on pc", 0,baseRatio/2);
			}

			var gameOverImg=new Image();
			gameOverImg.src="./gameover.png";
			function drawGameOver()
			{
				var w = baseRatio*gameOverImg.width/(player.image.width/sprites)*resolutionRatio;
				var h = w*gameOverImg.height/gameOverImg.width;
				canvas.drawImage(gameOverImg, CANVAS_WIDTH/2-w/2, CANVAS_HEIGHT/2-h/2,w,h);
			}

			function update() {
				if(state=="play"&&timeFrame>0)
				{
					if((timeFrame+FPS)%(FPS*2)==0)
					{
						// makeLaserBall();
						makeHoriLaserbeam();
						// makeLaserbeam();
						if(timeFrame>FPS*2)
							score++;
					}
					if(timeFrame%(FPS*2)==0)
					{
						makeVertLaserbeam();
					}					
				}


				player.update();

				if(state=="play")
				{
					laserballs.forEach(function(lb) {
	         		   	lb.update(); 
	         		});
					laserballs = laserballs.filter(function(lb) {
	           		 	return lb.active;
	          		});					
				}




				timeFrame++;
			}

			function draw() {
			  // canvas.fillStyle="#720";
			  // canvas.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);

				canvas.save();
				// canvas.translate(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
				// canvas.rotate(3.14159/20*Math.sin(timeFrame/FPS*3.14159/10));
				// canvas.translate(-CANVAS_WIDTH/2,-CANVAS_HEIGHT/2);
			  // canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          		canvas.fillStyle="#133";
			  	canvas.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);


         		laserballs.forEach(function(lb) {
         		   lb.draw();
         		});

						
					var fontSize = baseRatio*2;
				canvas.font= fontSize+"px Impact";
				canvas.textAlign='center';
				canvas.lineWidth = fontSize/30;
				canvas.strokeStyle="#488";
				canvas.fillStyle='#fff';				
				canvas.fillText(""+score, CANVAS_WIDTH/2, CANVAS_HEIGHT/4);
				canvas.strokeText(""+score, CANVAS_WIDTH/2, CANVAS_HEIGHT/4);
						 


				player.draw();



				canvas.restore();


				

         		
         		if(state=="menu")
         		{
         			drawPlayButton();
         		}
         		else if (state=="dead")
         		{
         			drawGameOver();
         			
         			if(timeFrame*1.0/FPS<1)
         			{	
         				canvas.globalAlpha=(1-timeFrame*1.0/FPS);
         				canvas.fillStyle="#fff";
         				canvas.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
         				canvas.globalAlpha=1.0;
         			}
         			

         		}
         		

			}

		
        	player.image=image;
        	player.framec=0;
        	player.angle=0;
			

        player.draw = function() {
        	if(state=="menu")
 			{
 				this.angle=0;
 				player.framec+=1;
 			}
 			else
 			{
 				if(player.vy<baseRatio/5)
	        	{
	        		player.framec+=2;
	        		 this.angle+=-3.14159/10;
	        	}
	        	else
	        	{
	        		player.framec=4;
	        		this.angle+=this.vy*20/baseRatio/FPS;
	 			}
 			}
        	

 			// this.angle+=this.vy/50;
 			// this.angle=this.vy/5;
 			this.angle=this.angle.clamp(-3.14159/10,3.14159/2);
        	// else player.frame=1;
        	var frame = Math.floor(player.framec/4 )%sprites;
        	var fw = player.image.width/sprites;
        	var fh = player.image.height;

        	canvas.save();
					canvas.translate(this.x+this.width/2,this.y+this.height/2);
        	canvas.rotate(this.angle);
        	// canvas.fillRect(100,100,100,100);
          canvas.drawImage(player.image, frame*fw, 0, fw, fh, -this.width/2, -this.height/2, this.width, this.height);
          canvas.restore();

        };



   //      var specialKeys= {
			// 	8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			// 	20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			// 	37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			// 	96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			// 	104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			// 	112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			// 	120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
			// };

			var keymap = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1];
			function handlekeypressed(event)
			{
				tapped();
				var key = event.keyCode;
				var value = keymap[key-97];
				if(value==1)
				// if(key=="97")//a
				{
					player.flip();
				}
				else if(value==2)
				// if(key=="108")//s
				{
					player.jump();
				}
				if(key=="32")//space
				{
					player.jump();
					player.flip();
				}
			}
			function die()
			{
				state="dead";
				timeFrame=0;

			}
			function gotoMenu()
			{
				state="menu";
				player.x=CANVAS_WIDTH/2;
				player.y=CANVAS_HEIGHT/2;
				player.vx=0;
				player.vy=0;
				timeFrame=0;
				laserballs=[];
			}
			gotoMenu();
			function tapped()
			{
				if(state=="menu")
				{
					start();
				}
				else if(state=="dead"&&timeFrame/FPS>1)
				{
					gotoMenu();
				}
			}
			function start()
			{
				player.x=CANVAS_WIDTH/2;
				player.y=CANVAS_HEIGHT/2;
				state="play";
				score=0;


				// laserbeamImage=colorize(laserbeamImage, Math.floor( Math.random()*7  )*60 +30 );

				timeFrame=0;

			}
			function clicked(e)
			{
				tapped();
				
				if(e.clientX>CANVAS_WIDTH/2)
				{
			    	player.jump();
			    }
			    else
			    {
			    	player.flip();
			    }
			}
			document.ontouchstart = function(e){ 
			    e.preventDefault(); 
			    // clicked();
			    tapped();
			    for (var i = e.touches.length - 1; i >= 0; i--) {
			    	if(e.touches[i].clientX>CANVAS_WIDTH/2)
			    	{
			    		player.jump();
			    	}
			    	else
			    	{
			    		player.flip();
			    	}
			    };
			}


			function colorize(iimg, hue)
			{
				var w = iimg.width;
				var h = iimg.height;
				var tempCanvasElement = document.createElement('canvas');
				tempCanvasElement.width = w;
				tempCanvasElement.height = h;
				var tempCanvas = tempCanvasElement.getContext("2d");

				tempCanvas.drawImage(iimg,0,0);

				var imgData = tempCanvas.getImageData(0,0,w,h);
				var data = imgData.data;

				for(var i=0; i<data.length; i+=4) {
				  var r = data[i];
				  var g = data[i+1];
				  var b = data[i+2];
				  var alpha = data[i+3];

				  var HSL = RGBtoHSL(r,g,b);
				  // HSL.h=(hue-HSL.h)/3;
				  HSL.h=hue;
				  var rgb = hslToRGB(HSL);

				  data[i]=rgb.r;
				  data[i+1]=rgb.g;
				  data[i+2]=rgb.b;
				  data[i+3]=alpha;


				}
	
				tempCanvas.putImageData(imgData, 0, 0);

				var nimg = new Image();

				var url = tempCanvasElement.get(0).toDataURL();
				nimg.src=url;
				return nimg;
			}

			function RGBtoHSL(r, g, b)
			{
				cMax = Math.max(r, g, b),
        		cMin = Math.min(r, g, b),
       			delta = cMax - cMin,
        		l = (cMax + cMin) / 2,
        		s=0,
        		h=0;


        		if (delta == 0) {
			        h = 0;
			    }
			    else if (cMax == r) {
			        h = 60 * (((g - b) / delta) % 6);
			    }
			    else if (cMax == g) {
			        h = 60 * (((b - r) / delta) + 2);
			    }
			    else {
			        h = 60 * (((r - g) / delta) + 4);
			    }

        		if (delta == 0) {
			        s = 0;
			    }
			    else {
			        s = (delta/(1-Math.abs(2*l - 1)))
			    }

			    return {
			    	h:h,
			        s: s,
			        l: l
			    }
			}
			function hslToRgb(hsl){
				var h=hsl.h/360,
				s=hsl.s,
				l=hsl.l;
			    var r, g, b;

			    if(s == 0){
			        r = g = b = l; // achromatic
			    }else{
			        function hue2rgb(p, q, t){
			            if(t < 0) t += 1;
			            if(t > 1) t -= 1;
			            if(t < 1/6) return p + (q - p) * 6 * t;
			            if(t < 1/2) return q;
			            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			            return p;
			        }

			        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			        var p = 2 * l - q;
			        r = hue2rgb(p, q, h + 1/3);
			        g = hue2rgb(p, q, h);
			        b = hue2rgb(p, q, h - 1/3);
			    }

			    return {r:r*255,g:g*255,b:b*255};
			}
			function hslToRGB(hsl) {
			    var h = hsl.h%360,
			        s = hsl.s,
			        l = hsl.l,
			        c = (1.0 - Math.abs(2*l - 1)) * s,
			        x = c * ( 1.0 - Math.abs((h / 60 ) % 2 - 1 )),
			        m = l - c/ 2.0,
			        r, g, b;

			    if (h < 60) {
			        r = c;
			        g = x;
			        b = 0;
			    }
			    else if (h < 120) {
			        r = x;
			        g = c;
			        b = 0;
			    }
			    else if (h < 180) {
			        r = 0;
			        g = c;
			        b = x;
			    }
			    else if (h < 240) {
			        r = 0;
			        g = x;
			        b = c;
			    }
			    else if (h < 300) {
			        r = x;
			        g = 0;
			        b = c;
			    }
			    else {
			        r = c;
			        g = 0;
			        b = x;
			    }

			    r = normalize_rgb_value(r, m);
			    g = normalize_rgb_value(g, m);
			    b = normalize_rgb_value(b, m);

			    return {r:r,g:g,b:b};
			}

			function normalize_rgb_value(color, m) {
			    color = Math.floor((color + m) * 255);
			    if (color < 0) {
			        color = 0;
			    }
			    return color;
			}