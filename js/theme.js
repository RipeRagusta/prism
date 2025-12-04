function createThemeCommands()
{
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
			name: "mgnt",
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
}

function createEditThemeCommands()
{
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

						refreshThemeCommands("set");

						let consoleString = createHistoryMessage("console", PREVENT_WRAP);
						consoleString.innerHTML += "successfully set: " + splitCommand[2] + " " + splitCommand[3] + " " + splitCommand[4] + " " + splitCommand[5] + " " + splitCommand[6] + " " + splitCommand[7] + " " + splitCommand[8];
						printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
					}
	        	}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: cstm edtheme set cyan #0d0d0d #00ffff #ff0000 #00ff00 #ffffff" + "\n";
					consoleString.appendChild(consoleDecorSeperatorElement(3, false));
					consoleString.innerHTML += "\n     " + "ex: cstm edtheme set name backgroundcolor maincolor consolecolor usercolor separatorcolor";
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
						let currentThemeTargetNameWithCase = currentThemeTarget.name;
						let themeTargetIndex = themeTargets.findIndex(themeTarget => themeTarget.name.toLowerCase() === currentThemeTarget.name.toLowerCase());
						themeTargets.splice(themeTargetIndex, 1);

						themeTargets.sort(sortAlphabetically);

						refreshThemeCommands("set");

						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "successfully removed: " + currentThemeTargetNameWithCase;
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);

						changeThemeFromName(currentTheme);


					}
				}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: cstm edtheme remove cyan" + "\n";
					consoleString.appendChild(consoleDecorSeperatorElement(3, false));
					consoleString.innerHTML += "\n     " + "ex: cstm edtheme remove name";
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

				refreshThemeCommands("remove");

				currentTheme = null;

				let consoleString = createHistoryMessage("console", ALLOW_WRAP);
				consoleString.innerHTML += "successfully reset";
				printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);

				changeThemeFromName(currentTheme);
	        }
		},
		{
	    	name: "rename",
			display: true,
			argumentsNeeded: 2,
			function: (commandEntered, splitCommand) => 
			{
				if(splitCommand.length > 3)
				{
					let renameTarget = themeTargets.find(target => target.name.toLowerCase() === splitCommand[3].toLowerCase());

					if(renameTarget)
					{
						let renameTargetNameWithCase = renameTarget.name;

						if(renameTargetNameWithCase === splitCommand[4])
						{
							let consoleString = createHistoryMessage("console", ALLOW_WRAP);
							consoleString.innerHTML += "invalid name: " + splitCommand[4] + ", it is identical";
							printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
						}
						else if(splitCommand[3].toLowerCase() === splitCommand[4].toLowerCase())
						{
							if(currentTheme !== null && splitCommand[3].toLowerCase() === currentTheme.toLowerCase())
							{
								currentTheme = splitCommand[4];

								if(checkStorage() == true)
								{
									localStorage.setItem("userThemePreference", currentTheme);
								}
							}
							renameTarget.name = splitCommand[4];
							refreshThemeCommands("set");

							let consoleString = createHistoryMessage("console", ALLOW_WRAP);
							consoleString.innerHTML += "successfully renamed: " + renameTargetNameWithCase + " to " + splitCommand[4];
							printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
						}
						else if(themeTargets.find(target => target.name.toLowerCase() === splitCommand[4].toLowerCase()))
						{
							let consoleString = createHistoryMessage("console", ALLOW_WRAP);
							consoleString.innerHTML += "invalid name: " + splitCommand[4] + ", it is already in use";
							printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
						}
						else
						{
							if(currentTheme !== null && splitCommand[3].toLowerCase() === currentTheme.toLowerCase())
							{
								currentTheme = splitCommand[4];

								if(checkStorage() == true)
								{
									localStorage.setItem("userThemePreference", currentTheme);
								}
							}
							renameTarget.name = splitCommand[4];
							refreshThemeCommands("set");

							let consoleString = createHistoryMessage("console", ALLOW_WRAP);
							consoleString.innerHTML += "successfully renamed: " + renameTargetNameWithCase + " to " + splitCommand[4];
							printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
						}
					}
					else
					{
						let consoleString = createHistoryMessage("console", ALLOW_WRAP);
						consoleString.innerHTML += "invalid name: " + splitCommand[3] + ", not found";
						printMessage(consoleString, PRINT_MESSAGE_WITHOUT_SPACE);
					}
				}
				else
				{
					let consoleString = createHistoryMessage("console", PREVENT_WRAP);
					consoleString.innerHTML += "ex: cstm edtheme rename default dflt" + "\n";
					consoleString.appendChild(consoleDecorSeperatorElement(3, false));
					consoleString.innerHTML += "\n     " + "ex: cstm edtheme rename currentname newname";
					printMessage(consoleString, PRINT_MESSAGE_WITH_SPACE);
				}
			}
	    }
	];

	editThemeCommands.sort(sortAlphabetically);
}

function refreshThemeCommands(removeOrSetLocalStorage)
{
	if(checkStorage() == true)
	{
		if(removeOrSetLocalStorage === "remove")
		{
			localStorage.removeItem("userThemeTargetPreference");
		}
		else
		{
			localStorage.setItem("userThemeTargetPreference", JSON.stringify(themeTargets));
		}
	}

	themeCommands = 
	[

	];

	updateThemeCommands();

	themeCommands.sort(sortAlphabetically);
}

function updateThemeCommands()
{
	for(let i = 0; i < themeTargets.length; i++)
	{
		themeCommands.push({name: themeTargets[i].name, display: themeTargets[i].display, argumentsNeeded: 0, function: () => {currentTheme = themeTargets[i].name; changeThemeFromName(currentTheme);}});
	}
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