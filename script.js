var logoRotation;

function initalize()
{
	logoRotation = 0;
}

function flipLogo()
{
	var logo = document.getElementById("logo");
	logoRotation += 180;
	logo.style.setProperty("--rotation", `${logoRotation}deg`);
}