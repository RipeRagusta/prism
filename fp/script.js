var displaying;
var bigPhoto;
var clicking;

function initialize() 
{
	displaying = false;
	clicking = false;
	logoPositionBoolean = false;

	bigPhoto = document.createElement("img");
	bigPhoto.classList.add("bigphoto");
	bigPhoto.id = "bigdisplayphoto";

	document.body.addEventListener('mousedown', function(event) 
	{
  		if(displaying == true && event.button === 0 && clicking == false)
  		{
  			clicking = true;
  		}
	});

	document.body.addEventListener('mouseup', function(event) 
	{
		if(displaying == true && clicking == true && event.button === 0)
  		{
			document.getElementById("bigdisplayphoto").remove();
			document.body.style.cursor = "auto";
  			displaying = false;
  			clicking = false;
		}
	});
}

function expandPhoto(number)
{
	if(displaying == false && clicking == false)
	{
		displaying = true;
		bigPhoto.src = number + "-small.jpg";
		bigPhoto.src = number + ".jpg";
		document.body.prepend(bigPhoto);
		document.body.style.cursor = "pointer";
	}
}

function indexInitialize()
{
	window.addEventListener("mousemove", logoOne);
}

function logoOne()
{
	var x = window.innerWidth / 2;
	var mouseX = event.clientX;

	var logo = document.querySelector("#logo-1");
	var referenceY = logo.getBoundingClientRect();

	var y = referenceY.top + (referenceY.height / 2);
	var mouseY = event.clientY;
	var atanPositionX;
	var atanPositionY;

	if(mouseX <= x)
	{
		atanPositionX = x - mouseX;
	}
	else if(mouseX > x)
	{
		atanPositionX = mouseX - x;
	}
	
	if(mouseY <= y)
	{
		atanPositionY = y - mouseY;
	}
	else if(mouseY > y)
	{
		atanPositionY = mouseY - y;
	}

	var angle = Math.atan2(atanPositionY, atanPositionX) * 180 / Math.PI;
	var realAngle;

	if(mouseX > x && mouseY <= y)
	{
		realAngle = 90 - angle;
	}
	else if(mouseX > x && mouseY > y)
	{
		realAngle = 90 + angle;
	}
	else if(mouseX <= x && mouseY > y)
	{
		realAngle = 180 + (90 - angle);
	}
	else if(mouseX <= x && mouseY <= y)
	{
		realAngle = 270 + angle;
	}

	if(realAngle > 337.5 && realAngle <= 360 || realAngle <= 22.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateX(15deg)";
	}
	else if(realAngle > 22.5 && realAngle <= 67.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(10deg) rotateX(10deg)";
	}
	else if(realAngle > 67.5 && realAngle <= 112.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(15deg)";
	}
	else if(realAngle > 112.5 && realAngle <= 157.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(10deg) rotateX(-10deg)";
	}
	else if(realAngle > 157.5 && realAngle <= 202.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateX(-15deg)";
	}
	else if(realAngle > 202.5 && realAngle <= 247.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(-10deg) rotateX(-10deg)";
	}
	else if(realAngle > 247.5 && realAngle <= 292.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(-15deg)";
	}
	else if(realAngle > 292.5 && realAngle <= 337.5)
	{
		document.getElementById("logo-1").style.transform = "perspective(3000px) rotateY(-10deg) rotateX(10deg)";
	}
}	