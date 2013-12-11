function makeSavable(environemnt) {
	category = environemnt['__START__'].nextCategory;

	savable = {};
	savable['__START__'] = {}
	savable['__START__'] = $.extend({}, environment['__START__']);
	while (category != null) {
		savable[category] = $.extend({}, environment[category]);
		_(savable[category].places).each(function(place) {
			place.pathsFrom = []
			place.pathsTo = []
		}); 

		category = environemnt[category].nextCategory;
	}

	return savable;
}

function save_boar_sq(dataBag, currentName) {
	if (!currentName){
        currentName = new Date().getTime();
    }

	savableEnv = makeSavable(dataBag.env); 
	dataBag.env = savableEnv; 
	store.set(currentName, dataBag);
	console.log(currentName);
}

function load_boar_sq(currentName) {
	return store.get(currentName);
}

function getSavedDates(){

	return store.getAll();

}