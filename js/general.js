function createBooleanToggleCommand(name, value, funcs, localStorageName, booleanReference)
{
	return{
		name: name,
		display: true,
		argumentsNeeded: 0,
		function: () =>
		{
			booleanReference.value = value;

			if(funcs !== null)
			{
				funcs.forEach(func => 
	            {
	                if(typeof func === "function")
	                {
	                    func();
	                }
	            });
			}
           
			if(checkStorage() == true)
			{
				localStorage.setItem(localStorageName, booleanReference.value);
			}
		}
	};
}
