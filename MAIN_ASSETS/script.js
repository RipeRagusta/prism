var threeColumnOn;

var	threeColumnLayout;
var	singleFileLayout;

var timeUpdate;

var sortAlphabetically = (a, b) => 
{
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if(nameA < nameB) 
    {
        return -1;
    }
    if(nameA > nameB) 
    {
        return 1;
    }

    return 0;
};

window.addEventListener("pageshow", (event) => 
{
    if(event.persisted) 
    {
        initialize();
        
        document.querySelectorAll("svg").forEach(svg => 
        {
            const freshSVG = svg.cloneNode(true);
            svg.parentNode.replaceChild(freshSVG, svg);
        });
    }
});

function initialize()
{
    document.body.style.visibility = "hidden";

    baseBodyClass = "ibm-plex-sans";
    
	threeColumnOn = false;

	if(checkStorage() === true)
    {
        if((localStorage.getItem("threeColumnLayout")) !== null)
        {
            threeColumnOn = JSON.parse(localStorage.getItem("threeColumnLayout"));
        }
    }
    else
    {
        threeColumnOn = true;
    }

	threeColumnLayout = document.getElementById("threecolumn");
	singleFileLayout = document.getElementById("singlefile");

	displayLayout();


	createThemeCommands();
	let currentTheme = null;

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userThemePreference")) !== null)
		{
			currentTheme = localStorage.getItem("userThemePreference");
		}
	}

	changeThemeFromName(currentTheme);

    updateTime()

    if(timeUpdate)
    {
        clearInterval(timeUpdate);
    }

    timeUpdate = setInterval(updateTime, 60000);
}

function updateTime()
{
    const currentDate = new Date();
    document.getElementById("date").innerHTML = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
}

function toggleLayout()
{
	threeColumnOn = !threeColumnOn;
	displayLayout();

	if(checkStorage() === true)
    {
        localStorage.setItem("threeColumnLayout", JSON.stringify(threeColumnOn));
    }
}

function displayLayout() 
{
    document.body.style.visibility = "hidden";

	if(!threeColumnOn)
	{
        document.body.classList.replace("threecolumn", "singlefile");
	}
	else
	{
        document.body.classList.replace("singlefile", "threecolumn");
	}

    document.body.style.visibility = "visible";
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