var pastCommands;
var pastCommandsIncrement;
var pastCommandsPointer;
var helpValues;
var launchOptions;
var selectPast;
var clickedConsoleFirst;
var bannerToggle;
var borderToggle;

function initialize()
{
	pastCommands = new Array();
	pastCommandsIncrement = 0;
	pastCommandsPointer = 0;
	helpValues = [
				  "about",
				  "clear",
				  "dinfo",
				  "help",
				  "launch",
				  "reload",
				  "tban",
				  "tbor"
				 ];
	launchOptions = [
					 "housecall"
					];
	selectPast = false;
	clickedConsoleFirst = false;

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userBannerPreference")) === null)
		{
			bannerToggle = true;
		}
		else
		{
			bannerToggle = JSON.parse(localStorage.getItem("userBannerPreference"));
		}
	}
	else
	{
		bannerToggle = true;
	}

	displayBanner();

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userBorderPreference")) === null)
		{
			borderToggle = false;
		}
		else
		{
			borderToggle = JSON.parse(localStorage.getItem("userBorderPreference"));
		}
	}
	else
	{
		borderToggle = false;
	}

	displayBorder();

	document.getElementById("consolewindow").value = "help";
	commandEnter(document.getElementById("consolewindow").value);
	document.getElementById("consolewindow").value = "";
			
	document.getElementById("consolewindow").focus();

	document.getElementById("consolewindow").addEventListener("keydown", function(event) 
	{
    	if(event.key === "Enter") 
    	{
       		event.preventDefault();
       		commandEnter(document.getElementById("consolewindow").value);
       		document.getElementById("consolewindow").value = "";
       		pastCommandsPointer = 0;
       		adjustConsoleWindow();
    	}
    	else if(event.key === "ArrowUp") 
    	{
    		event.preventDefault();
       		displayPastValues(true);
       		adjustConsoleWindow();
    	}
    	else if(event.key === "ArrowDown") 
    	{
    		event.preventDefault();
       		displayPastValues(false);
       		adjustConsoleWindow();
    	}
	});

	document.getElementById("consolewindow").addEventListener("input", function(event)
	{
		adjustConsoleWindow();
	});

	document.getElementById("consolehistory").addEventListener("mouseover", function(event)
	{
		selectPast = true;
	});

	document.getElementById("consolehistory").addEventListener("mousedown", function(event)
	{
		selectPast = true;
	});

	document.getElementById("consolehistory").addEventListener("mouseup", function(event)
	{
		selectPast = false;
	});

	document.getElementById("consolehistory").addEventListener("mouseleave", function(event)
	{
		selectPast = false;
	});

	document.getElementById("right").addEventListener("scroll", function(event) 
	{
		clickedConsoleFirst = false;
	});

	document.getElementById("right").addEventListener("mousedown", function(event) 
	{
		if(selectPast == false)
		{
			clickedConsoleFirst = true;
		}
	});

	document.getElementById("right").addEventListener("mouseup", function(event) 
	{
		if((selectPast == false) && (clickedConsoleFirst == true))
		{
			document.getElementById("consolewindow").focus();
			clickedConsoleFirst = false;
		}
	});

	document.getElementById("pagefull").addEventListener("scroll", function(event) 
	{
		synchro();
	});
}

function adjustConsoleWindow()
{
	document.getElementById("consolewindow").style.height = "auto"; 
 	document.getElementById("consolewindow").style.height = document.getElementById("consolewindow").scrollHeight - 0.5 + "px";
  	document.getElementById("right").scrollTo(0, document.getElementById("right").scrollHeight);
}

function displayPastValues(trueMeansUp)
{
	if(pastCommands.length > 0)
	{
		if(trueMeansUp == true)
		{
			pastCommandsPointer += 1;

			if(pastCommandsPointer >= pastCommands.length)
			{
				pastCommandsPointer = pastCommands.length - 1;
			}
					
			document.getElementById("consolewindow").value = pastCommands[pastCommands.length - 1 - pastCommandsPointer];
		}
		else
		{
			pastCommandsPointer -= 1;

			if(pastCommandsPointer <= 0)
			{
				pastCommandsPointer = 0;
			}

			document.getElementById("consolewindow").value = pastCommands[pastCommands.length - 1 - pastCommandsPointer];
		}
	}
}

function parseCommandSpaces(commandEntered)
{
	let parsed = commandEntered.replace(/\s/g, "");
	return parsed;
}

function parseExtraSpaces(commandEntered)
{
	let parsed = commandEntered.replace(/\s+/g, " ").trim();
	return parsed;
}

function checkIfNothing(commandEntered)
{
	if(commandEntered !== "")
	{
		return false;
	}
	else
	{
		return true;
	}
}

function commandEnter(commandEntered) 
{
	if(checkIfNothing(parseCommandSpaces(commandEntered)) == false)
	{
		saveCommand(commandEntered);
		evaluateCommand(commandEntered);
	}
	else
	{
		let consoleHistory = document.getElementById("consolehistory");
		let decorString = document.createElement("pre");
		decorString.textContent = "--";
		decorString.style.color = "#00ff00";
		consoleHistory.appendChild(decorString);
	}
}

function saveCommand(commandEntered)
{
	let consoleHistory = document.getElementById("consolehistory");
	let userString = document.createElement("pre");
	userString.style.whiteSpace = "pre-wrap";
	userString.style.wordBreak = "break-word";
	userString.appendChild(userDecorStringElement());
	userString.innerHTML += parseExtraSpaces(commandEntered);
	consoleHistory.appendChild(userString);

	if((pastCommands[pastCommandsIncrement - 1] !== commandEntered) && (commandEntered.replace(/\s/g, "") !== ""))
	{
		pastCommands[pastCommandsIncrement] = commandEntered;
		pastCommandsIncrement += 1;
		pastCommands[pastCommands.length] = "";
	}
}

function userDecorStringElement()
{
	let decorString = document.createElement("pre");
	decorString.textContent = "--\u00A0";
	decorString.style.color = "#00ff00";
	decorString.style.display = "inline";
	return decorString;
}

function consoleDecorStringElement()
{
	let decorString = document.createElement("pre");
	decorString.textContent = "::::\u00A0";
	decorString.style.color = "#ff0000";
	decorString.style.display = "inline";
	return decorString;
}

function consoleDecorSeperatorElement(length, trueMeansNoSpace)
{
	let decorString = document.createElement("span");
	let stringHolder;

	if(trueMeansNoSpace)
	{
		stringHolder = "";
	}
	else
	{
		stringHolder = "     ";
	}

	for(let i = 0; i < length; i++)
	{
		stringHolder += "-";
	}

	decorString.textContent = stringHolder;
	decorString.style.color = "white";
	decorString.style.userSelect = "none";
	decorString.style.display = "inline";

	return decorString;
}

function evaluateCommand(commandEntered) 
{
	let consoleHistory = document.getElementById("consolehistory");

	let consoleFormatBoxBox = document.createElement("div");
	consoleFormatBoxBox.style.display = "flex";

	let consoleFormatBox = document.createElement("div");
	consoleFormatBox.style.paddingRight = "calc(var(--sizer) + 1px)";

	let consoleString;
	consoleString = document.createElement("pre");

	switch(parseCommandSpaces(commandEntered).toLowerCase())
	{
		case "about":
			consoleString.style.whiteSpace = "pre-wrap";
			consoleString.style.wordBreak = "break-word";
			consoleString.appendChild(consoleDecorStringElement());
			consoleString.innerHTML += "total prism is a website";
			consoleHistory.appendChild(consoleString);
			break;

		case "help":
			consoleString.appendChild(consoleDecorStringElement());
			consoleString.innerHTML += "input options:" + "\n";
			consoleString.appendChild(consoleDecorSeperatorElement(14, false));

			for(let i = 0; i < helpValues.length; i++)
			{
				consoleString.innerHTML += "\n     " + helpValues[i];
			}

			consoleFormatBox.appendChild(consoleString);
			consoleFormatBoxBox.appendChild(consoleFormatBox);
			consoleHistory.appendChild(consoleFormatBoxBox);
			break;

		case "clear":
			let textContent = document.getElementById("consolehistory").querySelectorAll("div");
			textContent.forEach(div =>
			{
				div.remove();
			});

			textContent = document.getElementById("consolehistory").querySelectorAll("pre");
			textContent.forEach(pre =>
			{
				pre.remove();
			});

			break;

		case "launch":
			consoleString.appendChild(consoleDecorStringElement());
			consoleString.innerHTML += "can launch:" + "\n";
			consoleString.appendChild(consoleDecorSeperatorElement(11, false));

			for(let i = 0; i < launchOptions.length; i++)
			{
				consoleString.innerHTML += "\n     " + launchOptions[i];
			}

			consoleString.innerHTML += "\n";
			consoleString.appendChild(consoleDecorSeperatorElement(11, false))
			consoleString.innerHTML += "\n";
			consoleString.innerHTML += "     ex: launch " + launchOptions[(Math.floor(Math.random() * launchOptions.length))];

			consoleFormatBox.appendChild(consoleString);
			consoleFormatBoxBox.appendChild(consoleFormatBox);
			consoleHistory.appendChild(consoleFormatBoxBox);
			break;

		case "launchytp":
		case "launchvp1":
		case "ytp":
		case "vp1":
			window.location.href = "https://ragusta.com/index.html";
			break;

		case "launchflesh":
		case "flesh":
			window.location.href = "https://flesh.enterprises/index.html";
			break;

		case "launchcyberclicker":
		case "cyberclicker":
			window.location.href = "./cyberclicker/index.html";
			break;

		case "launchjumpgame":
		case "jumpgame":
			window.location.href = "./jumpgame/index.html";
			break;

		case "launchhousecall":
		case "housecall":
			window.location.href = "./housecall/index.html";
			break;

		case "launchfp2rbpr":
		case "fp2rbpr":
			window.location.href = "./fp/index.html";
			break;

		case "reload":
			window.location.href = "./index.html";
			break;

		case "":
			break;

		case "dinfo":
			consoleString.innerHTML = "_______________   " + "user agent: " + navigator.userAgent + "\n"; 
			consoleString.innerHTML += "___  __/__  __ " + "\\" + "  ";
			consoleString.appendChild(consoleDecorSeperatorElement(11, true));
			consoleString.innerHTML += "\n";
			consoleString.innerHTML += "__  /  __  /_/ /  " + "platform: " + navigator.platform + "\n";
			consoleString.innerHTML += "_  /   _  ____/   ";
			consoleString.appendChild(consoleDecorSeperatorElement(9, true));
			consoleString.innerHTML += "\n";
			consoleString.innerHTML += "/_/    /_/        " + "language: " + navigator.language;
			consoleFormatBox.appendChild(consoleString);
			consoleFormatBoxBox.appendChild(consoleFormatBox);
			consoleHistory.appendChild(consoleFormatBoxBox);
			break;

		case "tban":
			if(bannerToggle == true)
			{
				bannerToggle = false;
			}
			else
			{
				bannerToggle = true;
			}

			displayBanner();
			synchro();

			if(checkStorage() == true)
			{
				localStorage.setItem("userBannerPreference", bannerToggle);
			}

			break;

		case "tbor":
			if(borderToggle == true)
			{
				borderToggle = false;
			}
			else
			{
				borderToggle = true;
			}

			displayBorder();

			if(checkStorage() == true)
			{
				localStorage.setItem("userBorderPreference", borderToggle);
			}

			break;

		default:
			consoleString.style.whiteSpace = "pre-wrap";
			consoleString.style.wordBreak = "break-word";
			consoleString.appendChild(consoleDecorStringElement());
			consoleString.innerHTML += parseExtraSpaces(commandEntered) + " is not a valid input";
			consoleHistory.appendChild(consoleString);
			break;
	}
}

function displayBanner()
{
	if(bannerToggle == true)
	{
		document.getElementById("toplogo").style.display = "block";
	}
	else
	{
		document.getElementById("toplogo").style.display = "none";
	}
}

function displayBorder()
{
	if(borderToggle == true)
	{
		document.body.style.border = "1px solid #00ffff";
	}
	else
	{
		document.body.style.border = "0px";
	}
}

function synchro()
{
	let selected = document.getElementById("pagefull");
	let manipulate = document.getElementById("toplogo");
	percent = selected.scrollLeft / (selected.scrollWidth - selected.clientWidth);
	manipulate.scrollLeft = percent * (manipulate.scrollWidth - manipulate.clientWidth);
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