// Create game object

var game = {

	lives: 3,

	govt: {
		score: 0,

		addScore: function(){
			this.score+=1;
			console.log("SCORE: " + this.score);
		
			// Add 1
			$("#score-government").html(this.score);
		}
	},

	america: {
		score: 0,

		addScore: function(){
			this.score+=1;
			console.log("SCORE: " + this.score);
		
			// Add 1
			$("#score-america").html(this.score);
		}
	},

	generateLives: function(){
		// Remove existing contents
		$("#lives-container").html('');

		// Add lives
		for (i=1; i<=this.lives; i++){
			$( "#lives-container" ).append( '<div class="life" id="life-'+i+'"></div>' );
		}
	},

	removeLife: function(){

		$("#life-"+this.lives+"").remove()
		
		this.lives -= 1;
	},

	showRetryWindow: function(){

		$("#play-again-container").show();

	},

	startGame: function(){

		// generate the apprpriate number of lives
		this.generateLives();

		// Change background image
		$(".intro").hide();

		$(".active-game").show();

		// Hide Retry window
		$("#play-again-container").hide();

		//Get Ron's dimension
		var box=$("#ron");
		var boxCenter=[box.offset().left+box.width()/2, box.offset().top+box.height()/2];
		//console.log(boxCenter);

		// create graph
		var g = graph;
		g.center.x = boxCenter[0];
		g.center.y = boxCenter[1];

		// Place visitor
		var v = visitor;
		v.setGraph(g);
		v.init();

		//Place Ron
		var r = ron;
		r.setGraph(g);
		r.init()


		// Attach Ron's movement to the direction of cursor
		$(document).mousemove(function(e){    
		    
		    r.move(e);

		    v.setRon(r);

			// check if its in rons line of sight
			v.inRonsLineOfSight(r);
		    
		});


		// set "caught" variable indicate if Ron was caught looking at visitor
		var caught = false;

		var interval= window.setInterval(function(){
		  
		  if(v.move(r) == true){
		  	caught = true;
		  	clearInterval(interval);

		  	// Remove life

		  	// Add 1 to Government score
		  	game.govt.addScore();
//		  	this.govt.addScore();

		  	// Decrease Lives
		  	game.removeLife();
//		  	this.removeLife();


		  	if(game.lives > 0){
//		  	if(this.lives > 0){
				// Show popup
				game.showRetryWindow();
//				this.showRetryWindow();
			
			}else{
				
				game.endGame();
//				this.endGame();
			}	
		  }

		}, 30);



		$("#btn-playagain").click(function(){
			game.startGame();
//			this.startGame();
		});


	},

	resetScoreboard: function(){
//		this.govt.score=0;
//		this.america.score=0;

		game.govt.score=0;
		game.america.score=0;		
	},

	resetLives: function(){
//		this.lives = 3;
		game.lives = 3;
	},

	endGame: function(){

		$(".intro").show();

		$(".active-game").hide();
	
		// reset scoreboard
//		this.resetScoreboard();
		game.resetScoreboard();

		// reset lives
//		this.resetLive();
		game.resetLives();

	}

}


// Create the "graph/Map/Canvas" for the game
var graph = {
	
	radius:300,

	center: {
		x: null,
		y: null
	}

};



// Create Ron Swanson
var ron = {
	x: null,
	y: null,
	angle: 0,

	setGraph: function(graph){
		this.graph = graph;
	},

	init: function(){

	},

	inRonsLineOfSight: function(visitor){

		// get rons line of sight
		if(visitor.angle <= (this.angle + 10) && visitor.angle >= (this.angle - 10)){
			console.log('GOTCHA!');
			return true;
		}else{
			return false;
		}

	},	

	move: function(e){

		console.log("pageX: " + e.pageX);
		console.log("pageY: " + e.pageY);

		console.log("centerX: " + this.graph.center.x);
		console.log("centerY: " + this.graph.center.y);


		var angle = Math.atan2(e.pageX- this.graph.center.x, -(e.pageY- this.graph.center.y) )*(180/Math.PI);

		console.log("Angle: " + angle);


		this.angle = angle;

//console.log(angle);

    	$("#ron").css({ "-webkit-transform": 'rotate(' + angle + 'deg)'});    
    	$("#ron").css({ '-moz-transform': 'rotate(' + angle + 'deg)'});
    	$("#ron").css({ 'transform': 'rotate(' + angle + 'deg)'});		
	}
};




//  Create Visitor
var visitor = {
	x: null,
	y: null,
	
	xOffset: 0,
	yOffset:0,

	angle:90,
	theta:0,
	clockwise: false,

	setGraph: function(graph){
		this.graph = graph;

		this.radius = this.graph.radius;	
		this.x = this.graph.center.x;
		this.y = this.graph.center.y + this.radius;
	},

	setRon: function(ron){
		this.ron = ron;
	},

	calculateImgMidpoint: function(){
		var box=$("#visitor");
		
		/*
		var boxCenter=[box.offset().left+box.width()/2, box.offset().top+box.height()/2];
		*/

		var boxCenter=[box.width()/2, box.height()/2];
/*
		console.log('calculateMidpoint:')		
		console.log('W:' + box.width());
		console.log('H:' + box.height());

		console.log('W (L padding):' + box.css('padding-left'));
		console.log('W (R padding):' + box.css('padding-right'));

		console.log('W (L offset):' + box.offset().left);
		console.log('W (R offset):' + box.offset().right);

		console.log('H (offset):' + box.offset().top);
*/

		this.xOffset = boxCenter[0];
		this.yOffset = boxCenter[1];

	},




	init: function(){		
		/*
		console.log(this.x);
		console.log(this.y);
		*/

		this.calculateImgMidpoint();
		
		console.log('V midpoint:');
		console.log('xoffset:' + this.xOffset);
		console.log('yoffset:' + this.yOffset);

		$("#visitor").css({left: this.x, top: this.y, position: "absolute"});

	},


	changeDirection: function(){
		if(this.clockwise == true){
			this.clockwise = false;
		}else{
			this.clockwise = true;
		}

	},

	inRonsLineOfSight: function(ron){

		// get rons line of sight
		if(this.angle <= (ron.angle + 5) && this.angle >= (ron.angle - 5)){

			console.log("V angle:"+ this.angle);
			console.log("GOTCHA!!!!!!!!!!!!!!!");

			console.log("R angle:"+ ron.angle);
			console.log("GOTCHA!!!!!!!!!!!!!!!");
			return true;
		}else{

			console.log("................");			
			return false;
		}

	},

	move: function(ron){

		// calculate speed
		da = .05;
		//da = .005;		
		
		this.theta+=da;

/*
		if (this.theta > 4){
			this.changeDirection();
			this.theta = 0;
		}
*/

		if(this.clockwise == false){
		
			this.x = this.graph.center.x + this.graph.radius*Math.sin(this.theta);
			this.y = this.graph.center.y + this.graph.radius*Math.cos(this.theta);
		
		}else{
			console.log('SWITCH!!');
			this.x = this.graph.center.x - this.graph.radius*Math.sin(this.theta);
			this.y = this.graph.center.y - this.graph.radius*Math.cos(this.theta);
	
		}

/*
console.log('------------------');		
console.log("theta: "+this.theta+"");
console.log(this.x);
console.log(this.y);
*/

		// Angle
		var angle = (Math.atan2(-(this.x - this.graph.center.x),(this.y - this.graph.center.y) )*(180/Math.PI))+90;

		this.angle = angle;		

/*
console.log("Visitor:");
console.log("X (Current):" + this.x);
console.log("Y (Current):" + this.y);
console.log("X (Center):" + this.graph.center.x);
console.log("Y (Center):" + this.graph.center.y);
console.log("Visitor angle:" + this.angle);	


console.log("xOffset:" + this.xOffset);	
console.log("yOffset:" + this.yOffset);	
*/


		// Move the visitor
//		$("#visitor").css({left: this.x, top: this.y, position: "absolute"});

		$("#visitor").css({left: this.x - this.xOffset, top: this.y - this.yOffset, position: "absolute"});


		// check if visitor is within rons line of sight
		if(this.inRonsLineOfSight(ron)){
			return true;
		}

//		this.move();


	}
};




/**
*		Start the Game
*/


var game = game;



$("#start-button").click(function(){    


game.startGame();


/*
	//Get Ron's dimension
	var box=$("#ron");
	var boxCenter=[box.offset().left+box.width()/2, box.offset().top+box.height()/2];
	//console.log(boxCenter);

	// create graph
	var g = graph;
	g.center.x = boxCenter[0];
	g.center.y = boxCenter[1];

	// Place visitor
	var v = visitor;
	v.setGraph(g);
	v.init();

	//Place Ron
	var r = ron;
	r.setGraph(g);
	r.init()


	// Attach Ron's movement to the direction of cursor
	$(document).mousemove(function(e){    
	    
	    r.move(e);

	    v.setRon(r);

		// check if its in rons line of sight
		v.inRonsLineOfSight(r);
	    
	});


	// set "caught" variable indicate if Ron was caught looking at visitor
	var caught = false;

	var interval= window.setInterval(function(){
	  
	  if(v.move(r) == true){
	  	caught = true;
	  	clearInterval(interval);

	  	// Remove life

	  	// Add 1 to Government score
	  	game.govt.addScore();

	  	// Decrease Lives
	  	game.removeLife();

		// Show popup
		game.showRetryWindow();

	  }

	}, 30);


	$("#btn-playagain").click(function(){
		game.restartGame();
	});

*/


});

