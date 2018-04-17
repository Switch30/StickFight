function home() {
    var myWindow = window.open("index.html", "_self");
}

//game loop and requestAnimationFrame
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var map1;
var map2;
var map3;
var width = 800;
var height = 400;
var player1 = {
	x: (width/4),
	y: height - 100,
	width: 50,
	height: 100,
	speed: 7,
	health: 100,
	attack: 5,
	range: 50,
	velX: 0,
	velY: 0,
	jumping : false,
	grounded: false,
	lastDirection: "r",
	dead: false,
	kills: 0 
};
var player2 = {
	x: (width * 0.75 - 50),
	y: height - 100,
	width: 50,
	height: 100,
	speed: 7,
	health: 100,
	attack: 5,
	range: 50,
	velX: 0,
	velY: 0,
	jumping : false,
	grounded: false,
	lastDirection: "l",
	dead: false,
	kills: 0 
};
var keys = [];
var friction = 0.9;
var gravity = 0.66;

canvas.width = width;
canvas.height = height;

// load sounds
var sound = new Array();
    sound[0] = new Audio('sound/hit.ogg');
    sound[1] = new Audio('sound/miss.ogg');

var frameRightP1 = 1;
var frameRightP2 = 1;
var frameLeftP1 = 11;
var frameLeftP2 = 11;
var frameLeftPunchP1 = 37;
var frameLeftPunchP2 = 37;
var frameRightPunchP1 = 26;
var frameRightPunchP2 = 26;
var maxFrames = 74;
var player1Sprites = new Array(maxFrames);
var player2Sprites = new Array(maxFrames);
var animation1;
var animation2;
var deathTime = 0;
var healthP1 = document.getElementById("p1Health");
var healthP2 = document.getElementById("p2Health");

var map1 = new Image();
map1.src = "images/map1.png";
var map2 = new Image();
map2.src = "images/map2.png";
var map3 = new Image();
map3.src = "images/map3.png";

//loadPlayer1
for(var i=0; i<=maxFrames; i++){
	player1Sprites[i] = new Image();
	player1Sprites[i].src = "images/player1/player" + i + ".svg";
	if(i==maxFrames){
		animation1 = function(){
			if(player1.dead==false){				
				if(keys[65] && !player1.jumping){//keyboard (a)
					//move left
					ctx.drawImage(player1Sprites[frameLeftP1],player1.x,player1.y);
					++frameLeftP1;
					if(frameLeftP1==22){
						frameLeftP1=11;
					}
				}				
				else if(keys[68] && !player1.jumping){ //keyboard (d)
					//move right
					ctx.drawImage(player1Sprites[frameRightP1],player1.x,player1.y);
					++frameRightP1;
					if(frameRightP1==11){
						frameRightP1=1;
					}
				}
				else if(player1.jumping == true){
					//jump animation
					if(player1.lastDirection = 'r'){
						ctx.drawImage(player1Sprites[23],player1.x,player1.y);
					}
					else{
						ctx.drawImage(player1Sprites[24],player1.x,player1.y);
					}
				}
				else if(keys[83]){ //keyboard (s)
					//attack
					if(player1.lastDirection == "r"){
						ctx.drawImage(player1Sprites[frameRightPunchP1],player1.x,player1.y);
						if(frameRightPunchP1 != 25){
							++frameRightPunchP1;
							//dealing damage from left
							if((player1.x + player1.width) + player1.range >= player2.x && 
								(player1.x + player1.width) + player1.range <= (player2.x + (player2.width * 1.5)) &&
								player1.y >= player2.y && 
								player1.y <= player2.y + player2.height){
								pain(player2, player1, healthP2);
							}
							else{
								sound[1].play();
							}
						}
						if(frameRightPunchP1 == 35){
							frameRightPunchP1 = 25;
						}
					}	
					else{
						ctx.drawImage(player1Sprites[frameLeftPunchP1],(player1.x-player1.width/2),player1.y);
						if(frameLeftPunchP1 != 36){
							++frameLeftPunchP1;
							//dealing damage from right
							if((player1.x - player1.range) <= (player2.x + player2.width) &&
								(player1.x - player1.range) >= player2.x - (player2.width/2) &&
							player1.y >= player2.y &&
							player1.y <= player2.y + player2.height){
								pain(player2, player1, healthP2)
							}
							else{
								sound[1].play();
							}
						}
						if(frameLeftPunchP1 == 46){
							frameLeftPunchP1 = 36;
						}
					}
				}
				else{
					ctx.drawImage(player1Sprites[0],player1.x,player1.y);
					frameRightPunchP1=26;
					frameLeftPunchP1=37;
				}
			}
		};
	}
}
healthP1.style.width = player1.health + "%";

//loadPlayer2
for(var j=0; j<=maxFrames; j++){
	player2Sprites[j] = new Image();
	player2Sprites[j].src = "images/player2/player" + j + ".svg";
	if(j==maxFrames){
		animation2 = function(){
			if(player2.dead == false){
				if(keys[37] && !player2.jumping){ //keyboard (left arrow)
					//move left
					ctx.drawImage(player2Sprites[frameLeftP2], player2.x, player2.y);
					++frameLeftP2;
					if(frameLeftP2 == 22){
						frameLeftP2 = 11;
					}
				}
				else if(keys[39] && !player2.jumping){ //keyboard (right arrow)
					//move right
					ctx.drawImage(player2Sprites[frameRightP2],player2.x,player2.y);
					++frameRightP2;
					if(frameRightP2 == 11){
						frameRightP2 = 1;
					}
				}
				else if(player2.jumping == true){
					//jump
					if(player2.lastDirection == "l"){
						ctx.drawImage(player2Sprites[24],player2.x,player2.y);
					}
					else{
						ctx.drawImage(player2Sprites[23],player2.x,player2.y);
					}
				}
				else if(keys[40]){
					//attack
					if(player2.lastDirection == "l"){
						ctx.drawImage(player2Sprites[frameLeftPunchP2],(player2.x - player2.width/2),player2.y);
						if(frameLeftPunchP2 != 36){
							++frameLeftPunchP2;
							//dealing damage from right
							if((player2.x - player2.range) <= (player1.x + player1.width) &&
								(player2.x - player2.range) >= player1.x - (player1.width/2) &&
								player2.y >= player1.y &&
								player2.y <= player1.y + player1.height){
								pain(player1,player2,healthP1);
							}
							else{
								sound[1].play();
							}
						}
						if(frameLeftPunchP2==46){
							frameLeftPunchP2=36;
						}
					}
					else{
						ctx.drawImage(player2Sprites[frameRightPunchP2],player2.x,player2.y);
						if(frameRightPunchP2 != 25){
							++frameRightPunchP2;
							//dealing damage from left
							if((player2.x + player2.width) + player2.range >= player1.x &&
								(player2.x + player2.width) + player2.range <= (player1.x + (player1.width * 1.5)) &&
								player2.y >= player1.y &&
								player2.y <= player1.y + player1.height){
								pain(player1,player2,healthP1);
							}
							else{
								sound[1].play();
							}
						}
						if(frameRightPunchP2==35){
							frameRightPunchP2=25;
						}
					}
				}
				else{
					ctx.drawImage(player2Sprites[0],player2.x,player2.y);
					frameLeftPunchP2=37;
					frameRightPunchP2=26;
				}
			}
		};
	}
}
healthP2.style.width = player2.health + "%";

function update(){
	//jump
	//player 1
	if(keys[87]){
		if(!player1.jumping){
			player1.jumping = true;
			player1.velY = -player2.speed * 2;
		}
		if(!player1.jumping && player1.grounded){
			player1.jumping = true;
			player1.grounded = false;
			player1.velY = -player1.speed * 2;
		}
	}
	//player2
	if(keys[38]){
		if(!player2.jumping){
			player2.jumping = true;
			player2.velY = -player2.speed * 2;
		}
		if(!player2.jumping && player2.grounded){
			player2.jumping = true;
			player2.grounded = false;
			player2.velY = -player2.speed * 2;
		}
	}
	//move left
	//player1
	if(keys[65]){
		if(player1.velX > -player1.speed){
			player1.velX--;
			player1.lastDirection = "l";
		}
	}
	//player2
	if(keys[37]){
		if(player2.velX > -player2.speed){
			player2.velX--;
			player2.lastDirection = "l";
		}
	}
	//move right
	//player1
	if(keys[68]){
		if(player1.velX < player1.speed){
			player1.velX++;
			player1.lastDirection = "r";
		}
	}
	//player2
	if(keys[39]){
		if(player2.velX < player2.speed){
			player2.velX++;
			player2.lastDirection = "r";
		}
	}

	//render stage
	ctx.clearRect(0,0,width,height);
	ctx.drawImage(map3,0,0,width,height);
	ctx.fillStyle = "#000000";
	ctx.beginPath();

	player1.grounded = false;
	player2.grounded = false;

	for(var k=0; k<object.length; k++){
		ctx.rect(object[k].x, object[k].y, object[k].width, object.height);
		var direction1 = Check(player1,object[k]);
		var direction2 = Check(player2, object[k]);

		if(direction1 === "l" || direction1 === "r"){
			player1.velX = 0;
			player1.jumping = false;
		}
		else if(direction1 === "b"){
			player1.grounded = true;
			player1.jumping = false;
		}
		else if (direction1 === "t"){
			player1.velY *= -1;
		}

		if(direction2 === "l" || direction2 === "r"){
			player2.velX = 0;
			player2.jumping = false;
		}
		else if(direction2 == "b"){
			player2.grounded = true;
			player2.jumping = false;
		}
		else if(direction2 = "t"){
			player2.velY *= -1;
		}
	}
	if(player1.grounded){
		player1.velY = 0;
	}
	if(player2.grounded){
		player2.velY = 0;
	}

	player1.x += player1.velX;
	player1.y += player1.velY;
	player1.velX *= friction;
	player1.velY += gravity;

	player2.x += player2.velX;
	player2.y += player2.velY;
	player2.velX *= friction;
	player2.velY += gravity;

	ctx.closePath();
	ctx.fill();

	//render and animate characters
	animation1();
	animation2();

	//death animation
	if(deathTime != 0 && deathTime < 14){
		++deathTime;
		if(player1.dead == true){
			if(player1.lastDirection == "l"){
				ctx.drawImage(player1Sprites[46 + deathTime], player1.x, player1.y);
			}
			else{
				ctx.drawImage(player1Sprites[60 + deathTime], player1.x, player1.y);
			}
			if(deathTime == 13){
				countKO(player2, "p2Kill");
			}
		}
		else if(player2.dead == true){
			if(player2.lastDirection == "l"){
				ctx.drawImage(player2Sprites[46 + deathTime], player2.x, player2.y);
			}
			else{
				ctx.drawImage(player2Sprites[60 + deathTime], player2.x, player2.y);
			}
			if(deathTime == 13){
				countKO(player1, "p1Kill");
			}
		}
	}
	if(deathTime == 14){
		deathTime = 14;
	}
	requestAnimationFrame(update);
}

function Check(objectA, objectB){
	var vX = (objectA.x + (objectA.width/2)) - (objectB.x + (objectB.width/2));
	var vY = (objectA.y + (objectA.height/2)) - (objectB.y + (objectB.height/2));
	var halfWidth = (objectA.width/2) + (objectB.width/2);
	var halfHeight = (objectA.height/2) + (objectB.height/2);
	var collDirection = null;
	var oX = halfWidth - Math.abs(vX), oY = halfHeight - Math.abs(vY);

	if(Math.abs(vX) < halfWidth && Math.abs(vY) < halfHeight){
		if (oX >= oY) {
            if (vY > 0) {
                collDirection = "t";
                objectA.y += oY;
            }
            else {
                collDirection = "b";
                objectA.y -= oY;
            }
        }
		else{
			if(vX > 0){
				collDirection = "l";
				objectA.x += oX;
			}
			else{
				collDirection = "r";
				objectA.x -= oX;
			}
		}
	}
	return collDirection;
}

//oppenent hit
function pain(victim, attacker, victimHealth){
	sound[0].play();
	victim.health -= attacker.attack;
	victimHealth.style.width = victim.health + "%";

	//low hp
	if(victim.health > 15 && victim.health <= 30){
		victimHealth.style.background = "#d84e1c"; //orange
	}
	if(victim.health > 0 && victim.health <= 15){
		victimHealth.style.background = "#cc0000"; //red
	}
	if(victim.health <= 0){
		victim.dead = true;
		deathTime = 1;
		setTimeout(function(){respawn(victim, victimHealth)},400);
	}
}

//count KO
function countKO(winner, winnerCounter){
	++winner.kills;
	document.getElementById(winnerCounter).innerHTML = winner.kills;
}

//respawn defeated player
function respawn(newLife, healthFill){
	deathTime = 0;
	newLife.dead = false;
	newLife.x = (newLife == player1 ? (width/4) : (width * 0.75 - 50));
	newLife.y = height - 100;
	newLife.health = 100;
	healthFill.style.width = newLife.health + "%";
	healthFill.style.background = "#00ea2e";
}

window.addEventListener("load", function(){
	update();
});
document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});

var object = [];

// left wall
object.push({
    x: 10,
    y: 0,
    width: 0,
    height: height
});
// right wall
object.push({
    x: width-10,
    y: 0,
    width: 0,
    height: height
});
// floor
object.push({
    x: 0,
    y: height-10,
    width: width,
    height: 10
});
// ceiling
object.push({
    x: 0,
    y: 0,
    width: width,
    height: 10
});