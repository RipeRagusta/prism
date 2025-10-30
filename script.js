var pastCommands;
var pastCommandsIncrement;
var pastCommandsPointer;
var commands;
var launchTargets;
var themeCommands;
var themeTargets;
var selectPast;
var clickedConsoleFirst;
var bannerToggle;
var borderToggle;
var ALLOW_WRAP;
var PREVENT_WRAP;
var PRINT_MESSAGE_WITH_SPACE;
var PRINT_MESSAGE_WITHOUT_SPACE;
var currentTheme;

function initialize()
{
	ALLOW_WRAP = true;
	PREVENT_WRAP = false;
	PRINT_MESSAGE_WITH_SPACE = true;
	PRINT_MESSAGE_WITHOUT_SPACE = false;
	pastCommands = new Array();
	pastCommandsIncrement = 0;
	pastCommandsPointer = 0;
	selectPast = false;
	clickedConsoleFirst = false;

	const sortAlphabetically = (a, b) => 
	{
	    const nameA = a.name.toLowerCase();
	    const nameB = b.name.toLowerCase();

	    if (nameA < nameB) 
	    {
	        return -1;
	    }
	    if (nameA > nameB) 
	    {
	        return 1;
	    }

	    return 0;
	};

	launchTargets = 
	[
		{ name: "cyberclicker", url: "./cyberclicker/index.html", display: true},
		{ name: "flesh", url: "https://flesh.enterprises/index.html", display: false},
		{ name: "fp2rbpr", url: "./fp/index.html", display: false},
		{ name: "housecall", url: "./housecall/index.html", display: true},
		{ name: "jumpgame", url: "./jumpgame/index.html", display: false},
		{ name: "vp1", url: "https://ragusta.com/index.html", display: false}
	];

	launchTargets.sort(sortAlphabetically);

	launchCommands = 
	[

	];

	updateLaunchCommands();

	launchCommands.sort(sortAlphabetically);

	themeTargets = 
	[
		{
			name: "default",
			display: true,
			backgroundColor: "#000d1a",
			color: "#00ffff",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "orng",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff6600",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "blue",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#1a1aff",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "yllw",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ffff00",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "prpl",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#e600e6",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "pink",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff80ff",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		},
		{
			name: "red",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff0000",
			consoleColor: "#0000ff",
			userColor: "#00ff00"
		},
		{
			name: "grn",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#00e600",
			consoleColor: "#ff0000",
			userColor: "#0000e6"
		},
		{
			name: "bw",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#f2f2f2",
			consoleColor: "#ff0000",
			userColor: "#00ff00"
		}
	];

	themeCommands = 
	[
		
	];

	updateThemeCommands();

	themeCommands.sort(sortAlphabetically);

	cstmCommands = 
	[
		{
			name: "tban",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
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
	        }
		},
		{
			name: "tbor",
			display: false,
			argumentsNeeded: 0,
			function: () => 
	        {
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
	        }
		},
		{
			name: "theme",
			display: true,
			argumentsNeeded: 1,
			function: (commandEntered, splitCommand, commandList) => 
	        {
	        	console.log("splitCommand" + splitCommand);
	        	if(splitCommand.length > 2)
	        	{
	        		executeCommand(commandEntered, splitCommand, 2, themeCommands, "cstm theme argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(themeCommands, "cstm theme");
	        	}
	        }
		},

	];

	cstmCommands.sort(sortAlphabetically);

	commands = 
	[
		{
			name: "about",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
	        	let consoleString = createHistoryMessage("console", ALLOW_WRAP);
	        	consoleString.innerHTML += "total prism is a website";
				printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
	        }

		},
		{
			name: "help",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
	        	let consoleString = createHistoryMessage("console", PREVENT_WRAP);
				consoleString.innerHTML += "input options:" + "\n";
				consoleString.appendChild(consoleDecorSeperatorElement(14, false));
	        	commands.forEach((command) => 
	        	{
	        		if(command.display === true)
	        		{
	        			consoleString.innerHTML += "\n     " + command.name;
	        		}
	        	});

	            printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
	        }

		},
		{
			name: "dinfo",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
	        	let consoleString = createHistoryMessage("console", PREVENT_WRAP);
	        	consoleString.innerHTML = "_______________   " + "user agent: " + navigator.userAgent + "\n"; 
				consoleString.innerHTML += "___  __/__  __ " + "\\" + "  ";
				consoleString.appendChild(consoleDecorSeperatorElement(11, true));
				consoleString.innerHTML += "\n";
				consoleString.innerHTML += "__  /  __  /_/ /  " + "platform: " + navigator.platform + "\n";
				consoleString.innerHTML += "_  /   _  ____/   ";
				consoleString.appendChild(consoleDecorSeperatorElement(9, true));
				consoleString.innerHTML += "\n";
				consoleString.innerHTML += "/_/    /_/        " + "language: " + navigator.language;
	            printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
	        }
		},
		{
			name: "clear",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
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
	        }
		},
		{
			name: "reload",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
	        	window.location.href = "./index.html";
	        }
		},
		{
			name: "cstm",
			display: true,
			argumentsNeeded: 5,
			function: (commandEntered, splitCommand, commandList) => 
	        {
	        	if(splitCommand.length > 1)
	        	{
	        		executeCommand(commandEntered, splitCommand, 1, cstmCommands, "cstm argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(cstmCommands, "cstm");
	        	}
	        }
		},
		{
			name: "launch",
			display: true,
			argumentsNeeded: 1,
			function: (commandEntered, splitCommand, commandList) => 
	        {
				if(splitCommand.length > 1)
				{
					executeCommand(commandEntered, splitCommand, 1, launchCommands, "launch argument");
				}
				else
				{
					printCommandListOptions(launchCommands, "launch");
				}
	        }
		}
	];

	commands.sort(sortAlphabetically);

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

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userThemePreference")) === null)
		{
			currentTheme = "default";
		}
		else
		{
			currentTheme = localStorage.getItem("userThemePreference");
		}
	}
	else
	{
		currentTheme = "default";
	}

	changeThemeFromName(currentTheme);
			
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
       		displayPastValues("up");
       		adjustConsoleWindow();
    	}
    	else if(event.key === "ArrowDown") 
    	{
    		event.preventDefault();
       		displayPastValues("down");
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

	document.getElementById("consolewindow").value = "help";
	commandEnter(document.getElementById("consolewindow").value);
	document.getElementById("consolewindow").value = "";
	adjustConsoleWindow();
}

function updateLaunchCommands()
{
	for(let i = 0; i < launchTargets.length; i++)
	{
		launchCommands.push({name: launchTargets[i].name, display: launchTargets[i].display, argumentsNeeded: 0, function: () => {launchATarget(launchTargets[i].name);}});
	}
}

function updateThemeCommands()
{
	console.log("updating theme commands");
	for(let i = 0; i < themeTargets.length; i++)
	{
		console.log("pass: " + i);
		themeCommands.push({name: themeTargets[i].name, display: themeTargets[i].display, argumentsNeeded: 0, function: () => {currentTheme = themeTargets[i].name; changeThemeFromName(currentTheme);}});
		console.log(themeTargets[i].name);
	}
}

function launchATarget(targetName)
{
	launchTarget = launchTargets.find(target => target.name === targetName);

	if(launchTarget)
	{
		window.location.href = launchTarget.url;
	}
	else
	{
		let consoleString = createHistoryMessage("console", ALLOW_WRAP);
		consoleString.innerHTML += "invalid launch argument: " + splitCommand[1];
		printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
	}
}

function printCommandListOptions(commandList, commandName)
{
	let consoleString = createHistoryMessage("console", PREVENT_WRAP);
	let consoleOptionsMessage = commandName + " options:";
	consoleString.innerHTML += consoleOptionsMessage + "\n";
	consoleString.appendChild(consoleDecorSeperatorElement(consoleOptionsMessage.length, false));

	commandList.forEach((target) => 
	{
		if(target.display === true)
		{
			consoleString.innerHTML += "\n     " + target.name;
		}
	});	

	consoleString.innerHTML += "\n";
	consoleString.appendChild(consoleDecorSeperatorElement(consoleOptionsMessage.length, false))
	consoleString.innerHTML += "\n";

	let exampleTarget = [];

	commandList.forEach((target) => 
	{
		if(target.display === true)
		{
			exampleTarget.push(target.name);
		}
	});

	consoleString.innerHTML += "     ex: " + commandName + " " + exampleTarget[(Math.floor(Math.random() * exampleTarget.length))];
	printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
}

function changeThemeFromName(name)
{
	let selectedTheme = themeTargets.find(theme => theme.name === name);

	if(checkStorage() == true)
	{
		localStorage.setItem("userThemePreference", name);
	}

	changetheme(selectedTheme.backgroundColor, selectedTheme.color, selectedTheme.consoleColor, selectedTheme.userColor);
}

function changetheme(backgroundColor, color, consoleColor, userColor)
{
	document.documentElement.style.setProperty('--backgroundcolor', backgroundColor);
	document.documentElement.style.setProperty('--color', color);
	document.documentElement.style.setProperty('--consolecolor', consoleColor);
	document.documentElement.style.setProperty('--usercolor', userColor);
}

function consoleDecorStringElement()
{
	let decorString = document.createElement("pre");
	decorString.textContent = "::::\u00A0";
	decorString.style.color = "var(--consolecolor)";
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

function userDecorStringElement()
{
	let decorString = document.createElement("pre");
	decorString.textContent = "--\u00A0";
	decorString.style.color = "var(--usercolor)";
	decorString.style.display = "inline";
	return decorString;
}

function adjustConsoleWindow()
{
	document.getElementById("consolewindow").style.height = "auto"; 
 	document.getElementById("consolewindow").style.height = document.getElementById("consolewindow").scrollHeight - 0.5 + "px";
  	document.getElementById("right").scrollTo(0, document.getElementById("right").scrollHeight);
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

function saveCommand(commandEntered)
{
	let consoleHistory = document.getElementById("consolehistory");

	if((pastCommands[pastCommandsIncrement - 1] !== commandEntered) && (commandEntered.replace(/\s/g, "") !== ""))
	{
		pastCommands[pastCommandsIncrement] = commandEntered;
		pastCommandsIncrement += 1;
		pastCommands[pastCommands.length] = "";
	}
}

function displayPastValues(direction)
{
	if(pastCommands.length > 0)
	{
		if(direction === "up")
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

function commandEnter(commandEntered) 
{
	if(checkIfNothing(commandEntered) === true)
	{
		let consoleString = document.createElement("pre");
		consoleString.textContent = "--";
		consoleString.style.color = "var(--usercolor)";
		printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
	}
	else
	{
		saveCommand(commandEntered);
		splitCommand = parseExtraSpaces(commandEntered).split(" ");

		let consoleString = createHistoryMessage("user", ALLOW_WRAP);
		consoleString.innerHTML += parseExtraSpaces(commandEntered);

		printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);

		executeCommand(commandEntered, splitCommand, 0, commands, "input");
		
		
	}
}

function executeCommand(commandEntered, splitCommand, startingPoint = 0, commandList, errorReason = "input")
{
	console.log("executing on: ", "commandEntered: " + commandEntered, "splitCommand: ", splitCommand, "startingPoint: " + startingPoint, "commandList: ", commandList)
	targetCommand = commandList.find(command => command.name === splitCommand[startingPoint]);

		if(targetCommand)
		{
			if(!excessArguments(splitCommand, startingPoint))
			{
				targetCommand.function(commandEntered, splitCommand, startingPoint, commandList);
			}
		}
		else
		{
			let consoleString = createHistoryMessage("console", ALLOW_WRAP);
			consoleString.innerHTML += "invalid " + errorReason + ": " + parseExtraSpaces(commandEntered);
			printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
			return false;
		}
}

function excessArguments(splitCommand, startingPoint)
{
	if(splitCommand.length - (startingPoint + 1) > targetCommand.argumentsNeeded)
	{
		let argumentsAdded = "";
		let argumentWarningMessage = "";

		if(splitCommand.length - (startingPoint + 1) == targetCommand.argumentsNeeded + 1)
		{
			argumentWarningMessage = "excess argument encountered:";
		}
		else
		{
			argumentWarningMessage = "excess arguments encountered:";
		}

		for(let i = targetCommand.argumentsNeeded + (startingPoint + 1); i < splitCommand.length; i++)
		{
			argumentsAdded += " " + splitCommand[i];
		}

		let consoleString = createHistoryMessage("console", ALLOW_WRAP);
		consoleString.innerHTML += argumentWarningMessage + argumentsAdded;
		printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
		return true;
	}
}

function createHistoryMessage(source, makeWrap = true)
{
	let consoleString = document.createElement("pre");

	if(makeWrap == true)
	{
		consoleString.style.whiteSpace = "pre-wrap";
		consoleString.style.wordBreak = "break-word";
	}

	if(source === "console")
	{
		consoleString.appendChild(consoleDecorStringElement());
	}
	else
	{
		consoleString.appendChild(userDecorStringElement());
	}

	return consoleString;	
}

function printMessage(content, printMessageWithSpace = false, makeStringInputWrap = true)
{
	let consoleHistory = document.getElementById("consolehistory");

	let consoleString;

	if(content instanceof HTMLElement) 
	{
		consoleString = content;
	}
	else
	{
		consoleString = document.createElement("pre");

		if(makeStringInputWrap)
		{
			consoleString.style.whiteSpace = "pre-wrap";
			consoleString.style.wordBreak = "break-word";
		}

		consoleString.innerHTML += content;
	}

	if(printMessageWithSpace)
	{
		let consoleFormatBoxBox = document.createElement("div");
		consoleFormatBoxBox.style.display = "flex";
		let consoleFormatBox = document.createElement("div");
		consoleFormatBox.style.paddingRight = "calc(var(--sizer) + 1px)";
		consoleFormatBox.appendChild(consoleString);
		consoleFormatBoxBox.appendChild(consoleFormatBox);
		consoleHistory.appendChild(consoleFormatBoxBox);
	}
	else
	{
		consoleHistory.appendChild(consoleString);
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
		document.body.style.border = "1px solid var(--color)";
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