var GAME;

var cyberCookies;
var cookiesPerSecondValue;

var buyMode;
var buying;

var rebirths;
var rebirthRate;
var canRebirth;
var rebirthGoal;
var rebirthing;

var cloneCookies;

var intelligenceLevel;
var reflexesLevel;
var powerLevel;

var amountOfContractsAcceptable;
var CONTRACTAMOUNT;
var contractHolderFinal; 
var contractType;
var contractsAllowed;

var autoContractsToggle;
var autoContractsOwned;

var upgradeHolderFinal;
var UPGRADEAMOUNT;

var TICKRATE; 
var RUNNING;

var contractsCompleted;
var howManyContractsAccepted;

var currentMobilePage;

var loadingStuff;

function initialize() 
{
	loadingStuff = false;
	buying = false;
	rebirthing = false;

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedIntelligenceLevel") === null)
		{
			intelligenceLevel = 0;
		}
		else
		{
			intelligenceLevel = parseInt(localStorage.getItem("savedIntelligenceLevel")); 
		}
	}
	else
	{
		intelligenceLevel = 0;
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedReflexesLevel") === null)
		{
			reflexesLevel = 0;
		}
		else
		{
			reflexesLevel = parseInt(localStorage.getItem("savedReflexesLevel")); 
		}
	}
	else
	{
		reflexesLevel = 0;
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedPowerLevel") === null)
		{
			powerLevel = 0;
		}
		else
		{
			powerLevel = parseInt(localStorage.getItem("savedPowerLevel")); 
		}
	}
	else
	{
		powerLevel = 0;
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedMobilePage") === null)
		{
			currentMobilePage = 0;
		}
		else
		{
			currentMobilePage = parseInt(localStorage.getItem("savedMobilePage")); 
		}
	}
	else
	{
		currentMobilePage = 0;
	}

	checkDisplay();

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedRebirthCount") === null)
		{
			rebirths = 0;
		}
		else
		{
			rebirths = parseInt(localStorage.getItem("savedRebirthCount")); 
		}
	}
	else
	{
		rebirths = 0;
	}

	setRibirthRate();
	
	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedRebirthGoal") === null)
		{
			rebirthGoal = 100000000000000;
		}
		else
		{
			rebirthGoal = parseInt(localStorage.getItem("savedRebirthGoal")); 
		}
	}
	else
	{
		rebirthGoal = 100000000000000;
	}
	
	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedBuyMode") === null)
		{
			buyMode = 0;
		}
		else
		{
			buyMode = parseInt(localStorage.getItem("savedBuyMode"));
		}
	}
	else
	{
		buyMode = 0;
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedBankTotal") === null)
		{
			cyberCookies = 0; 
		}
		else
		{
			cyberCookies = parseInt(localStorage.getItem("savedBankTotal")); 
		}
	}
	else
	{
		cyberCookies = 0; 
	}

	if(cyberCookies >= rebirthGoal)
	{
		canRebirth = true;
	}
	else
	{
		canRebirth = false;
	}

	cookiesPerSecondValue = 0; 
	contractsCompleted = 0;
	howManyContractsAccepted = 0;
	amountOfContractsAcceptable = 1 + rebirths;
	contractType = ["Hit", "Race", "Hack"];
	CONTRACTAMOUNT = 6;

	if(checkStorage() == true)
	{
		if((localStorage.getItem("savedContractList")) === null)
		{
			contractHolderFinal = new Array(CONTRACTAMOUNT);
			initializeContracts(CONTRACTAMOUNT);
		}
		else
		{
			contractHolderFinal = JSON.parse(localStorage.getItem("savedContractList"));
		}
	}
	else
	{
		contractHolderFinal = new Array(CONTRACTAMOUNT);
		initializeContracts(CONTRACTAMOUNT);
	}

	UPGRADEAMOUNT = 8;
	upgradeHolderFinal = new Array(UPGRADEAMOUNT);
	
	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedUpgradesList") === null)
		{
			createUpgrades();
		}
		else
		{
			upgradeHolderFinal = JSON.parse(localStorage.getItem("savedUpgradesList"));
			upgradeHolderFinal = upgradeHolderFinal.map(obj => new upgrade(obj.cost, obj.owned, obj.addAmount, obj.costMultiplier, obj.addMultiplier));
		}
	}
	else
	{
		createUpgrades();
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedAutoContractsToggle") === null)
		{
			autoContractsToggle = false;
		}
		else
		{
			autoContractsToggle = JSON.parse(localStorage.getItem("savedAutoContractsToggle"));
		}
	}
	else
	{
		autoContractsToggle = false;
	}

	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedAutoContractsOwned") === null)
		{
			autoContractsOwned = false;
		}
		else
		{
			autoContractsOwned = JSON.parse(localStorage.getItem("savedAutoContractsOwned"));
		}
	}
	else
	{
		autoContractsOwned = false;
	}
	
	if(checkStorage() == true)
	{
		if(localStorage.getItem("savedCloneCookies") === null)
		{
			cloneCookies = 0;
		}
		else
		{
			cloneCookies = parseInt(localStorage.getItem("savedCloneCookies")); 
		}
	}

	tick = 0;
	TICKRATE = 1000;

	document.getElementById("importfile").addEventListener("change", function() 
  	{
  		let file = this.files[0];

		if (file) 
  		{
   			let reader = new FileReader();
   			
   			reader.onload = function(event)
   			{
   				loadingStuff = true;
   				clearInterval(GAME);
   				let saveData = JSON.parse(event.target.result);

   				if(saveData.cyberCookies !== undefined)
   				{
   					cyberCookies = saveData.cyberCookies;
   				}

   				if(saveData.cloneCookies !== undefined)
   				{
   					cloneCookies = saveData.cloneCookies;
   				}

   				if(saveData.contractHolderFinal !== undefined)
   				{
   					contractHolderFinal = saveData.contractHolderFinal;
   				}

   				if(saveData.rebirths !== undefined)
   				{
   					rebirths = saveData.rebirths;
   				}

   				if(saveData.rebirthGoal !== undefined)
   				{
   					rebirthGoal = saveData.rebirthGoal;
   				}

   				if(saveData.upgradeHolderFinal !== undefined)
   				{
   					upgradeHolderFinal = saveData.upgradeHolderFinal;
   					upgradeHolderFinal = upgradeHolderFinal.map(obj => new upgrade(obj.cost, obj.owned, obj.addAmount, obj.costMultiplier, obj.addMultiplier));
   				}

   				if(saveData.autoContractsToggle !== undefined)
   				{
   					autoContractsToggle = saveData.autoContractsToggle;
   				}

   				if(saveData.autoContractsOwned !== undefined)
   				{
   					autoContractsOwned = saveData.autoContractsOwned;
   				}

   				if(saveData.intelligenceLevel !== undefined)
   				{
   					intelligenceLevel = saveData.intelligenceLevel;
   				}

   				if(saveData.reflexesLevel !== undefined)
   				{
   					reflexesLevel = saveData.reflexesLevel;
   				}

   				if(saveData.powerLevel !== undefined)
   				{
   					powerLevel = saveData.powerLevel;
   				}
   				
   				if(checkStorage() == true)
   				{
					localStorage.setItem("savedBankTotal", cyberCookies); 
					localStorage.setItem("savedContractList", JSON.stringify(contractHolderFinal));
					localStorage.setItem("savedUpgradesList", JSON.stringify(upgradeHolderFinal));
					localStorage.setItem("savedRebirthCount", rebirths);
					localStorage.setItem("savedRebirthGoal", rebirthGoal);
					localStorage.setItem("savedAutoContractsToggle", autoContractsToggle);
					localStorage.setItem("savedAutoContractsOwned", autoContractsOwned);
					localStorage.setItem("savedCloneCookies", cloneCookies);
					localStorage.setItem("savedIntelligenceLevel", intelligenceLevel);
					localStorage.setItem("savedReflexesLevel", reflexesLevel);
					localStorage.setItem("savedPowerLevel", powerLevel);
   				}

   				setRibirthRate();
   				checkRebirthGoal();
   				amountOfContractsAcceptable = 1 + rebirths;
   				document.getElementById("importfile").value = "";
   				updateScreen();
   				GAME = setInterval(ticking, TICKRATE);
   				loadingStuff = false;
   			}

   			reader.onerror = function(event) 
   			{
                console.error("Error reading save data");
            }

            reader.readAsText(file);
   		}
  	});

	RUNNING = true;
	running();
	updateScreen();
}

function checkRebirthGoal()
{
	if(cyberCookies >= rebirthGoal)
	{
		canRebirth = true;
	}
	else
	{
		canRebirth = false;
	}
}

function rebirthProcess()
{
	var clickedOnce = false;

	if(canRebirth == true)
	{
		document.getElementById("rebirtbutton").innerHTML = "Are you sure?";
	}

	document.getElementById("rebirtbutton").addEventListener("click", () => 
	{
		if(canRebirth == true && clickedOnce == true && rebirthing == false)
		{
			rebirthing = true;
			clearInterval(GAME);
			rebirths += 1;
			amountOfContractsAcceptable += 1;
			document.getElementById("rebirtbutton").innerHTML = "Clone?";
			cyberCookies = 0;
			setRibirthRate();
			createUpgrades();
			cookiesPerSecond();
			initializeContracts(CONTRACTAMOUNT);
			rebirthGoal = parseInt(rebirthGoal * 1.05);
			canRebirth = false;
			cloneCookies += 3;

			if(checkStorage() == true)
			{
				localStorage.setItem("savedBankTotal", cyberCookies); 
				localStorage.setItem("savedContractList", JSON.stringify(contractHolderFinal));
				localStorage.setItem("savedUpgradesList", JSON.stringify(upgradeHolderFinal));
				localStorage.setItem("savedRebirthCount", rebirths);
				localStorage.setItem("savedRebirthGoal", rebirthGoal);
				localStorage.setItem("savedCloneCookies", cloneCookies);
			}

			updateScreen();
			rebirthing = false;
			clickedOnce = false;
			GAME = setInterval(ticking, TICKRATE);
		}
	});

	clickedOnce = true;

	document.getElementById("rebirtbutton").addEventListener("mouseout", () => 
	{
		document.getElementById("rebirtbutton").innerHTML = "Clone?";
		clickedOnce = false;
		updateScreen();
	});
}

function saveGame()
{
	if(checkStorage() == true && rebirthing == false && loadingStuff == false)
	{
		try
		{
			localStorage.setItem("savedBankTotal", cyberCookies); 
			localStorage.setItem("savedContractList", JSON.stringify(contractHolderFinal));
			localStorage.setItem("savedUpgradesList", JSON.stringify(upgradeHolderFinal));
		}
		catch(e)
		{
			console.log("Save game error");
		}
	}
}

function updateScreen()
{
	document.getElementById("rebirthcount").innerHTML = formatMyNumber(rebirths);
	document.getElementById("bank").innerHTML = formatMyNumber(cyberCookies);

	for (let i = 0; i < CONTRACTAMOUNT; i++) 
	{
		if(contractHolderFinal[i][3] == true)
		{
			document.getElementById("acceptedstatus" + i).innerHTML = "Accepted";
			document.getElementById("acceptedstatus" + i).style.color = "black";
			document.getElementById("contractbutton" + i).style.color = "black";
			document.getElementById("contractbutton" + i).style.background = "repeating-linear-gradient(180deg, #00e6e6, cyan calc(0.3 * var(--sizer)), white calc(0.3 * var(--sizer)))"; 
		}
		else if((contractHolderFinal[i][3] == false) && (canAcceptContract() == true))
		{
			document.getElementById("acceptedstatus" + i).innerHTML = "Accept?";
			document.getElementById("acceptedstatus" + i).style.color = "lime";
			document.getElementById("contractbutton" + i).style.color = "";
			document.getElementById("contractbutton" + i).style.background = ""; 
		}
		else if((contractHolderFinal[i][3] == false) && (canAcceptContract() == false))
		{
			document.getElementById("acceptedstatus" + i).innerHTML = "Can't Accept";
			document.getElementById("acceptedstatus" + i).style.color = "red";
			document.getElementById("contractbutton" + i).style.color = "";
			document.getElementById("contractbutton" + i).style.background = ""; 
		}
		
		document.getElementById("contracttype" + i).innerHTML = (contractHolderFinal[i][0]);
		document.getElementById("contracttime" + i).innerHTML = formatMyNumber(contractHolderFinal[i][1]);
		document.getElementById("contractreward" + i).innerHTML = formatMyNumber(contractHolderFinal[i][2]);
	}

	for (let i = 0; i < UPGRADEAMOUNT; i++) 
	{
		switch(buyMode)
		{
			case 0:
				document.getElementById("upgradeprice" + i).innerHTML = formatMyNumber(getProjectedPrice(i, 1));
				document.getElementById("upgradeowned" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getOwned());
				document.getElementById("upgraderate" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getAddAmount());
				document.getElementById("upgrademaxavailable" + i).innerHTML = formatMyNumber(getMaxAfford(i));

				if(getMaxAfford(i) == 0)
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid red";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid red";
				}
				else
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid lime";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid lime";
				}

				break;

			case 1:
				document.getElementById("upgradeprice" + i).innerHTML = formatMyNumber(getProjectedPrice(i, 10));
				document.getElementById("upgradeowned" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getOwned());
				document.getElementById("upgraderate" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getAddAmount());
				document.getElementById("upgrademaxavailable" + i).innerHTML = formatMyNumber(getMaxAfford(i));

				if(getMaxAfford(i) < 10)
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid red";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid red";
				}
				else
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid lime";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid lime";
				}

				break;

			case 2:
				document.getElementById("upgradeprice" + i).innerHTML = formatMyNumber(getProjectedPrice(i, 100));
				document.getElementById("upgradeowned" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getOwned());
				document.getElementById("upgraderate" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getAddAmount());
				document.getElementById("upgrademaxavailable" + i).innerHTML = formatMyNumber(getMaxAfford(i));

				if(getMaxAfford(i) < 100)
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid red";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid red";
				}
				else
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid lime";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid lime";
				}

				break;

			case 3:
				document.getElementById("upgradeprice" + i).innerHTML = formatMyNumber(getMaxPrice(i));
				document.getElementById("upgradeowned" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getOwned());
				document.getElementById("upgraderate" + i).innerHTML = formatMyNumber(upgradeHolderFinal[i].getAddAmount());
				document.getElementById("upgrademaxavailable" + i).innerHTML = formatMyNumber(getMaxAfford(i));

				if(getMaxAfford(i) == 0)
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid red";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid red";
				}
				else
				{
					document.getElementById("upgrade" + i).style.borderLeft = "calc(0.1 * var(--sizer)) solid lime";
					document.getElementById("upgrade" + i).style.borderTop = "calc(0.1 * var(--sizer)) solid lime";
				}

				break;

			default:
				console.log("Invalid buy mode type");
				break;
		}
	}
		
	for (let i = 1; i < UPGRADEAMOUNT; i++) 
	{
		if(upgradeHolderFinal[i - 1].getOwned() == 0)
		{
			document.getElementById("upgrade" + i).style.display = "none";
		}
		else if(upgradeHolderFinal[i - 1].getOwned() > 0)
		{
			document.getElementById("upgrade" + i).style.display = "block";
		}
	}

	cookiesPerSecond();
	document.getElementById("cookiespersec").innerHTML = formatMyNumber(cookiesPerSecondValue);

	for(let i = 0; i < 4; i++)
	{
		document.getElementById("buymodebutton" + i).style.background = "";
		document.getElementById("buymodebutton" + i).style.color = "";
	}

	document.getElementById("buymodebutton" + buyMode).style.background = "repeating-linear-gradient(180deg, #00e6e6, cyan calc(0.3 * var(--sizer)), white calc(0.3 * var(--sizer)))";
	document.getElementById("buymodebutton" + buyMode).style.color = "black";

	for(let i = 0; i < 4; i++)
	{
		document.getElementById("pagebutton" + i).style.color = "cyan";
	}

	document.getElementById("pagebutton" + currentMobilePage).style.color = "white";

	if(canRebirth == true)
	{
		document.getElementById("rebirtbutton").style.background = "repeating-linear-gradient(180deg, #00cc00, green calc(0.3 * var(--sizer)), lime calc(0.3 * var(--sizer)))";
	}
	else
	{
		document.getElementById("rebirtbutton").style.background = "repeating-linear-gradient(180deg, #660000,  #b30000 calc(0.3 * var(--sizer)), red calc(0.3 * var(--sizer)))";
	}

	document.getElementById("rebirthgoal").innerHTML = formatMyNumber(rebirthGoal);

	if(autoContractsOwned == false && cloneCookies >= 1)
	{
		document.getElementById("autocontractsheader").style.color = "lime";
		document.getElementById("autocontractsbutton").style.color = "";
		document.getElementById("autocontractscontainer").style.background = "";
		document.getElementById("autocontractspricetoggle").innerHTML = "Price: 1 CloneCookie";
	}
	else if(autoContractsOwned == false && cloneCookies < 1)
	{
		document.getElementById("autocontractsheader").style.color = "red";
		document.getElementById("autocontractsbutton").style.color = "";
		document.getElementById("autocontractscontainer").style.background = "";
		document.getElementById("autocontractspricetoggle").innerHTML = "Price: 1 CloneCookie";
	}

	if(autoContractsOwned == true && autoContractsToggle == true)
	{
		document.getElementById("autocontractsheader").style.color = "black";
		document.getElementById("autocontractsbutton").style.color = "black";
		document.getElementById("autocontractscontainer").style.background = "repeating-linear-gradient(180deg, #00e6e6, cyan calc(0.3 * var(--sizer)), white calc(0.3 * var(--sizer)))";
		document.getElementById("autocontractspricetoggle").innerHTML = "On";
	}
	else if(autoContractsOwned == true && autoContractsToggle == false)
	{
		document.getElementById("autocontractsheader").style.color = "lime";
		document.getElementById("autocontractsbutton").style.color = "";
		document.getElementById("autocontractscontainer").style.background = "";
		document.getElementById("autocontractspricetoggle").innerHTML = "Off";
	}

	document.getElementById("clonecookies").innerHTML = cloneCookies;
	document.getElementById("intelligencelevel").innerHTML = intelligenceLevel;
	document.getElementById("reflexeslevel").innerHTML = reflexesLevel;
	document.getElementById("powerlevel").innerHTML = powerLevel;
}

function formatMyNumber(number)
{
	if(number > 1000000000000)
	{
		return Intl.NumberFormat(navigator.language || "en-US", {notation: "compact",}).format(number);
	}
	else
	{
		return number.toLocaleString();
	}
}

function ticking()
{
	contractCountdown();
	addUpgradeCookies();
	saveGame();
	cookiesPerSecond();
	checkRebirthGoal();
	autoContractsSelect();
	updateScreen();
}

function running()
{
	if(RUNNING == true)
	{
		GAME = setInterval(ticking, TICKRATE);
		//console.log("Running");
	}
	else
	{
		console.log("Failed running");
	}
}

function cookiesPerSecond()
{
	cookiesPerSecondValue = 0;

	for (let i = 0; i < UPGRADEAMOUNT; i++) 
	{
		if(upgradeHolderFinal[i].getOwned() > 0)
		{
			cookiesPerSecondValue = cookiesPerSecondValue + upgradeHolderFinal[i].getAddAmount();
		}
	}
}

function generateContract(number)
{
	let randomIntHolder = Math.floor(Math.random() * contractType.length); 
	let randomTypeHolder = contractType[randomIntHolder]; 
	let contractTypeHolder = randomTypeHolder;
	let contractAcceptedHolder = false;

	switch(randomTypeHolder)
	{
		case "Hit":
			var contractTimeHolder = Math.max(1, Math.floor((Math.random() * (361 - 300 + 1) + 300)) - powerLevel);
			var contractAmountHolder = Math.floor(Math.random() * (80000 - 5000 + 1) + 5000);
			break;

		case "Race":
			var contractTimeHolder = Math.max(1, Math.floor((Math.random() * (181 - 120 + 1) + 120)) - reflexesLevel);
			var contractAmountHolder = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
			break;

		case "Hack":
			var contractTimeHolder = Math.max(1, Math.floor(Math.random() * (46 - 20 + 1) + 20) - intelligenceLevel);
			var contractAmountHolder = Math.floor(Math.random() * (30000 - 250000 + 1) + 250000);
			break;

		default:
			console.log("Invalid contract type");
			break;
	}

	contractAmountHolder = parseInt((contractAmountHolder * (1 + (0.10 * cookiesPerSecondValue))));
	let contractPropertiesHolder = [contractTypeHolder, contractTimeHolder, contractAmountHolder, contractAcceptedHolder];
	contractHolderFinal[number] = contractPropertiesHolder;
}

function initializeContracts(amount)
{
	for (let i = 0; i < amount; i++)
	{
		generateContract(i);
	}
}

function canAcceptContract()
{
	howManyContractsAccepted = 0;

	for (let i = 0; i < contractHolderFinal.length; i++) 
	{
		if(contractHolderFinal[i][3] == true)
		{
			howManyContractsAccepted = howManyContractsAccepted + 1;
		}
	}

	if(howManyContractsAccepted < amountOfContractsAcceptable)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function acceptContract(idNumber)
{ 
	if(canAcceptContract() == true)
	{
		contractHolderFinal[idNumber][3] = true;
	}

	updateScreen();
}

function contractCountdown()
{
	for (let i = 0; i < contractHolderFinal.length; i++) 
	{ 
		if((contractHolderFinal[i][3] == true) && (contractHolderFinal[i][1] > 1)) 
		{
			contractHolderFinal[i][1] = contractHolderFinal[i][1] - 1; 
		}
		else if ((contractHolderFinal[i][3] == true) && (contractHolderFinal[i][1] <= 1)) 
		{
			contractAccepted = false; 
			contractsCompleted = contractsCompleted + 1;
			cyberCookies = cyberCookies + contractHolderFinal[i][2]; 
			contractHolderFinal.splice(i, 1); 
			generateContract(CONTRACTAMOUNT - 1); 
		}
	}
}

function clickedCookie() 
{
	cyberCookies = cyberCookies + 1; 
	updateScreen();
}

function setRibirthRate()
{
	rebirthRate = 1 + (rebirths);
}

function addUpgradeCookies()
{
	for(let i = 0; i < UPGRADEAMOUNT; i++)
	{
		if(upgradeHolderFinal[i].getOwned() > 0)
		{
			cyberCookies = cyberCookies + upgradeHolderFinal[i].getAddAmount();
		}
	}
}

function createUpgrades()
{
	for(let i = 0; i < UPGRADEAMOUNT; i++)
	{
		switch(i)
		{
			case 0:
				upgradeHolderFinal[i] = new upgrade(10, 0, (1 * (rebirthRate)), 1.1, (1 * (rebirthRate)));
				break;

			case 1:
				upgradeHolderFinal[i] = new upgrade(100, 0, (10 * (rebirthRate)), 1.2, (10 * (rebirthRate)));
				break;

			case 2:
				upgradeHolderFinal[i] = new upgrade(1000, 0, (100 * (rebirthRate)), 1.3, (100 * (rebirthRate)));
				break;

			case 3:
				upgradeHolderFinal[i] = new upgrade(10000, 0, (1000 * (rebirthRate)), 1.2, (1000 * (rebirthRate)));
				break;

			case 4:
				upgradeHolderFinal[i] = new upgrade(100000, 0, (10000 * (rebirthRate)), 1.1, (10000 * (rebirthRate)));
				break;

			case 5:
				upgradeHolderFinal[i] = new upgrade(1000000, 0, (100000 * (rebirthRate)), 1.2, (100000 * (rebirthRate)));
				break;

			case 6:
				upgradeHolderFinal[i] = new upgrade(10000000, 0, (1000000 * (rebirthRate)), 1.3, (1000000 * (rebirthRate)));
				break;

			case 7:
				upgradeHolderFinal[i] = new upgrade(100000000, 0, (10000000 * (rebirthRate)), 1.4, (10000000 * (rebirthRate)));
				break;

			default:
				console.log("Invalid upgrade number");
				break;
		}
	}
}

function getMaxAfford(ident) 
{
	var i = 0;
	var currentCheckedPrice = getProjectedPrice(ident, i);
	
	while(currentCheckedPrice <= cyberCookies)
	{
		i++;
		currentCheckedPrice = getProjectedPrice(ident, i);
	}

	if(i <= 0)
	{
		i = 1;
	}

	return (i - 1);
}

function getMaxRate(ident)
{
	return getProjectedRate(ident, getMaxAfford(ident));
}

function getMaxPrice(ident)
{
	return getProjectedPrice(ident, getMaxAfford(ident));
}

function getProjectedRate(ident, amount)
{
	var	holdervalue = parseInt(upgradeHolderFinal[ident].getAddAmount());
	var projectedRate = holdervalue;

	if(upgradeHolderFinal[ident].getOwned() == 0)
	{
		for(let i = 0; i < amount - 1; i++)
		{
			holdervalue = holdervalue + upgradeHolderFinal[ident].getAddMultiplier();
		}
	}
	else
	{
		for(let i = 0; i < amount; i++)
		{
			holdervalue = holdervalue + upgradeHolderFinal[ident].getAddMultiplier();
		}
	}

	projectedRate = holdervalue;
	return projectedRate;
}

function getProjectedPrice(ident, amount)
{
	var	holdervalue = parseInt(upgradeHolderFinal[ident].getCost());
	var projectedAmount = holdervalue;

	for(let i = 0; i < amount - 1; i++)
	{
		holdervalue = parseInt(holdervalue * upgradeHolderFinal[ident].getCostMultiplier());
		projectedAmount += holdervalue;
	}

	return projectedAmount;
}

function upgradeCookieExchange(ident, amount)
{
	if(upgradeHolderFinal[ident].getOwned() == 0)
	{
		upgradeHolderFinal[ident].setCost(parseInt(upgradeHolderFinal[ident].getCost() * upgradeHolderFinal[ident].getCostMultiplier()));
		upgradeHolderFinal[ident].setOwned(upgradeHolderFinal[ident].getOwned() + 1);

		for(let i = 0; i < amount - 1; i++)
		{
			upgradeHolderFinal[ident].setCost(parseInt(upgradeHolderFinal[ident].getCost() * upgradeHolderFinal[ident].getCostMultiplier()));
			upgradeHolderFinal[ident].setAddAmount(upgradeHolderFinal[ident].getAddAmount() + upgradeHolderFinal[ident].getAddMultiplier());
			upgradeHolderFinal[ident].setOwned(upgradeHolderFinal[ident].getOwned() + 1);
		}
	}
	else
	{
		for(let i = 0; i < amount; i++)
		{
			upgradeHolderFinal[ident].setCost(parseInt(upgradeHolderFinal[ident].getCost() * upgradeHolderFinal[ident].getCostMultiplier()));
			upgradeHolderFinal[ident].setAddAmount(upgradeHolderFinal[ident].getAddAmount() + upgradeHolderFinal[ident].getAddMultiplier());
			upgradeHolderFinal[ident].setOwned(upgradeHolderFinal[ident].getOwned() + 1);
		}
	}	
}

function buyUpgrade(ident) 
{
	if(buying == false)
	{
		buying = true;
		var selectedPrice;

		switch(buyMode)
		{
			case 0:
				selectedPrice = upgradeHolderFinal[ident].getCost();
				if(selectedPrice <= cyberCookies)
				{
					upgradeCookieExchange(ident, 1);
					cyberCookies = cyberCookies - selectedPrice;
				}
				break;

			case 1:
				selectedPrice = getProjectedPrice(ident, 10);
				if(selectedPrice <= cyberCookies)
				{
					upgradeCookieExchange(ident, 10);
					cyberCookies = cyberCookies - selectedPrice;
				}
				break;

			case 2:
				selectedPrice = getProjectedPrice(ident, 100);
				if(selectedPrice <= cyberCookies)
				{
					upgradeCookieExchange(ident, 100);
					cyberCookies = cyberCookies - selectedPrice;
				}
				break;

			case 3:
				selectedPrice = getProjectedPrice(ident, getMaxAfford(ident));
				if(selectedPrice <= cyberCookies)
				{
					upgradeCookieExchange(ident, getMaxAfford(ident));
					cyberCookies = cyberCookies - selectedPrice;
				}
				break;

			default:
			 	console.log("Invalid buy mode type");
			 	break;
		}

		updateScreen();
		buying = false;
	}
}

class upgrade
{
	constructor(price, obtained, addition, priceMultiplier, additionMultiplier)
	{
		this.cost = price; 
		this.owned = obtained; 
		this.addAmount = addition; 
		this.costMultiplier = priceMultiplier; 
		this.addMultiplier = additionMultiplier; 
	}

	getCost()
	{
		return this.cost;
	}

	getOwned()
	{
		return this.owned;
	}

	getAddAmount()
	{
		return this.addAmount;
	}

	getCostMultiplier()
	{
		return this.costMultiplier;
	}

	getAddMultiplier()
	{
		return this.addMultiplier;
	}

	setCost(price)
	{
		this.cost = price;
	}

	setOwned(obtained)
	{
		this.owned = obtained;
	}

	setAddAmount(addition)
	{
		this.addAmount = addition;
	}

	setCostMultiplier(priceMultiplier)
	{
		this.costMultiplier = priceMultiplier;
	}

	setAddMultiplier(additionMultiplier)
	{
		this.addMultiplier = additionMultiplier;
	}
}

function changeBuyMode(type)
{
	buyMode = type;

	if(checkStorage() == true)
	{
		localStorage.setItem("savedBuyMode", buyMode);
	}

	updateScreen();
}

function changePage(page)
{
	switch(page)
	{
		case 0:
			document.getElementById("left").style.display = "block";
			document.getElementById("middle").style.display = "none";
			document.getElementById("middle2").style.display = "none";
			document.getElementById("right").style.display = "none";
			break;

		case 1:
			document.getElementById("left").style.display = "none";
			document.getElementById("middle").style.display = "block";
			document.getElementById("middle2").style.display = "none";
			document.getElementById("right").style.display = "none";
			break;

		case 2:
			document.getElementById("left").style.display = "none";
			document.getElementById("middle").style.display = "none";
			document.getElementById("middle2").style.display = "none";
			document.getElementById("right").style.display = "block";
			break;

		case 3:
			document.getElementById("left").style.display = "none";
			document.getElementById("middle").style.display = "none";
			document.getElementById("middle2").style.display = "block";
			document.getElementById("right").style.display = "none";
			break;

		default:
			console.log("Invalid page type");
			break;
	}

	currentMobilePage = page;

	if(checkStorage() == true)
	{
		localStorage.setItem("savedMobilePage", currentMobilePage);
	}

	updateScreen();
}

function checkDisplay()
{
	if(window.innerWidth >= 601) 
	{
		document.getElementById("left").style.display = "block";
		document.getElementById("middle").style.display = "block";
		document.getElementById("middle2").style.display = "block";
		document.getElementById("right").style.display = "block";
	}
	else
	{
		switch(currentMobilePage)
		{
			case 0:
				document.getElementById("left").style.display = "block";
				document.getElementById("middle").style.display = "none";
				document.getElementById("middle2").style.display = "none";
				document.getElementById("right").style.display = "none";
				break;

			case 1:
				document.getElementById("left").style.display = "none";
				document.getElementById("middle").style.display = "block";
				document.getElementById("middle2").style.display = "none";
				document.getElementById("right").style.display = "none";
				break;

			case 2:
				document.getElementById("left").style.display = "none";
				document.getElementById("middle").style.display = "none";
				document.getElementById("middle2").style.display = "none";
				document.getElementById("right").style.display = "block";
				break;

			case 3:
				document.getElementById("left").style.display = "none";
				document.getElementById("middle").style.display = "none";
				document.getElementById("middle2").style.display = "block";
				document.getElementById("right").style.display = "none";
				break;

			default:
				console.log("Invalid page type");
				break;
		}
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

function buyAutoContracts()
{
	if(buying == false)
	{
		buying = true;

		if(autoContractsOwned == true)
		{
			if(autoContractsToggle == true)
			{
				autoContractsToggle = false;
			}
			else
			{
				autoContractsToggle = true;
			}

			if(checkStorage() == true)
			{
				localStorage.setItem("savedAutoContractsToggle", autoContractsToggle);
			}

			autoContractsSelect();
			updateScreen();
		}
		else if(cloneCookies >= 1 && autoContractsOwned == false)
		{
			cloneCookies -= 1;
			autoContractsOwned = true;

			if(checkStorage() == true)
			{
				localStorage.setItem("savedCloneCookies", cloneCookies);
				localStorage.setItem("savedAutoContractsOwned", autoContractsOwned);
			}

			updateScreen();
		}

		buying = false;
	}
}

function autoContractsSelect()
{
	for(let i = 0; i < CONTRACTAMOUNT; i++)
	{
		if(canAcceptContract() == true && autoContractsToggle == true)
		{
			contractHolderFinal[i][3] = true;
		}
	}
}

function exportSave()
{
	let data;

	if(checkStorage() == true)
	{
 		data = 
		{
			cloneCookies: localStorage.getItem("savedCloneCookies") ? JSON.parse(localStorage.getItem("savedCloneCookies")) : 0,
			cyberCookies: localStorage.getItem("savedBankTotal") ? JSON.parse(localStorage.getItem("savedBankTotal")) : 0, 
	    	contractHolderFinal: localStorage.getItem("savedContractList") ? JSON.parse(localStorage.getItem("savedContractList")) : null,
	    	rebirths: localStorage.getItem("savedRebirthCount") ? JSON.parse(localStorage.getItem("savedRebirthCount")) : 0,
	    	rebirthGoal: localStorage.getItem("savedRebirthGoal") ? JSON.parse(localStorage.getItem("savedRebirthGoal")) : 100000000000000,
	    	upgradeHolderFinal: localStorage.getItem("savedUpgradesList") ? JSON.parse(localStorage.getItem("savedUpgradesList")) : null,
	    	autoContractsToggle: localStorage.getItem("savedAutoContractsToggle") ? JSON.parse(localStorage.getItem("savedAutoContractsToggle")) : false,
	    	autoContractsOwned: localStorage.getItem("savedAutoContractsOwned") ? JSON.parse(localStorage.getItem("savedAutoContractsOwned")) : false,
	    	intelligenceLevel: localStorage.getItem("savedIntelligenceLevel") ? JSON.parse(localStorage.getItem("savedIntelligenceLevel")) : 0,
	    	reflexesLevel: localStorage.getItem("savedReflexesLevel") ? JSON.parse(localStorage.getItem("savedReflexesLevel")) : 0,
	    	powerLevel: localStorage.getItem("savedPowerLevel") ? JSON.parse(localStorage.getItem("savedPowerLevel")) : 0
		}
	}
	else
	{
		data = 
		{
			cloneCookies: cloneCookies ? JSON.parse(cloneCookies) : 0,
			cyberCookies: cyberCookies ? JSON.parse(cyberCookies) : 0, 
	    	contractHolderFinal: JSON.stringify(contractHolderFinal) ? JSON.parse(JSON.stringify(contractHolderFinal)) : null,
	    	rebirths: rebirths ? JSON.parse(rebirths) : 0,
	    	rebirthGoal: rebirthGoal ? JSON.parse(rebirthGoal) : 100000000000000,
	    	upgradeHolderFinal: JSON.stringify(upgradeHolderFinal) ? JSON.parse(JSON.stringify(upgradeHolderFinal)) : null,
	    	autoContractsToggle: autoContractsToggle ? JSON.parse(autoContractsToggle) : false,
	    	autoContractsOwned: autoContractsOwned ? JSON.parse(autoContractsOwned) : false,
	    	intelligenceLevel: intelligenceLevel ? JSON.parse(intelligenceLevel) : 0,
	    	reflexesLevel: reflexesLevel ? JSON.parse(reflexesLevel) : 0,
	    	powerLevel: powerLevel ? JSON.parse(powerLevel) : 0
		}
	}
	
	let jsonData = JSON.stringify(data);
	let filename = "cyberclicker.json";
  	let blob = new Blob([jsonData], { type: 'application/json' });
 	let url = URL.createObjectURL(blob);
  	let a = document.createElement('a');
 	a.href = url;
  	a.download = filename;
 	document.body.appendChild(a);
 	a.click();
 	document.body.removeChild(a);
  	URL.revokeObjectURL(url);
}

function importSave(argument) 
{
	let fileInput = document.getElementById("importfile");
	fileInput.click();
}

function levelUp(type)
{
	if(buying == false)
	{
		buying = true;

		if(cloneCookies >= 1)
		{
			switch (type)
			{
				case 0:
					if(intelligenceLevel < 45)
					{
						cloneCookies -= 1;
						intelligenceLevel += 1;
					}

					if(checkStorage() == true)
					{
						localStorage.setItem("savedIntelligenceLevel", intelligenceLevel);
					}

					break;

				case 1:
					if(reflexesLevel < 180)
					{
						cloneCookies -= 1;
						reflexesLevel += 1;
					}
					
					if(checkStorage() == true)
					{
						localStorage.setItem("savedReflexesLevel", reflexesLevel);
					}

					break;

				case 2:
					if(powerLevel < 360)
					{
						cloneCookies -= 1;
						powerLevel += 1;
					}

					if(checkStorage() == true)
					{
						localStorage.setItem("savedPowerLevel", powerLevel);
					}

					break;

				default:
					console.log("Invalid level type");
					break;
			}

			if(checkStorage() == true)
			{
				localStorage.setItem("savedCloneCookies", cloneCookies);
			}
		}

		updateScreen();
		buying = false;
	}
}