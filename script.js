var logoRotation;
var logo;

function initalize()
{
	logoRotation = 0;
	logo = document.getElementById("logo");
	logo.parentElement.style.perspective = "1000px";
	flipLogo();
}

function flipLogo()
{
	logoRotation += 180;
	logo.style.transform = "rotateY(" + logoRotation + "deg)";
}