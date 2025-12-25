function createCSTMCommands()
{
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
}

function createBannerCommands()
{
	bannerCommands = 
	[
		createBooleanToggleCommand("on", true, [displayBanner, synchro], "userBannerPreference", bannerToggle),
		createBooleanToggleCommand("off", false, [displayBanner, synchro], "userBannerPreference", bannerToggle)
	];

	bannerCommands.sort(sortAlphabetically);
}

function createBorderCommands()
{
	borderCommands = 
	[
		createBooleanToggleCommand("on", true, [displayBorder, synchro], "userBorderPreference", borderToggle),
		createBooleanToggleCommand("off", false, [displayBorder, synchro], "userBorderPreference", borderToggle)
	];

	borderCommands.sort(sortAlphabetically);
}
