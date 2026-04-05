var logoRotation;
var logo;

function initalize()
{
	logoRotation = 0;
	logo = document.getElementById("logo");
	logo.parentElement.style.perspective = "1000px";
	flipLogo();
	updateYear();
}

function flipLogo()
{
	logoRotation += 180;
	logo.style.transform = "rotateY(" + logoRotation + "deg)";
}

function updateYear()
{
	var footerDefaultString = "2025 - ";
	var newFooterString = footerDefaultString + new Date().getFullYear();
	document.getElementById("year").textContent = newFooterString + " ";
}