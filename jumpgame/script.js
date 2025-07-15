var GAME;
var GAMEOVER;
var SETLOOPLEFT;
var SETLOOPRIGHT;
var JUMPING;
var startedJump;
var ascending;
var HEIGHT;
var PLAYERFLOOR;
var MOVESPEED;
var PAUSED; 
var score;
var bestScore;
var delay;
var initalDelay;
var obstacleAmount;
var obstacleOdds;
var cloudDelay;

function initialize(bestScoreNumber)
{
	MAXHEIGHT = 200;
	PLAYERFLOOR = 450;
	TIMEINAIR = 11;
	GAMEOVER = false; 
	SETLOOPLEFT = false;
	SETLOOPRIGHT = false;
	JUMPING = false;
	startedJump = false;
	ascending = true;
	PAUSED = false;
	score = 0; 
	MOVESPEED = 2;
	delay = 0;
	obstacleAmount = 3;
	initalDelay = 128;
	obstacleOdds = 128;
	cloudDelay = 0;

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedBestScore") === null)
		{
			bestScore = bestScoreNumber;
		}
		else
		{
			bestScore = parseInt(localStorage.getItem("savedBestScore"));
		}
	}
	else
	{
		bestScore = bestScoreNumber;
	}

	document.getElementById("ground").style.top = 550 + "px";
	document.getElementById("ground").style.left = 0 + "px";
	document.getElementById("ground").style.height = 50 + "px";
	document.getElementById("ground").style.width = 850 + "px";
	document.getElementById("ground").style.backgroundImage = "url(./sand.png)";
	document.getElementById("ground").style.backgroundRepeat = "repeat";

	document.getElementById("player").style.top = 450 + "px";
	document.getElementById("player").style.left = 25 + "px";
	document.getElementById("player").style.width = 50 + "px";
	document.getElementById("player").style.height = 100 + "px";
	document.getElementById("player").style.backgroundPosition = "0px";

	document.getElementById("bushes1").style.top = 500 + "px";
	document.getElementById("bushes1").style.left = 0 + "px";
	document.getElementById("bushes1").style.width = 900 + "px";
	document.getElementById("bushes1").style.height = 50 + "px";
	document.getElementById("bushes1").style.backgroundImage = "url(./bushes.png)";
	document.getElementById("bushes1").style.backgroundRepeat = "repeat-x";
	
	GAME = setInterval(ticker, 1000 / 64);
}

function ticker()
{
	if((PAUSED == false) && (GAMEOVER == false))
	{
		moveCharacter();
		checkGravity();
		spawnObstacles();
		moveObstacles();
		checkHitbox();
		increaseScore();
		increaseDifficuty();
		spawnBackgroundStuff();
		moveBackgroundStuff();
	}

	if(GAMEOVER == true)
	{
		document.getElementById("restartbutton").style.display = "block";

		if(checkStorage() == true)
		{
			localStorage.setItem("savedBestScore", bestScore);
		}

		clearInterval(GAME);
	}
}

function increaseScore()
{
	score = score + 1;
	document.getElementById("score").innerHTML = score;

	if(score > bestScore)
	{
		bestScore = score;
	}

	document.getElementById("bestscore").innerHTML = bestScore;
}

function increaseDifficuty() 
{
	if(MOVESPEED < 7)
	{
		if(score >= 1000)
		{
			MOVESPEED = 2 * parseFloat(score / 999);
		}

		if(MOVESPEED > 7)
		{
			MOVESPEED = 7;
		}

		if(MOVESPEED > 4)
		{
			obstacleAmount = 4;
		}
	}
	
	if(initalDelay > 37)
	{
		initalDelay = 256 / MOVESPEED;

		if(initalDelay < 37) 
		{
			initalDelay = 37;
		}
	}

	if(obstacleOdds > 37)
	{
		obstacleOdds = 256 / MOVESPEED;

		if(obstacleOdds < 37)
		{
			obstacleOdds = 37;
		}
	}
}

function spawnObstacles()
{
	let andomize = ((Math.floor(Math.random() * obstacleOdds)) + 1);

	if((andomize == 1) && (delay < 0))
	{
		createObstacle();
		delay = initalDelay;
	}
	else
	{
		delay = delay - 1;
	}
}

function createObstacle()
{
	let andomize = ((Math.floor(Math.random() * obstacleAmount)) + 1);
	let parentElement = document.getElementById("screen");

	if(andomize == 1)
	{
		let newObstacle = document.createElement("div");
		newObstacle.id = "obstacle1";
		newObstacle.className = "obstacleobject";
		newObstacle.style.left = 800 + "px";
		newObstacle.style.top = 500 + "px";
		newObstacle.style.width = 50 + "px";
		newObstacle.style.height = 50 + "px";
		newObstacle.style.backgroundImage = "url(./brick.png)";
		newObstacle.style.backgroundRepeat = "repeat";
		parentElement.appendChild(newObstacle);
	}
	else if(andomize == 2)
	{
		let newObstacle = document.createElement("div");
		newObstacle.id = "obstacle2";
		newObstacle.className = "obstacleobject";
		newObstacle.style.left = 800 + "px";
		newObstacle.style.top = 450 + "px";
		newObstacle.style.width = 50 + "px";
		newObstacle.style.height = 100 + "px";
		newObstacle.style.backgroundImage = "url(./brick.png)";
		newObstacle.style.backgroundRepeat = "repeat";
		parentElement.appendChild(newObstacle);
	}
	else if(andomize == 3)
	{
		let newObstacle = document.createElement("div");
		newObstacle.id = "obstacle3";
		newObstacle.className = "obstacleobject";
		newObstacle.style.left = 800 + "px";
		newObstacle.style.top = 500 + "px";
		newObstacle.style.width = 100 + "px";
		newObstacle.style.height = 50 + "px";
		newObstacle.style.backgroundImage = "url(./brick.png)";
		newObstacle.style.backgroundRepeat = "repeat";
		parentElement.appendChild(newObstacle);
	}
	else if(andomize == 4)
	{
		let newObstacle = document.createElement("div");
		newObstacle.id = "obstacle4";
		newObstacle.className = "obstacleobject";
		newObstacle.style.left = 800 + "px";
		newObstacle.style.top = 400 + "px";
		newObstacle.style.width = 50 + "px";
		newObstacle.style.height = 150 + "px";
		newObstacle.style.backgroundImage = "url(./brick.png)";
		newObstacle.style.backgroundRepeat = "repeat";
		parentElement.appendChild(newObstacle);
	}
}

function moveObstacles()
{
	let obstacles = document.querySelectorAll(".obstacleobject");

	obstacles.forEach(obstacleobject => 
	{
		let currentLeft = parseFloat(obstacleobject.style.left);
		obstacleobject.style.left = (currentLeft - MOVESPEED) + "px";

		if(parseFloat(obstacleobject.style.left) <= 0 - parseFloat(obstacleobject.style.width))
		{
			obstacleobject.remove();
		}
		});

		let groundLeft = (parseFloat(document.getElementById("ground").style.left) - MOVESPEED);

		if(groundLeft <= 800 - parseFloat(document.getElementById("ground").style.width)) 
		{
			groundLeft = parseFloat(document.getElementById("ground").style.width) - 800 + groundLeft;
		}
		
		document.getElementById("ground").style.left = groundLeft + "px";
}

function spawnBackgroundStuff()
{
	if(cloudDelay <= 0)
	{
		let andomize = ((Math.floor(Math.random() * 320)) + 1);
		let parentElement = document.getElementById("screen");

		if(andomize == 1)
		{
			let newCloud = document.createElement("div");
			newCloud.className = "backgroundmove2";
			newCloud.style.left = 800 + "px";
			newCloud.style.top = ((Math.floor(Math.random() * 50)) + 16) + "px";
			newCloud.style.width = 293.75 + "px";
			newCloud.style.height = 115.625 + "px";
			newCloud.style.backgroundImage = "url(./cloud1.png)";
			newCloud.style.backgroundRepeat = "repeat";
			parentElement.appendChild(newCloud);
			cloudDelay = 1600 / MOVESPEED;
		}
	}
	else
	{
		cloudDelay = cloudDelay - 1;
	}
}

function moveBackgroundStuff()
{
	let backgroundStuff = document.querySelectorAll(".backgroundmove2");

	backgroundStuff.forEach(backgroundmove2 => 
	{
		let currentLeft = parseFloat(backgroundmove2.style.left); 
		backgroundmove2.style.left = (currentLeft - (MOVESPEED / 4)) + "px";
		if(parseFloat(backgroundmove2.style.left) <= 0 - parseFloat(backgroundmove2.style.width))
		{
			backgroundmove2.remove();
		}
	});

	let bushLeft = (parseFloat(document.getElementById("bushes1").style.left) - MOVESPEED / 2);

	if(bushLeft <= 800 - parseFloat(document.getElementById("bushes1").style.width)) 
		{
			bushLeft = parseFloat(document.getElementById("bushes1").style.width) - 800 + bushLeft;
		}

		document.getElementById("bushes1").style.left = bushLeft + "px";

}

function checkHitbox()
{
	let playerCharacter = document.getElementById("player");
	let style = window.getComputedStyle(playerCharacter);
	let playerLeft = parseFloat(style.left);
	let playerTop = parseFloat(style.top);
	let playerRight = (parseFloat(style.left) + parseFloat(style.width));
	let playerBottom = (parseFloat(style.top) + parseFloat(style.height));
	let obstacles = document.querySelectorAll(".obstacleobject");

	obstacles.forEach(obstacleobject => 
	{
		let currentLeft = parseFloat(obstacleobject.style.left);
		let currentTop = parseFloat(obstacleobject.style.top);
		let currentRight = (parseFloat(obstacleobject.style.left) + parseFloat(obstacleobject.style.width));
		let currentBottom = (parseFloat(obstacleobject.style.top) + parseFloat(obstacleobject.style.height));

		if((playerRight > currentLeft) && (currentRight > playerLeft) && (playerBottom >= currentTop))
		{
			GAMEOVER = true;
		}
	});
}

function moveCharacter()
{
	if(SETLOOPLEFT == true)
	{
		moveLeft();
	}
	else if(SETLOOPRIGHT == true)
	{
		moveRight();
	}
}

function checkGravity()
{
	let playerCharacter = document.getElementById("player");
	let style = window.getComputedStyle(playerCharacter);
	let topValue = style.top;
	let newTop = parseFloat(topValue);

	if((JUMPING == true) || (startedJump == true))
	{
		document.getElementById("player").style.backgroundPosition = "50px";
		startedJump = true;

		if(ascending == true)
		{
			newTop = newTop * 0.96;

			if(newTop <= MAXHEIGHT)
			{
				newTop = MAXHEIGHT;
				ascending = false;
				TIMEINAIR = 11;
			}
		}
		else
		{
			TIMEINAIR = TIMEINAIR - 1;

			if(TIMEINAIR <= 0)
			{
				newTop = newTop * 1.03;
			}

			if(newTop >= PLAYERFLOOR)
			{
				startedJump = false;
				document.getElementById("player").style.backgroundPosition = "0px";
				newTop = PLAYERFLOOR;
				ascending = true;
			}
		}
	}

	playerCharacter.style.top = newTop + "px";
}

function keyPressed()
{
	var input1 = event.which || event.keyCode; 

	if(((input1 == "65") || (input1 == "37")) && (SETLOOPLEFT == false) && (GAMEOVER == false))
	{
			SETLOOPLEFT = true;
			SETLOOPRIGHT = false;
 		}
 		else if(((input1 == "68") || (input1 == "39")) && (SETLOOPRIGHT == false) && (GAMEOVER == false))
	{
			SETLOOPRIGHT = true;
			SETLOOPLEFT = false;
 		}
 		else if(((input1 == "32") || (input1 == "38")) && (GAMEOVER == false) && (JUMPING == false))
 		{
 			JUMPING = true;
 		}
 		else if((input1 == "27") && (GAMEOVER == false))
 		{
 			if(PAUSED == false)
 			{
 				PAUSED = true;
 			}
 			else
 			{
 				PAUSED = false;
 			}
 		}
 		else if((input1 == "82") && (GAMEOVER == true))
 		{
 			restartgame();
 		}
}

function keyReleased() 
{
	var input1 = event.which || event.keyCode;

	if((input1 == "65") || (input1 == "37")) 
	{
		SETLOOPLEFT = false;
	}
	else if((input1 == "68") || (input1 == "39"))
	{
		SETLOOPRIGHT = false;
	}
	else if((input1 == "32") || (input1 == "38"))
	{
		JUMPING = false;
	}
}

function moveLeft()
{
	let playerCharacter = document.getElementById("player");
	let style = window.getComputedStyle(playerCharacter);
	let leftValue = style.left;
	let newLeft = parseInt(leftValue) - 5;

	if(newLeft <= 0)
	{
		newLeft = 0;
	}

	playerCharacter.style.left = newLeft + "px";
}

function moveRight()
{
	let playerCharacter = document.getElementById("player");
	let style = window.getComputedStyle(playerCharacter);
	let leftValue = style.left;
	let newLeft = parseInt(leftValue) + 5;

	if(newLeft >= 750)
	{
		newLeft = 750;
	}

	playerCharacter.style.left = newLeft + "px";
}

function restartgame()
{
	if(GAMEOVER == true)
	{
		document.getElementById("restartbutton").style.display = "none";
		let obstacles = document.querySelectorAll(".obstacleobject");

		obstacles.forEach(obstacleobject => 
		{
			obstacleobject.remove();
		});

		let cloudRemove = document.querySelectorAll(".backgroundmove2");

		cloudRemove.forEach(backgroundmove2 => 
		{
			backgroundmove2.remove();
		});

		GAMEOVER = false;
		initialize(bestScore);
	}
}

function checkStorage()
{
	var test = "test";

	try 
	{
		 	localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	 	} 
	catch(e)
	 	{
	 		return false;
	}
}