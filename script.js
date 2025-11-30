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

	defaultLaunchTargets = 
	[
		{ name: "cyberclicker", url: "./cyberclicker/index.html", display: true},
		{ name: "flesh", url: "https://flesh.enterprises/index.html", display: false},
		{ name: "fp2rbpr", url: "./fp/index.html", display: false},
		{ name: "housecall", url: "./housecall/index.html", display: true},
		{ name: "jumpgame", url: "./jumpgame/index.html", display: false},
		{ name: "vp1", url: "https://ragusta.com/index.html", display: false}
	]

	launchTargets = JSON.parse(JSON.stringify(defaultLaunchTargets));

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userLaunchTargetPreference")) !== null)
		{
			launchTargets = JSON.parse(localStorage.getItem("userLaunchTargetPreference"));
		}
	}

	launchTargets.sort(sortAlphabetically);

	launchCommands = 
	[

	];

	updateLaunchCommands();

	launchCommands.sort(sortAlphabetically);

	defaultThemeTargets = 
	[
		{
			name: "default",
			display: true,
			backgroundColor: "#000d1a",
			color: "#00ffff",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "orng",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff6600",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "blue",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#1a1aff",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "yllw",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ffff00",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "prpl",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#e600e6",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "pink",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff80ff",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "red",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ff0000",
			consoleColor: "#0000ff",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "grn",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#00e600",
			consoleColor: "#ff0000",
			userColor: "#0000e6",
			separatorColor: "#ffffff"
		},
		{
			name: "bw",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ffffff",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		},
		{
			name: "altbw",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#ffffff",
			consoleColor: "#ff0000",
			userColor: "#0000ff",
			separatorColor: "#ffff00"
		},
		{
			name: "brwn",
			display: true,
			backgroundColor: "#0d0d0d",
			color: "#804000",
			consoleColor: "#ff0000",
			userColor: "#00ff00",
			separatorColor: "#ffffff"
		}
	];

	themeTargets = JSON.parse(JSON.stringify(defaultThemeTargets));

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userThemeTargetPreference")) !== null)
		{
			themeTargets = JSON.parse(localStorage.getItem("userThemeTargetPreference"));
		}
	}

	themeCommands = 
	[
		
	];

	updateThemeCommands();

	themeCommands.sort(sortAlphabetically);

	editThemeCommands = 
	[
		{
			name: "set",
			display: true,
			argumentsNeeded: 6,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 8)
	        	{
	        		if(themeTargets.find(target => target.name.toLowerCase() === splitCommand[3].toLowerCase()))
					{
						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "invalid name: " + splitCommand[3] + ", it is already in use";
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
					else
					{
						themeTargets.push({ name: splitCommand[3], display: true, backgroundColor: splitCommand[4], color: splitCommand[5], consoleColor: splitCommand[6], userColor: splitCommand[7], separatorColor: splitCommand[8]});

						themeTargets.sort(sortAlphabetically);

						if(checkStorage() == true)
						{
							localStorage.setItem("userThemeTargetPreference", JSON.stringify(themeTargets));
						}

						themeCommands = 
						[

						];

						updateThemeCommands();

						themeCommands.sort(sortAlphabetically);

						let consoleString = createHistoryMessage("console", PREVENT_WRAP);
						consoleString.innerHTML += "successfully set: " + splitCommand[2] + " " + splitCommand[3] + " " + splitCommand[4] + " " + splitCommand[5] + " " + splitCommand[6] + " " + splitCommand[7] + " " + splitCommand[8];
						printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
					}
	        	}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: cstm edtheme set cyan #0d0d0d #00ffff #ff0000 #00ff00 #ffffff";
					printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
				}
	        }
		},
		{
			name: "remove",
			display: true,
			argumentsNeeded: 1,
			function: () => 
	        {
	        	if(splitCommand.length > 3)
				{
					let currentThemeTarget = themeTargets.find(themeTarget => themeTarget.name.toLowerCase() === splitCommand[3].toLowerCase());

					if(!currentThemeTarget)
					{
						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "invalid name: " + splitCommand[3] + ", not found";
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
					else
					{
						let themeTargetIndex = themeTargets.findIndex(themeTarget => themeTarget.name.toLowerCase() === currentThemeTarget.name.toLowerCase());
						themeTargets.splice(themeTargetIndex, 1);

						themeTargets.sort(sortAlphabetically);

						if(checkStorage() == true)
						{
							localStorage.setItem("userThemeTargetPreference", JSON.stringify(themeTargets));
						}

						themeCommands = 
						[

						];

						updateThemeCommands();

						themeCommands.sort(sortAlphabetically);

						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "successfully removed: " + splitCommand[3];
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);

						changeThemeFromName(currentTheme);
					}
				}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: cstm edtheme remove cyan";
					printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
				}
	        }
		},
		{
			name: "reset",
			display: true,
			argumentsNeeded: 0,
			function: () => 
	        {
	        	themeTargets = JSON.parse(JSON.stringify(defaultThemeTargets));

				themeTargets.sort(sortAlphabetically);

				if(checkStorage() == true)
				{
					localStorage.removeItem("userThemeTargetPreference");
				}

				themeCommands = 
				[

				];

				updateThemeCommands();

				themeCommands.sort(sortAlphabetically);

				let consoleString = createHistoryMessage("console", ALLOW_WRAP);
				consoleString.innerHTML += "successfully reset";
				printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);

				changeThemeFromName(currentTheme);
	        }
		}
	];

	editThemeCommands.sort(sortAlphabetically);

	bannerCommands = 
	[
		{
			name: "on",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				bannerToggle = true;

				displayBanner();
				synchro();

				if(checkStorage() == true)
				{
					localStorage.setItem("userBannerPreference", bannerToggle);
				}
			}
		},
		{
			name: "off",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				bannerToggle = false;

				displayBanner();
				synchro();

				if(checkStorage() == true)
				{
					localStorage.setItem("userBannerPreference", bannerToggle);
				}
			}
		}
	];

	bannerCommands.sort(sortAlphabetically);

	borderCommands = 
	[
		{
			name: "on",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				borderToggle = true;
				
				displayBorder();

				if(checkStorage() == true)
				{
					localStorage.setItem("userBorderPreference", borderToggle);
				}
			}
		},
		{
			name: "off",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				borderToggle = false;
				
				displayBorder();

				if(checkStorage() == true)
				{
					localStorage.setItem("userBorderPreference", borderToggle);
				}
			}
		}
	];

	borderCommands.sort(sortAlphabetically);

	cstmCommands = 
	[
		{
			name: "banner",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 2)
	        	{
	        		executeCommand(commandEntered, splitCommand, 2, bannerCommands, "cstm banner argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(bannerCommands, "cstm banner");
	        	}
	        }
		},
		{
			name: "border",
			display: false,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 2)
	        	{
	        		executeCommand(commandEntered, splitCommand, 2, borderCommands, "cstm border argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(borderCommands, "cstm border");
	        	}
	        }
		},
		{
			name: "theme",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
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
		{
			name: "edtheme",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 2)
	        	{
	        		executeCommand(commandEntered, splitCommand, 2, editThemeCommands, "cstm edtheme argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(editThemeCommands, "cstm edtheme");
	        	}
	        }
		}
	];

	cstmCommands.sort(sortAlphabetically);

	openInNewWindowCommands = 
	[
		{
			name: "on",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				openInNewWindow = true;

				if(checkStorage() == true)
				{
					localStorage.setItem("userNewWindowPreference", openInNewWindow);
				}
			}
		},
		{
			name: "off",
			display: true,
			argumentsNeeded: 0,
			function: () =>
			{
				openInNewWindow = false;

				if(checkStorage() == true)
				{
					localStorage.setItem("userNewWindowPreference", openInNewWindow);
				}
			}
		}
	];

	openInNewWindowCommands.sort(sortAlphabetically);

	editLaunchCommands = 
	[
		{
			name: "set",
			display: true,
			argumentsNeeded: 2,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 3)
	        	{
	        		if(launchTargets.find(target => target.name.toLowerCase() === splitCommand[2].toLowerCase()))
					{
						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "invalid name: " + splitCommand[2] + ", it is already in use";
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
					else if(!isSafeURL( splitCommand[3]))
					{
						let consoleString = createHistoryMessage("console", PREVENT_WRAP);
						consoleString.innerHTML += "invalid url: " + splitCommand[3] + ", incorrect format";
						printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
					}
					else
					{
						launchTargets.push({ name: splitCommand[2], url: splitCommand[3], display: true});

						launchTargets.sort(sortAlphabetically);

						if(checkStorage() == true)
						{
							localStorage.setItem("userLaunchTargetPreference", JSON.stringify(launchTargets));
						}

						launchCommands = 
						[

						];

						updateLaunchCommands();

						launchCommands.sort(sortAlphabetically);

						let consoleString = createHistoryMessage("console", PREVENT_WRAP);
						consoleString.innerHTML += "successfully set: " + splitCommand[2] + " " + splitCommand[3];
						printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
					}
	        	}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: edlaunch set totalprism https://totalprism.com";
					printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
				}
	        }
		},
		{
			name: "remove",
			display: true,
			argumentsNeeded: 1,
			function: (commandEntered, splitCommand) => 
	        {
				if(splitCommand.length > 2)
				{
					let currentLaunchTarget = launchTargets.find(launchTarget => launchTarget.name.toLowerCase() === splitCommand[2].toLowerCase());

					if(!currentLaunchTarget)
					{
						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "invalid name: " + splitCommand[2] + ", not found";
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
					else
					{
						let launchTargetIndex = launchTargets.findIndex(launchTarget => launchTarget.name.toLowerCase() === currentLaunchTarget.name.toLowerCase());
						launchTargets.splice(launchTargetIndex, 1);

						launchTargets.sort(sortAlphabetically);

						if(checkStorage() == true)
						{
							localStorage.setItem("userLaunchTargetPreference", JSON.stringify(launchTargets));
						}

						launchCommands = 
						[

						];

						updateLaunchCommands();

						launchCommands.sort(sortAlphabetically);

						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "successfully removed: " + splitCommand[2];
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
				}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: edlaunch remove totalprism";
					printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
				}
	        }
		},
		{
			name: "reset",
			display: true,
			argumentsNeeded: 0,
			function: (commandEntered, splitCommand) => 
	        {
				launchTargets = JSON.parse(JSON.stringify(defaultLaunchTargets));

				launchTargets.sort(sortAlphabetically);

				if(checkStorage() == true)
				{
					localStorage.removeItem("userLaunchTargetPreference");
				}

				launchCommands = 
				[

				];

				updateLaunchCommands();

				launchCommands.sort(sortAlphabetically);

				let consoleString = createHistoryMessage("console", ALLOW_WRAP);
				consoleString.innerHTML += "successfully reset";
				printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
	        }
		},
		{
			name: "launchinnewpage",
			display: true,
			argumentsNeeded: -1,
			function: (commandEntered, splitCommand) => 
	        {
	        	if(splitCommand.length > 2)
	        	{
	        		executeCommand(commandEntered, splitCommand, 2, openInNewWindowCommands, "edlaunch launchinnewpage argument");
	        	}
	        	else
	        	{
	        		printCommandListOptions(openInNewWindowCommands, "edlaunch launchinnewpage");
	        	}
	        }
	    }
	];

	editLaunchCommands.sort(sortAlphabetically);

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
	];

	commands.sort(sortAlphabetically);

	openInNewWindow = false;

	if(checkStorage() == true)
	{
		if((localStorage.getItem("userNewWindowPreference")) !== null)
		{
			openInNewWindow = JSON.parse(localStorage.getItem("userNewWindowPreference"));
		}
	}

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
			currentTheme = null;
		}
		else
		{
			currentTheme = localStorage.getItem("userThemePreference");
		}
	}
	else
	{
		currentTheme = null;
	}

	changeThemeFromName(currentTheme);
			
	document.getElementById("consolewindow").focus();

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

	document.getElementById("pagefull").addEventListener("scroll", function(event) 
	{
		synchro();
	});

	document.getElementById("consolewindow").value = "help";
	commandEnter(document.getElementById("consolewindow").value);
	document.getElementById("consolewindow").value = "";
	adjustConsoleWindow();
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

function updateLaunchCommands()
{
	for(let i = 0; i < launchTargets.length; i++)
	{
		launchCommands.push({name: launchTargets[i].name, display: launchTargets[i].display, argumentsNeeded: 0, function: () => {launchATarget(launchTargets[i].name);}});
	}
}

function updateThemeCommands()
{
	for(let i = 0; i < themeTargets.length; i++)
	{
		themeCommands.push({name: themeTargets[i].name, display: themeTargets[i].display, argumentsNeeded: 0, function: () => {currentTheme = themeTargets[i].name; changeThemeFromName(currentTheme);}});
	}
}

function launchATarget(targetName)
{
	launchTarget = launchTargets.find(target => target.name.toLowerCase() === targetName.toLowerCase());

	if(launchTarget)
	{
		if(isSafeURL(launchTarget.url))
		{
			if(openInNewWindow)
			{
				window.open(launchTarget.url, "_blank");
			}
			else
			{
				window.location.href = launchTarget.url;
			}
		}
		else
		{
			let consoleString = createHistoryMessage("console", ALLOW_WRAP);
			consoleString.innerHTML += "launch aborted, incorrect url format";
			printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
		}
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
	let selectedTheme = themeTargets.find(theme => theme.name.toLowerCase() === (name || "").toLowerCase());

	if(checkStorage() == true)
	{
		localStorage.setItem("userThemePreference", name);
	}

	if(selectedTheme)
	{
		changetheme(selectedTheme.backgroundColor, selectedTheme.color, selectedTheme.consoleColor, selectedTheme.userColor, selectedTheme.separatorColor);
	}
	else
	{
		if(checkStorage() == true)
		{
			localStorage.removeItem("userThemePreference");
		}

		currentTheme = null;
		changetheme("#000d1a", "#00ffff", "#ff0000", "#00ff00", "#ffffff");
	}
}

function changetheme(backgroundColor, color, consoleColor, userColor, separatorColor)
{
	document.documentElement.style.setProperty('--backgroundcolor', backgroundColor);
	document.documentElement.style.setProperty('--color', color);
	document.documentElement.style.setProperty('--consolecolor', consoleColor);
	document.documentElement.style.setProperty('--usercolor', userColor);
	document.documentElement.style.setProperty('--separator', separatorColor);
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