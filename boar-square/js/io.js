function makeSavable(environemnt) {
	category = environemnt['__START__'].nextCategory;

	savable = {};
	savable['__START__'] = {}
	savable['__START__'] = $.extend({}, environment['__START__']);
	while (category != null) {
		savable[category] = {}; 

		cat = savable[category];
        cat['nextCategory'] = environemnt[category].nextCategory;
        cat['prevCategory'] = environemnt[category].prevCategory;
        cat['categoryColorClass'] = environemnt[category].categoryColorClass;
        cat['categoryDateTime'] = environemnt[category].categoryDateTime;
        cat['places'] = []
 
     _(environemnt[category].places).each(function(place){
           place_copy = {}
	       place_copy['name'] = place.name; 
	       place_copy['address'] = place.address
	       place_copy['point'] = place.point
	       place_copy['selected'] = place.selected;
	       place_copy['address'] = place.address;
	       place_copy['id'] = place.id; 
	       place_copy['photo'] = place.photo;
	       place_copy['price'] = place.price;
	       place_copy['rating'] = place.rating;
	       place_copy['specificCategory'] = place.specificCategory;
	       place_copy['suggested'] = place.suggested; 
	       place_copy['tip'] = place.tip; 
	       place_copy['url'] = place.url; 

	       cat['places'].push(place_copy)
      }) 

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

