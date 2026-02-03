var pastCommands;
var pastCommandsIncrement;
var pastCommandsPointer;
var commands;
var defaultLaunchTargets;
var launchTargets;
var launchCommands;
var editLaunchCommands;
var bannerCommands;
var borderCommands;
var themeCommands;
var defaultThemeTargets;
var themeTargets;
var editThemeCommands;
var cstmCommands;
var selectPast;
var clickedConsoleFirst;
var bannerToggle;
var borderToggle;
var ALLOW_WRAP;
var PREVENT_WRAP;
var PRINT_MESSAGE_WITH_SPACE;
var PRINT_MESSAGE_WITHOUT_SPACE;
var currentTheme;
var sortAlphabetically;
var openInNewWindow;
var timeUpdate;

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

	sortAlphabetically = (a, b) => 
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

	createLaunchCommands();

	createThemeCommands();

	createEditThemeCommands();

	bannerToggle = { value: true };

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userBannerPreference")) !== null)
		{
			bannerToggle = { value: JSON.parse(localStorage.getItem("userBannerPreference")) };
		}
	}

	displayBanner();

	createBannerCommands();

	borderToggle = { value: false };

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userBorderPreference")) !== null)
		{
			borderToggle = { value: JSON.parse(localStorage.getItem("userBorderPreference")) };
		}
	}

	displayBorder();

	createBorderCommands();

	createCSTMCommands();

	openInNewWindow = { value: false };

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userNewWindowPreference")) !== null)
		{
			openInNewWindow = { value: JSON.parse(localStorage.getItem("userNewWindowPreference")) };
		}
	}

	createLaunchInNewWindowCommands();

	createEditLaunchCommands();

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
				consoleString.innerHTML += "command options:" + "\n";
				consoleString.appendChild(consoleDecorSeperatorElement(16, false));
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
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
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
			alias: "l",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
	        	let executeCommandString;
	        	let commandListOptions;

	        	if(splitCommand[0].toLowerCase() === "launch".toLowerCase())
	        	{
	        		executeCommandString = "launch argument";
	        		commandListOptionsString = "launch";
	        	}
	        	else if(splitCommand[0].toLowerCase() === "l".toLowerCase())
	        	{
	        		executeCommandString = "l argument";
	        		commandListOptionsString = "l";
	        	}
				if(splitCommand.length > 1)
				{
					executeCommand(commandEntered, splitCommand, 1, launchCommands, executeCommandString);
				}
				else
				{
					printCommandListOptions(launchCommands, commandListOptionsString);
				}
	        }
		},
		{
			name: "edlaunch",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
				if(splitCommand.length > 1)
				{
					executeCommand(commandEntered, splitCommand, 1, editLaunchCommands, "edlaunch argument");
				}
				else
				{
					printCommandListOptions(editLaunchCommands, "edlaunch");
				}
	        }
		},
		{
			name: "home",
			alias: "h",
			display: true,
			argumentsNeeded: 0,
			function: (commandEntered, splitCommand) => 
	        {
				window.location.href = "../index.html";
	        }
		},
	];

	commands.sort(sortAlphabetically);

	currentTheme = null;

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userThemePreference")) !== null)
		{
			currentTheme = localStorage.getItem("userThemePreference");
		}
	}

	changeThemeFromName(currentTheme);
			
	document.getElementById("consolewindow").focus();

	window.addEventListener("pageshow", (event) => 
	{
	    if(event.persisted) 
	    {
	    	moveToRight();
			synchro();
	        document.getElementById("consolewindow").focus();
	    }
	});

	document.getElementById("consolewindow").addEventListener("keydown", function(event) 
	{
    	if(event.key === "Enter") 
    	{
       		event.preventDefault();
       		rawUserValue = document.getElementById("consolewindow").value;
       		safeUserValue = DOMPurify.sanitize(rawUserValue);
       		commandEnter(safeUserValue);
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

	moveToRight();
	synchro();

	document.getElementById("pagefull").addEventListener("scroll", function(event) 
	{
		synchro();
	});

	document.getElementById("consolewindow").value = "help";
	commandEnter(document.getElementById("consolewindow").value);
	document.getElementById("consolewindow").value = "";
	adjustConsoleWindow();

	updateTime()

    if(timeUpdate)
    {
        clearInterval(timeUpdate);
    }

    timeUpdate = setInterval(updateTime, 1000);
}

function updateTime()
{
    const currentDate = new Date();
    let currentHours = currentDate.getHours();
	let meridiem;

	if(currentHours >= 12)
	{
		meridiem = "PM";
	}
	else
	{
		meridiem = "AM";
	}

	if(currentHours > 12) 
	{
	    currentHours -= 12;
	} 
	else if (currentHours === 0) 
	{
	    currentHours = 12;
	}

	let currentMinutes = currentDate.getMinutes();

	if(currentMinutes < 10)
	{
		currentMinutes = "0" + currentMinutes;
	}

    document.getElementById("date").innerHTML = (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
    document.getElementById("time").innerHTML = currentHours + ":" + currentMinutes + " " + meridiem;
}

function isSafeURL(urlString)
{
	const urlAnchor = `<a href="${urlString}"></a>`; 
    const sanitizedHTML = DOMPurify.sanitize(urlAnchor);
    const container = document.createElement("div");
    container.innerHTML = sanitizedHTML;
    const cleanAnchor = container.querySelector("a");

    if(!cleanAnchor) 
    {
        return false;
    }

    const urlSanitized = cleanAnchor.href;
    const link = document.createElement("a");
    link.href = urlString;
    const urlUnsanitized = link.href;

    if(urlSanitized !== urlUnsanitized) 
    {
        return false;
    }

    return true;
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
	decorString.style.color = "var(--separator)";
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
	if(checkIfNothing(parseExtraSpaces(commandEntered)) === true)
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

		executeCommand(commandEntered, splitCommand, 0, commands, "command");
	}
}

function executeCommand(commandEntered, splitCommand, startingPoint = 0, commandList, errorReason = "command")
{
	targetCommand = commandList.find(command => command.name.toLowerCase() === splitCommand[startingPoint].toLowerCase() || command.alias?.toLowerCase() === splitCommand[startingPoint].toLowerCase());

	if(targetCommand)
	{
		if(!excessArguments(splitCommand, startingPoint, targetCommand))
		{
			targetCommand.function(commandEntered, splitCommand, startingPoint, commandList);
		}
	}
	else
	{
		let consoleString = createHistoryMessage("console", ALLOW_WRAP);
		consoleString.innerHTML += "invalid " + errorReason + ": " + splitCommand[startingPoint];
		printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
		return false;
	}
}

function excessArguments(splitCommand, startingPoint, targetCommand)
{
	if(targetCommand.argumentsNeeded === -1)
	{
		argumentAmountCheck = Number.MAX_SAFE_INTEGER - 9999;
	}
	else
	{
		argumentAmountCheck = targetCommand.argumentsNeeded;
	}
	if(splitCommand.length - (startingPoint + 1) > argumentAmountCheck)
	{
		let argumentsAdded = "";
		let argumentWarningMessage = "";

		if(splitCommand.length - (startingPoint + 1) == argumentAmountCheck + 1)
		{
			argumentWarningMessage = "excess argument encountered:";
		}
		else
		{
			argumentWarningMessage = "excess arguments encountered:";
		}

		for(let i = argumentAmountCheck + (startingPoint + 1); i < splitCommand.length; i++)
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
	if(bannerToggle.value == true)
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
	if(borderToggle.value == true)
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

function moveToRight()
{
	let selected = document.getElementById("pagefull");
	selected.scrollTo(selected.scrollWidth, 0);
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