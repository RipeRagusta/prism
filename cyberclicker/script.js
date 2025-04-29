var cyberCookies;
var cookiesPerSecondValue;

var buyMode;
var buying;

var rebirths;
var rebirthRate;
var canRebirth;
var rebirthGoal;

var amountOfContractsAcceptable;
var CONTRACTAMOUNT;
var contractHolderFinal; 
var contractType;
var contractsAllowed;

var upgradeHolderFinal;
var UPGRADEAMOUNT;

var TICKRATE; 
var RUNNING;

var contractsCompleted;
var howManyContractsAccepted;

var currentMobilePage;

function initialize() 
{
	buying = false;

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
			upgradeHolderFinal = upgradeHolderFinal.map(obj => new upgrade(obj.id, obj.cost, obj.owned, obj.addAmount, obj.costMultiplier, obj.addMultiplier, obj.baseCost, obj.baseAddAmount));
		}
	}
	else
	{
		createUpgrades();
	}

	tick = 0;
	TICKRATE = 1000;
	RUNNING = true;
	Running();
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
	var clickedOnce;

	if(canRebirth == true)
	{
		document.getElementById("rebirtbutton").innerHTML = "Are you sure?";
	}

	document.getElementById("rebirtbutton").addEventListener("click", () => 
	{
		if(canRebirth == true && clickedOnce == true)
		{
			rebirths += 1;
			amountOfContractsAcceptable += 1;
			document.getElementById("rebirtbutton").innerHTML = "Rebirth?";
			cyberCookies = 0;
			setRibirthRate();
			createUpgrades();
			cookiesPerSecond();
			initializeContracts(CONTRACTAMOUNT);
			rebirthGoal = rebirthGoal * 1.05;
			canRebirth = false;
			saveGame();
			updateScreen();
		}
	});

	clickedOnce = true;

	document.getElementById("rebirtbutton").addEventListener("mouseout", () => 
	{
		document.getElementById("rebirtbutton").innerHTML = "Rebirth?";
		clickedOnce = false;
		updateScreen();
	});
}

function saveGame()
{
	if(checkStorage() == true)
	{
		localStorage.setItem("savedBankTotal", cyberCookies); 
		localStorage.setItem("savedContractList", JSON.stringify(contractHolderFinal));
		localStorage.setItem("savedUpgradesList", JSON.stringify(upgradeHolderFinal));
		localStorage.setItem("savedRebirthCount", rebirths);
		localStorage.setItem("savedRebirthGoal", rebirthGoal);
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
		else if(upgradeHolderFinal[i - 1].getOwned() > 0){
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
	updateScreen();
}

function Running()
{
	if(RUNNING = true)
	{
		setInterval(ticking, TICKRATE);
		//console.log("Running");
	}
	else{
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
			var contractTimeHolder = Math.floor(Math.random() * (360 - 300 + 1) + 300);
			var contractAmountHolder = Math.floor(Math.random() * (80000 - 5000 + 1) + 5000);
			break;

		case "Race":
			var contractTimeHolder = Math.floor(Math.random() * (180 - 120 + 1) + 120);
			var contractAmountHolder = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
			break;

		case "Hack":
			var contractTimeHolder = Math.floor(Math.random() * (45 - 20 + 1) + 20);
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

function initializeContracts(amount){
	for (let i = 0; i < amount; i++){
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
		if((contractHolderFinal[i][3] == true) && (contractHolderFinal[i][1] > 0)) 
		{
			contractHolderFinal[i][1] = contractHolderFinal[i][1] - 1; 
		}
		else if ((contractHolderFinal[i][3] == true) && (contractHolderFinal[i][1] <= 0)) 
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
				upgradeHolderFinal[i] = new upgrade(i, 10, 0, (1 * (rebirthRate)), 1.1, (1 * (rebirthRate)), 10, (1 * (rebirthRate)));
				break;

			case 1:
				upgradeHolderFinal[i] = new upgrade(i, 100, 0, (10 * (rebirthRate)), 1.2, (10 * (rebirthRate)), 100, (10 * (rebirthRate)));
				break;

			case 2:
				upgradeHolderFinal[i] = new upgrade(i, 1000, 0, (100 * (rebirthRate)), 1.3, (100 * (rebirthRate)), 1000, (100 * (rebirthRate)));
				break;

			case 3:
				upgradeHolderFinal[i] = new upgrade(i, 10000, 0, (1000 * (rebirthRate)), 1.2, (1000 * (rebirthRate)), 10000, (1000 * (rebirthRate)));
				break;

			case 4:
				upgradeHolderFinal[i] = new upgrade(i, 100000, 0, (10000 * (rebirthRate)), 1.1, (10000 * (rebirthRate)), 100000, (10000 * (rebirthRate)));
				break;

			case 5:
				upgradeHolderFinal[i] = new upgrade(i, 1000000, 0, (100000 * (rebirthRate)), 1.2, (100000 * (rebirthRate)), 1000000, (100000 * (rebirthRate)));
				break;

			case 6:
				upgradeHolderFinal[i] = new upgrade(i, 10000000, 0, (1000000 * (rebirthRate)), 1.3, (1000000 * (rebirthRate)), 10000000, (1000000 * (rebirthRate)));
				break;

			case 7:
				upgradeHolderFinal[i] = new upgrade(i, 100000000, 0, (10000000 * (rebirthRate)), 1.4, (10000000 * (rebirthRate)), 100000000, (10000000 * (rebirthRate)));
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
		var selectedPrice;
		buying = true;

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
			 	console.log("Invalid page type");
			 	break;
		}

		buying = false;
		updateScreen();
	}
}

class upgrade
{
	constructor(ident, price, obtained, addition, priceMultiplier, additionMultiplier, floorCost, floorAddition)
	{
		this.id = ident;
		this.cost = price;
		this.owned = obtained;
		this.addAmount = addition;
		this.costMultiplier = priceMultiplier;
		this.addMultiplier = additionMultiplier;
		this.baseCost = floorCost;
		this.baseAddAmount = floorAddition;
	}

	getId()
	{
		return this.id;
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

	getBaseCost(){
		return this.baseCost;
	}

	getBaseAddAmount()
	{
		return this.baseAddAmount;
	}

	setId(ident)
	{
		this.id = ident;
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

	setBaseCost(floorCost){
		this.baseCost = floorCost;
	}

	setBaseAddAmount(floorAddition)
	{
		this.baseAddAmount = floorAddition;
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