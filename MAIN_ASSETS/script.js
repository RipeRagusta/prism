var threeColumnOn;

var	threeColumnLayout;
var	singleFileLayout;

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

window.addEventListener('pageshow', (event) => 
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
	threeColumnOn = false;

	if(checkStorage() === true)
    {
        if((localStorage.getItem("threeColumnLayout")) !== null)
        {
            threeColumnOn = JSON.parse(localStorage.getItem("threeColumnLayout"));
        }
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
	if(!threeColumnOn)
	{
		threeColumnLayout.disabled = true;
		singleFileLayout.disabled = false;
	}
	else
	{
		singleFileLayout.disabled = true;
		threeColumnLayout.disabled = false;
		
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