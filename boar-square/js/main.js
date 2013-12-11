var blankEnvironment = {                // used to deep-copy a blank environment
    "__START__": {nextCategory: null}
};

var environment = {                     // actual global variable to store our environment
    "__START__": {nextCategory: null}
};

// var clientId = 'CUZWQH2U4X1MDB2B4CL1PVANQG5K4DDLVWMVTV3OIARYVLT0';
// var secret = 'JVAYYMT2T1YAJHR43LMLKSHOP3PWI42SYQKH1XEPOWFCQMGV';

var clientId = 'ISKQFNT5EU3KSXC5GW5N1AJS5WGQOWH3B2DE3ZFSNN31S5N4';
var secret = 'KJE4NUK5W3K4E33JT1UV2CSC5UYQWQRJ1BRGT2WOC4LMY0E3';

var cats;
var categoryIds = {};

var placeID = "";   
var nearbyVenues = {};
var fileName = "";

var map;
var markersInMap = [];
var mapInitiated = false;
var resetMap = true;

var footerStateUp = false;
var searchVenuesCounter = 0;
var searchVenuesCounterLimit;
var mostRecentCategoryAdded = "__START__";
var timeForNextDate = 1;
var queryParams = {};
var currentlyQuerying = false;

var the_lat;
var the_lon;

var heartIcon = L.Icon.extend({
    options: {
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        labelAnchor: [14, -15],
        className: 'heart-marker'
    }
});
var bigHeartIcon = L.Icon.extend({
    options: {
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50],
        labelAnchor: [14, -15],
        className: 'big-heart-marker'
    }
});

var selectedPathOptions = {
    dashArray: null,
    weight: 5,
    opacity: 1.0,
    color: "#2a6496"
};

var possiblePathOptions = {
    dashArray: '5, 10',
    weight: 3,
    opacity: 0.5,
    color: "#00CED1"
};

var iToColor = [
        "#0099FF",   // blue
        "#00CC99",   // green
        "#FFFF00",   // yellow
        "#CC33FF",   // purple
        "#FF0066",   // pink
        "#FF9933"    // orange
];

// sections to feed for foursquare explore call
var foursquareSections = ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending'];
var foursquareSectionToCat = {          // what we call the foursquare sections
    'food': 'Food',
    'drinks': 'Nightlife',
    'coffee': 'Coffee',
    'shops': 'Shopping',
    'arts': 'Arts',
    'outdoors': 'Outdoors',
    'sights': 'Sights',
    'trending': 'Hot spots',
    'custom': 'Your custom location'
};
var dayDates = [                        // our templates for perfect daytime dates
    ['coffee', 'outdoors', 'food'],
    ['shops', 'food', 'outdoors'],
    ['food', 'sights', 'coffee'],
    ['outdoors', 'coffee', 'arts'],
    ['coffee', 'arts', 'shops'],
    ['coffee', 'arts', 'food'],
    ['arts','coffee','outdoors'],
    ['food','shops','trending'],
    ['food','sights','trending'],
    ['shops','food','sights']
    ['shops','food','trending'],
    ['food','trending','outdoors'],
    ['arts','food','trending']
];
var eveningDates = [                    // our templates for perfect evening dates
    ['food', 'arts', 'drinks'],
    ['coffee','food','trending'],
    ['drinks', 'coffee', 'outdoors'],
    ['shops', 'sights', 'drinks'],
    ['sights', 'food', 'outdoors'],
    ['food', 'arts', 'drinks'],
    ['trending','arts','drinks'],
    ['outdoors','food','drinks'],
    ['arts','outdoors','drinks'],
    ['outdoors','food','arts'],
    ['food','drinks','outdoors'],
    ['sights','food','drinks'],
    ['trending','arts','food'],
    ['arts','trending','drinks']
];
var dateStyleStartTimes = {
    "Day": [11, 12, 1, 2],
    "Evening": [6, 7, 8, 9]
};
var categoryColors = {
    Coffee: {color: 'rgba(184, 138, 31, 0.8)', 'class': 'coffee-color', 'iconUrl': 'img/markers/coffee-heart-marker.png'},
    'Arts': {color: 'rgba(0, 225, 75, 0.8)', 'class': 'park-color', 'iconUrl': 'img/markers/park-heart-marker.png'}, 
    Food: {color: 'rgba(225, 0, 25, 0.8)', 'class': 'restaurant-color', 'iconUrl': 'img/markers/restaurant-heart-marker.png'},
    Nightlife: {color: 'rgba(222, 0, 214, 0.8)', 'class': 'bar-color', 'iconUrl': 'img/markers/bar-heart-marker.png'},
    Shopping: {color: 'rgba(255, 106, 0, 0.8)', 'class': 'shopping-color', 'iconUrl': 'img/markers/shopping-heart-marker.png'},
    Outdoors: {color: 'rgba(102, 153, 0, 0.8)', 'class': 'outdoors-color', 'iconUrl': 'img/markers/outdoors-heart-marker.png'},
    Sights: {color: 'rgba(25, 25, 200, 0.8)', 'class': 'sights-color', 'iconUrl': 'img/markers/sights-heart-marker.png'},
    'Hot spots': {color: 'rgba(255, 31, 188, 0.8)', 'class': 'hotspots-color', 'iconUrl': 'img/markers/hotspots-heart-marker.png'}
};
var ourCategoryToFoursquareCat = {
    'Food': 'Food',
    'Arts': 'Arts & Entertainment',
    'Nightlife': 'Nightlife Spot',
    'Coffee': 'Coffee Shop',
    'Shopping': 'Shop & Service',
    'Outdoors': 'Outdoors & Recreation',
    'Sights': null,
    'Hot spots': null,
};
var sectionToIcon = {
    'food': 'img/icons/food.jpg',
    'drinks': 'img/icons/nightlife.jpg',
    'coffee': 'img/icons/coffee.jpg',
    'shops': 'img/icons/shopping.jpg',
    'arts': 'img/icons/arts.jpg',
    'outdoors': 'img/icons/outdoors.jpg',
    'sights': 'img/icons/sights.jpg',
    'trending': 'img/icons/trending.jpg'
};
var nextToSuggest = {};

function addToEnvironment(category, placeObject, new_selected, suggested) {
    if (!environment[category]){
        console.error("Category: " + category + " doesn't exist! Can't add: " + placeObject.name + "!");
        return;
    }

    var newPlace = jQuery.extend(true, {
        selected: new_selected,
        suggested: suggested,
        pathsTo: [],
        pathsFrom: []
    }, placeObject); // deep copy

    environment[category].places.push( newPlace ); 

    return newPlace;
}

function addNewCategory(name, previous, color, date_time) {
    if (environment[name]) {
        console.error("Category: " + name + " already exists!");
    }
    
    var nextCat = environment[previous].nextCategory;
    environment[name] = {
        previousCategory: previous,
        nextCategory: nextCat, 
        categoryColorClass: color, 
        categoryDateTime: date_time, 
        places: []
    }

    environment[previous].nextCategory = name;
    if (nextCat != null) {
        environment[nextCat].previousCategory = name;
    }
}

 // converts list of api raw venues to a nice list of our JSON
function toNearbyVenues(venues, section){ 
    var tmp = [venues.length];
    
    for(var i = 0; i<venues.length; i++) {
        var ven = rawVenueToOurVenue(venues[i].venue, venues[i].tips, section);
        tmp[i]= ven;
    }
     
    return tmp;
}

function rawVenueToOurVenue(venue, tips, section) {
    if (!venue.hours)
        venue.hours = "open"
    var ven = {
        name: venue.name,
        id: venue.id,
        point: [venue.location.lat, venue.location.lng],
        rating: venue.rating,
        price: venue.price,
        url: venue.url,               //the business' website
        checkInsCount: venue.stats.checkinsCount,
        point: [venue.location.lat, venue.location.lng],                    
        address: venue.location.address + ", " + venue.location.city
         + ", " + venue.location.state + ", " + venue.location.postalCode
    };

    if (venue.categories.length >= 1) {
        ven.specificCategory = venue.categories[0].name;
    }
    else {
        ven.specificCategory = 'No category';
    }

    if('price' in venue)          //some places don't list prices which throws an error
        ven.price = Array(venue.price.tier+1).join('$');
    else
        ven.price = "not listed";

    if (tips && tips.length >= 1) {
        ven.tip = tips[0].text;
    }
    else {
        ven.tip = '';
    }

    var photogroups = venue.photos.groups;
    if (photogroups.length > 0) {
        var photoZone = photogroups[photogroups.length - 1].items[0];
        ven.photo = photoZone.prefix + 'original' + photoZone.suffix;
    }
    else {
        ven.photo = sectionToIcon[section];
    }

    return ven;
}

function setCategoryRef(apiCategories){
    cats = apiCategories;
    for(var i = 0;i<cats.response.categories.length;i++) {
        var cat = cats.response.categories[i];
        categoryIds[cat.name] = cat.id;
        for (var j=0; j<cat.categories.length; j++) {
            var subcat = cat.categories[j];
            categoryIds[subcat.name] = subcat.id;
        }
    } 
}

function initMap(lat,lon) {
    the_lon = lon; 
    the_lat = lat;
    var options ={
        center: new L.LatLng(lat, lon),
        zoom: 12
    };
    map = new L.Map('map', options);

    var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        subDomains = ['1','2','3','4'],
        cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

    map.addLayer(cloudmade);
    mapInitiated = true;
    resizeStuff();
}

function findSelectedInCategory(category) {
    return _(environment[category].places).find(function(place) {
        return place.selected;
    })
}

function clearCols() {
    clearItenerary();
    var column_options = $('#option-div');
    column_options.empty();
}

function clearItenerary() {
    var column_itenerary = $('#itenerary-div');
    column_itenerary.empty(); 
}

function setIteneraryIcons() {
    var category = environment.__START__.nextCategory;
    var column = $('#itenerary-div');
    column.empty();
    
    idx = 1;
    while (category != null) {
        var selected = findSelectedInCategory(category);
        var itemId = '"itenerary_' + category + '"';
        var wellClass = "special-well " + categoryColors[category].class;
        column.append("<div id=" + itemId +" class='" + wellClass + "'style='text-align:center;'><div class='itenerary-item'> \
                          <div class='itenerary-item-text'>" + idx + ": " + selected.name + "</div>" +
                          selected.address +"</div>");
        column.append("</div></div>");
                       
        category = environment[category].nextCategory;
        if (category) {
            var nextSelected = findSelectedInCategory(category);
            var u = makeGoogleMapsUrl(selected.address, nextSelected.address);
            var a = '<a href="' + u + '" class="maps-arrow-link" target="_blank">';
            column.append("<div class='itenerary-arrow-transition'>" + a + 
                 "<i class='fa fa-arrow-down fa-3x'></i></a></div>");
        }
        idx += 1; 
    }
    column.append("<hr>")
}

function changeSelection(indexKey) {
    var pieces = indexKey.split('_');

    var category = pieces[0]; 
    var id = pieces[1]; 

    selectedCategory = environment[category]; 
    selectedPlace = _(selectedCategory.places).find(function(place){ 
        return place.marker._leaflet_id == indexKey;
    });

    currentlySelectedPlace = _(selectedCategory.places).find(function(place){
        return place.selected
    });

    setMarkerSelected(currentlySelectedPlace, category, false); 
    setMarkerSelected(selectedPlace, category,  true); 

    setIteneraryIcons();
    doIteneraryAnimation(category);
    
    selectedPlace.thumb.addClass('thumb_selected');
    currentlySelectedPlace.thumb.removeClass('thumb_selected');
}

function doIteneraryAnimation(category) {
    var itenerary_piece = $('#itenerary_' + category);
    itenerary_piece.css('color', '#eee');
    itenerary_piece.css('font-weight', '700');
    setTimeout(function() {
        itenerary_piece.css('color', '#000');
        itenerary_piece.css('font-weight', '400');
    }, 500);
}

function setMarkerSelected(place, category, isSelected) {
    place.selected = isSelected; 
    
    previousCategory = environment[category].previousCategory; 
    nextCategory = environment[category].nextCategory; 

    previousSelected = null; 
    nextSelected = null; 

    if (previousCategory) {
        previousSelected = _(environment[previousCategory].places).find(function(place) {
            return place.selected; 
        });
        
        var prevPath = _(place.pathsTo).find(function (path) {
            return path.adj.marker._leaflet_id == previousSelected.marker._leaflet_id;
        });
    }
    
    if (nextCategory) {
        nextSelected = _(environment[nextCategory].places).find(function(place) {
            return place.selected; 
        });  

        var nextPath = _(place.pathsFrom).find(function (path) {
            return path.adj.marker._leaflet_id == nextSelected.marker._leaflet_id;
        });
    }

    if (isSelected) {
        newOpacity = 0.85;
        newOptions = selectedPathOptions;
        place.marker.bindLabel(place.name, {
            noHide: true,
            className: 'marker-label ' + environment[category].categoryColorClass,
        }).showLabel();
    } else {
        newOpacity = 0.5; 
        newOptions = possiblePathOptions;
        map.removeLayer(place.marker.label);
        place.marker.label === undefined;
    }

    place.marker.setOpacity(newOpacity);
    if(nextPath)
        nextPath.edge.setStyle(newOptions);
    if(prevPath)
        prevPath.edge.setStyle(newOptions); 
}

function createPaths(startLoc, destinations, lineColor) {
    for (var i=0; i<destinations.length; i++) {
        var selectedLine = L.polyline([startLoc.point, destinations[i].point]).addTo(map);
        
        if (startLoc.selected && destinations[i].selected) {
            selectedLine.setStyle(selectedPathOptions);
            // drawArrows(selectedLine, lineColor, 0.8, 75);
        }
        else {
            selectedLine.setStyle(possiblePathOptions);
            // drawArrows(selectedLine, lineColor, 0.8, 120);
        }
        // selectedLine.setStyle({color: lineColor});
        startLoc.pathsFrom.push({edge: selectedLine, adj: destinations[i]});
        destinations[i].pathsTo.push({edge: selectedLine, adj: startLoc});
    }
}

/* 
takes an array of arrays of points, where each sub-array contains the options for location
number one in date.
*/
function initLocations(locations) {
    var idx = 0;
    var category = environment["__START__"].nextCategory;
    var option_div = $('#option-div');
    $('#category-selection').empty();


    /* clear old paths */
    while (category != null) {
        _.each(environment[category].places, function(place) {
            place.pathsTo = [];
            place.pathsFrom = [];
        });
        category = environment[category].nextCategory;
    }

    category = environment["__START__"].nextCategory;
    
    while(category != null ) { 
        var typeOfPlace = environment[category];
        var locOptions = typeOfPlace.places
        typeOfPlace.color = iToColor[idx];

        addMenuCategory(category);

        var cat_header = $("<div/>", {
            "id": "category_header_" + category,
            "class": "category-header"
        }).appendTo(option_div);

        var iconClass = '"itenerary-option-icon ' + typeOfPlace.categoryColorClass + '"';
        cat_header.append("<span class=" + iconClass + ">" + (idx+1) + "</span> " + category);
        var refresher = $("<a/>", {
            "class": 'refresh-icon',
            "id": "category_refresh_" + category,
            "click": refreshCategorySuggestions
        }).appendTo(cat_header);

        var spinner = $("<img/>", {
            "class": 'done_loading refresh-spinner',
            "id": "category_spinner_" + category,
            "src": "img/ajax-loader2.gif"
        }).appendTo(cat_header);


        refresher.append("<i class='fa fa-refresh'></i>");
        //cat_header.append("<a class='refresh-icon'><i class='fa fa-refresh'></i></a>");
        
        var container_div = $("<div/>", {
            "class": "category-div-wrapper"
        }).appendTo(option_div);

        var category_div = $("<div/>", {
            "id": "category_div_" + category,
            "class": "option-row scrolls",
        }).appendTo(container_div)

        var venue_info_div_id = "info_" + category;

        var venue_info_div = $("<div/>", {
            "id": venue_info_div_id,
            "class": "special-well-info"
        });

        
        for (var j=0; j<locOptions.length; j++) {
            var loc = locOptions[j];
            
            var marker = L.marker(loc.point, {
                icon: new heartIcon({iconUrl: categoryColors[category].iconUrl})
            });
            loc.marker = marker;
            
            if (typeOfPlace.nextCategory) {
                var nextTypeOfPlace = environment[typeOfPlace.nextCategory];
                createPaths(loc, nextTypeOfPlace.places, typeOfPlace.color); 
            }

            marker.on('click', markerClicked);
            marker.on('mouseover', markerMouseOver);
            marker.on('mouseout', markerMouseLeft);

            if (loc.selected) {
                marker.bindLabel(loc.name, {
                    noHide: true,
                    className: 'marker-label ' + typeOfPlace.categoryColorClass,
                }).showLabel();
                marker.setOpacity(0.85);
            }
            else {
                marker.setOpacity(0.5, false);
            }
           
            marker.bindPopup(loc.name + ' - ' + loc.specificCategory + ' - ' + loc.address, {
                closeButton: false
                //className: 'popup-' + 'coffee-color'
            });
            
            markersInMap.push(marker);
            marker._leaflet_id = category + "_" + marker._leaflet_id;
            marker.addTo(map);

            var thumbnailDiv = $("<div/>", {
                "class": "place_thumbnail",
            }).appendTo(category_div);

            loc.thumbnailDiv = thumbnailDiv; 
            addThumbnail(loc, venue_info_div, category, true);
        }
        venue_info_div.appendTo(option_div); 


        idx += 1; 
        // venue_info_div.appendTo(category_div);
      
        option_div.append("<hr class='clear_both'>");
        category = environment[category].nextCategory;
    }
    setAllCategoryWidths();
}

function refreshCategorySuggestions(ev) {
    var target_id = ev.currentTarget.id;
    var sections = target_id.split('_');
    var category = sections[sections.length-1];

    clearMap();
    addSuggestions(category, nextToSuggest[category]);
    initLocations(environment);
    setIteneraryIcons();
    setAllCategoryWidths();

    return false;
}

function addThumbnail(loc, venue_info_div, category, suggested) {
    if (suggested)
        var thumbnailClass = "thumb_suggested";
    else
        var thumbnailClass = "thumb_personal";

    if (loc.selected) {
        thumbnailClass += " thumb_selected";
        setInfoDiv(venue_info_div, loc);
    }
    var thumb = $( "<img/>", {
      "src": loc.photo,
      "alt": "",
      "width": "100",
      "height": "100",
      "id": "t-"+ loc.marker._leaflet_id,
      "class": thumbnailClass,
      click: function(e) {
        marker_id = this.id.split('-')[1];
        thumbnailClicked(marker_id);
      }
    }).appendTo(loc.thumbnailDiv);

    thumb.hover(
        function() {
            setInfoDiv(venue_info_div, loc);
            loc.marker.setIcon(new bigHeartIcon({iconUrl: categoryColors[category].iconUrl}));
        }, 
        function() {
            loc.marker.setIcon(new heartIcon({iconUrl: categoryColors[category].iconUrl}));
            //var selectedLoc = findSelectedInCategory(category);
            //setInfoDiv(venue_info_div, selectedLoc);
        }
    )
    loc.thumbnailDiv.append(loc.name);
    loc.thumb = thumb;
}

function makeGoogleMapsUrl(addr1, addr2) {
    var u = 'https://maps.google.com/maps?' +
        'saddr=' + escape(addr1) + 
        '&daddr=' + escape(addr2);
    return u;
}

function addMenuCategory(category) {
    var menu = $('#category-selection');
    menu.append('<option>' + category + '</option>');
}

function setInfoDiv(venue_info_div, loc) {
    var link = loc.name; 
    if (loc.url)
        link = "<a target='_blank' href='" + loc.url + "'>" + loc.name + "</a>"
    var rating = "";
    if (loc.rating)
        rating = "(" + loc.rating + "/10)";

    venue_info_div.html("<div>" + link + " " + rating + " - Cost: " + loc.price + "</div>");
}

function addNewLocation(category, location, personal) {
    clearItenerary();
    var category_div = $("#category_div_" + category);
    var loc = location;

    if (loc.selected) {
       var currentlySelectedPlace = _(environment[category].places).find(function(place){
        return place.selected
       });

       setMarkerSelected(currentlySelectedPlace, category, false); 
       setIteneraryIcons();
       doIteneraryAnimation(category);
       currentlySelectedPlace.thumb.removeClass('thumb_selected');
    }

    var marker = L.marker(loc.point, {
        icon: new heartIcon({iconUrl: categoryColors[category].iconUrl})
    });
    loc.marker = marker;
    if (!loc.selected)  
        marker.setOpacity(0.5);
    markersInMap.push(marker);                

    typeOfPlace = environment[category];
    if (typeOfPlace.nextCategory) {
        nextTypeOfPlace = typeOfPlace.nextCategory;
        createPaths(loc, environment[nextTypeOfPlace].places, typeOfPlace.color); 
    }

    if(typeOfPlace.previousCategory) {
        prevTypeOfPlace = typeOfPlace.previousCategory;
        _(environment[prevTypeOfPlace].places).each(function(place){ 
            createPaths(place, [loc], null);
        });
    }

    marker.on('click', markerClicked);
    marker.on('mouseover', markerMouseOver);
    marker.on('mouseout', markerMouseLeft);
   
    marker.bindLabel(loc.name, {
        noHide: true,
        className: 'marker-label ' + typeOfPlace.categoryColorClass,
    }).showLabel();
   
    marker.bindPopup(loc.specificCategory + ' - ' + loc.address, {
        closeButton: false,
    });
    
    marker._leaflet_id = category + "_" + marker._leaflet_id;
    marker.addTo(map);

    var venue_info_div_id = "#info_" + category;
    var venue_info_div = $(venue_info_div_id);
    var thumbnailDiv = $("<div/>", {
        "class": "place_thumbnail"
        
    }).prependTo(category_div); 
    loc.thumbnailDiv = thumbnailDiv;
    addThumbnail(loc, venue_info_div, category, !personal);

    setCategoryDivWidth(category);
}

function setAllCategoryWidths() {
    var category = environment["__START__"].nextCategory;
    while (category !== null && category !== undefined) {
        setCategoryDivWidth(category);
        category = category.nextCategory;
    }
}

function setCategoryDivWidth(category) {
    var category_div = $("#category_div_" + category);
    var numIcons = environment[category].places.length;
    category_div.width(numIcons * 110);
}

function drawArrows(line, arrowColor, arrowOpacity, repeatVal) {
    var arrow = L.polylineDecorator(line, {
        patterns: [
            {
                offset: '20%', repeat: repeatVal, 
                symbol: L.Symbol.arrowHead({pixelSize: 20, 
                    pathOptions: {
                        color: arrowColor, 
                        weight: 3, 
                        stroke: true, 
                        opacity: arrowOpacity,
                        fillOpacity: 0.6
                    }
                })
            }
        ]
    }).addTo(map);
    markersInMap.push(arrow);
}

function clearMap() {
    clearCols();

    if (!map)
        return;

    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            map.removeLayer(map._layers[i]);
        }
    }
    for (var i = 0; i < markersInMap.length; i++)
        map.removeLayer(markersInMap[i]);
    markersInMap = [];
}

function thumbnailClicked(leaflet_id){
    changeSelection(leaflet_id);
}

function markerClicked(ev) {
    tag = ev.target; 
    changeSelection(tag._leaflet_id)
}

function markerMouseOver(ev) {
    tag = ev.target;   
    ev.target.openPopup();
}

function markerMouseLeft(ev) {
    ev.target.closePopup();
}

function queryFoursquare(queryString, sectionName) {
    $('#notFound').hide();

    var lat,lon;
    var search = $.getJSON(queryString, function( data ) {
        var thisCategory = foursquareSectionToCat[sectionName];
        nearbyVenues[thisCategory] = toNearbyVenues(data.response.groups[0].items, sectionName); //all the nearby places
        var theseVenues = nearbyVenues[thisCategory];

        var totalLatitudes=0, totalLongitudes=0, avLat=0,avLong=0;

        for(var i = 0;i<theseVenues.length;i++)
        {
            totalLatitudes += theseVenues[i].point[0];
            totalLongitudes += theseVenues[i].point[1];
        }
        avLat = totalLatitudes / theseVenues.length;
        avLon = totalLongitudes / theseVenues.length;

        if(resetMap)
        {   
            if (!mapInitiated) {
                initMap(avLat, avLon);
            }
            else {
                var center = new L.LatLng(avLat, avLon);
                map.panTo(center);
            }
            resetMap = false;
            resizeStuff();
        }
        function actuallyAddVenues() {
            nearbyVenues[thisCategory].sort(function() { return 0.5 - Math.random() });
            addSuggestions(thisCategory, 0); // add the first 3 !
            searchVenuesCounter++;
        }
        actuallyAddVenues();
    }).fail(function(){
        $('#notFound').show();
        currentlyQuerying = false;
        setTimeout(function() {
            $('#notFound').fadeOut();
        }, 5000);
    });
}

function addSuggestions(category, lastIndex) {
    var endIndex = lastIndex + 3;
    var venues = nearbyVenues[category];
    environment[category].places = environment[category].places.filter(function(el) {
        return !el.suggested;
    });

    for (var i=lastIndex; i<endIndex && i<venues.length; i++) {   
        var v = venues[i];
        var selected = false;
        if (i == lastIndex && environment[category].places.length == 0) // nothing else in there
            selected = true;

        addToEnvironment(category, v, selected, true);
    }
    nextToSuggest[category] = endIndex;
    if (endIndex >= venues.length) {
        nextToSuggest[category] = 0;
        environment[category].places.sort(function() { return 0.5 - Math.random() }); // shuffle for less obvious repetition
    }
}

function querySpecificVenueFoursquare(venueTerms, location, categoryName, incrementVenuesCounter) {
    $('#notFound').hide();  //remove error message
    var queryString = 'https://api.foursquare.com/v2/venues/search?' +
        'query=' + venueTerms + 
        '&near=' + location + 
        '&intent=browse' + 
        '&limit=5' +
        '&venuePhotos=1' +
        '&client_id=' + clientId + 
        '&client_secret=' + secret + 
        '&v=20120625';
    if (categoryName !== null) {
        var foursquareCat = ourCategoryToFoursquareCat[categoryName];
        if (foursquareCat !== null) {
            var categoryId = categoryIds[foursquareCat];
            if (categoryId !== undefined)
                queryString += '&categoryId=' + categoryId;
        }
    }
    var search = $.getJSON(queryString, function(data) {
        var bestMatch = data.response.venues[0];
        if(bestMatch === null || bestMatch === undefined) {
            $('#notFound').show();
            setTimeout(function() {
                $('#notFound').fadeOut();
            }, 5000);
            if (incrementVenuesCounter)
                searchVenuesCounter++;
            return false;
        }
        var photoQuery = 'https://api.foursquare.com/v2/venues/' + bestMatch.id + '/photos?' +
            'limit=1' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        $.getJSON(photoQuery, function(photoData) {
            var photos = photoData.response.photos;
            bestMatch.photos = photos;
            var niceMatch = rawVenueToOurVenue(bestMatch, 'food');
            addedPlace = addToEnvironment(categoryName, niceMatch, true, false);
            if (! incrementVenuesCounter) {
                addNewLocation(categoryName, addedPlace, true);
            }
            else {
                searchVenuesCounter++;
            }
        })        
    }).fail(function(){
        $('#notFound').show();
        setTimeout(function() {
            $('#notFound').fadeOut();
        }, 5000);
    });
}

// get the parameters in our url. Sourced from stackoverflow (sort of).
function getUrlParams() {
    var vars = {};
    var terms = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < terms.length; i++) {
        var termSplit = terms[i].split('=');
        vars[termSplit[0]] = unescape(termSplit[1]);
    }
    return vars;
}

function doFoursquareSectionsSearch(params) {
    var locationName = params.location;

    var dateInfo = makeTheDate(params);

    searchVenuesCounterLimit = dateInfo.length;
    
    for (var i=0; i<dateInfo.length; i++) {

        /* add the new category */
        var cat = foursquareSectionToCat[dateInfo[i].section];
        addNewCategory(cat, mostRecentCategoryAdded, categoryColors[cat].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = cat;
        timeForNextDate += 1; // 1 hour change

        var queryString = 'https://api.foursquare.com/v2/venues/explore?near=' + locationName + 
            '&section=' + dateInfo[i].section +
            '&limit=45' + 
            '&venuePhotos=1' + 
            '&time=any' +
            '&day=any' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        queryFoursquare(queryString, dateInfo[i].section);
        if (dateInfo[i].name) {
            searchVenuesCounterLimit++;
            var vName = dateInfo[i].name;
            var loc = params.location;
            var cat = foursquareSectionToCat[dateInfo[i].section];
            querySpecificVenueFoursquare(vName, loc, cat, true);
        }
    }
}

function makeTheDate(params) {
    var dateOptions;
    if (params.dateStyle == "Day")
        dateOptions = dayDates;
    else
        dateOptions = eveningDates;

    dateOptions.sort(function() { return 0.5 - Math.random() }); // shuffle our date options;

    var date = [
        {section: dateOptions[0][0]},
        {section: dateOptions[0][1]},
        {section: dateOptions[0][2]}
    ];

    if (params.venue1Info) {
        var oldOption = date[0];
        date[0] = params.venue1Info;
        if (date[1].section == date[0].section)       // handle multiple categories
            date[1].section = oldOption.section;
        else if (date[2].section == date[0].section)
            date[2].section = oldOption.section;
    }   

    if (params.venue2Info) {
        var oldOption = date[1];
        date[1] = params.venue2Info;
        if (date[0].section == date[1].section)       // handle multiple categories
            date[0].section = oldOption.section;
        else if (date[2].section == date[1].section)
            date[2].section = oldOption.section;
    }

    if (params.venue3Info) {
        var oldOption = date[2];
        date[2] = params.venue3Info;
        if (date[0].section == date[2].section)       // handle multiple categories
            date[0].section = oldOption.section;
        else if (date[1].section == date[2].section)
            date[1].section = oldOption.section;
    }

    return date;
}

function resetMapKeepingVariables() {
    searchVenuesCounter = 0;
    mostRecentCategoryAdded = "__START__";
    timeForNextDate = getRandomStartTime(queryParams);
    environment = jQuery.extend(true, {}, blankEnvironment); // deep copy
}

function getRandomStartTime(params) {
    if (params.dateStyle === undefined)
        params.dateStyle = "Day";

    var possibleStartTimes = dateStyleStartTimes[params.dateStyle];
    if (! possibleStartTimes)
        return 1;
    
    t = possibleStartTimes[Math.floor(Math.random()*possibleStartTimes.length)]; // grab random possible start time
    return t;
}

function loadFromStore(saveName) {
    hideWelcome();
    data = load_boar_sq(saveName);
    savedEnv = data.env;
    queryParams = data.q;
    nearbyVenues = data.nearbyVenues;
    nextToSuggest = data.nextSuggest;
    $("#place").val(queryParams.location);
    if (! queryParams.dateType)
        queryParams.dateType = "Day";
    $("#date-type-picker").val(queryParams.dateType);

    thisCategory = savedEnv['__START__'].nextCategory;
    var totalLatitudes = 0; 
    var totalLongitudes = 0; 
    var totalVenues = 0; 
    while (thisCategory != null) {
        addNewCategory(thisCategory, mostRecentCategoryAdded, categoryColors[thisCategory].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = thisCategory;
        timeForNextDate += 1; // 1 hour change

        _(savedEnv[thisCategory].places).each(function(savedPlace){
            addToEnvironment(thisCategory, savedPlace, savedPlace.selected, true); 
            totalLatitudes += savedPlace.point[0];
            totalLongitudes += savedPlace.point[1];
            totalVenues += 1; 
         }); 

        thisCategory = savedEnv[thisCategory].nextCategory;
    }

    var avLat = totalLatitudes / totalVenues;
    var avLon = totalLongitudes / totalVenues;
   
    if (!map) {
        initMap(avLat, avLon);
    }
    else {
        var center = new L.LatLng(avLat, avLon);
        map.panTo(center);
    }

    setOptionColumnHeader(queryParams.location);
    $('#place').val(queryParams.location);
    initLocations(environment);

    $('.loading').addClass('done_loading');
    resizeStuff();
}

function animate_elem_to(element_id, diff, callback){ 
    var element = $("#"+ element_id);
    var element_height = element.height(); 
    var newHeight = element_height + diff; 
    element.animate({'height': newHeight}, function() {
        if (callback)
            callback();
    });
}

function showFooter() {
    if(footerStateUp)
        return; 
    var f = $('footer');
    f.animate({'height': 60});

    animate_elem_to('map-column', -50);
    animate_elem_to('option-column', -50);
    animate_elem_to('itenerary-column', -50);
    animate_elem_to('map', -50, resizeStuff);
    
    footerStateUp = true;
}

function hideFooter() {
    if(!footerStateUp)
        return;
    var f = $('footer');
    f.animate({'height': 10});
    animate_elem_to('map-column', 50);
    animate_elem_to('option-column', 50);
    animate_elem_to('itenerary-column', 50);
    animate_elem_to('map', 50, resizeStuff);

    footerStateUp = false; 
}

function toggleFooter() {
    if (footerStateUp)
        hideFooter();
    else 
        showFooter();
}

function init_saved_files() {
    var load_menu = $("#load-menu");
    var confirm_group = $('#confirm_group');
    load_menu.empty();

    $('#delete_confirm').click(function(e){
        store.clear(); 
        load_menu.empty();
        init_saved_files();    
        confirm_group.fadeOut(500);
    }); 

    $('#delete_decline').click(function(e){
        confirm_group.fadeOut(500);
    }); 

    var list_item = $("<li/>");
    var clear_link = $("<a/>", {
        "href": "#", 
        html: "CLEAR ALL",
        click: function(e) {
            $('#confirm_group').fadeIn(500);    
        },
        "style": "background-color:red" 
    }).appendTo(list_item);
    load_menu.append(list_item);

    store.forEach(function(key, value) {
        var list_item = $("<li/>");
        var link = $("<a/>", {
            "href": "#", 
            html: key,
            click: function(e) {
                resetMapKeepingVariables();
                clearMap();
                toggleFooter();
                loadFromStore(key);
                setIteneraryIcons();
            }
        }).appendTo(list_item);
        load_menu.append(list_item);
    });
}

function setBottomToPixel(element, dest) {
    var topOfElement = element.offset().top; 
    element.height(dest-topOfElement);
}

function resizeStuff() {
    var topOfFooter = $('footer').offset().top; 
    setBottomToPixel($("#map-column"), topOfFooter);
    setBottomToPixel($("#option-column"), topOfFooter);
    setBottomToPixel($("#itenerary-column"), topOfFooter);
    setBottomToPixel($("#map"), topOfFooter);
}

function setOptionColumnHeader(locName) {
    $('#option-column-header').html("A date in " + locName + ":");
}

function doWelcomeAnimation() {
    $("#specific-venue-query").attr("disabled", true);
    $("#category-selection").attr("disabled", true);
    $("#submit-specific-venue").attr("disabled", true);

    $('#welcome-banner').fadeIn(1200, function() {
        $("#welcome-text").fadeIn(600, function() {
            setTimeout(function() {
                $("#power-user-text").fadeIn(1000, function() {
                    $("#save-load-text").fadeIn(1000, function() {
                        $("#more-help-text").fadeIn(1000);
                    });
                });
            }, 500);
        });
    });
}

function hideWelcome() {
    $('#main-search-button').attr("disabled", false);
    $('#main-search-button').html('Try something different!');
    $("#welcome-screen").fadeOut(400, function() {
        $("#column-container").fadeIn(1000);
    });
    $("#specific-venue-query").attr("disabled", false);
    $("#category-selection").attr("disabled", false);
    $("#submit-specific-venue").attr("disabled", false);
}

$(document).ready(function (){

    resizeStuff();
    $(window).resize(resizeStuff);
   
    if (!store.enabled) {
        console.error('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
    }

    $.getJSON('https://api.foursquare.com/v2/venues/categories?client_id='
        +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {
            setCategoryRef(data);
    });

    $('#footer-loc').mouseenter(showFooter);
    $('#column-container').click(hideFooter);
    $("#welcome-screen").click(hideFooter);
 
    var $area = $('#place')[0];        //jquery objects for each input field
    var $save = $('#save')[0];
    var $saveText = $('#saveText')[0];

    $('#main-search-button').attr("disabled", true);
    function checkSearchEnabled() {
        if ($($area).val())
            $('#main-search-button').attr("disabled", false);
        else
            $('#main-search-button').attr("disabled", true);
    }
    $($area).keyup(checkSearchEnabled);

    $($save).click(function(){
        $("#date-saved-label").hide();

        fileName = $saveText.value;
        if (!queryParams || !the_lat || nextToSuggest == {}) { // nothing loaded yet
            $("#date-saved-label").html("<label>Can't save nothing!</label>");
            $("#date-saved-label").fadeIn(400);
            setTimeout(function() {
                $("#date-saved-label").fadeOut(1000); 
            }, 2500);
            return false;
        }

        save_boar_sq({
          q: queryParams, 
          env: environment,
          loc: [the_lat, the_lon],
          nearbyVenues: nearbyVenues,
          nextSuggest: nextToSuggest
        }, fileName)
        
        $("#date-saved-label").html("<lable> Itenerary Saved: " + fileName + "</label>");
        $("#date-saved-label").fadeIn(1000);
        setTimeout(function() {
                $("#date-saved-label").fadeOut(1000); 
        }, 2500);
        init_saved_files();
    });

    $('#broad-date-search').submit(function(e){
        if (currentlyQuerying)
            return false;
        if ($('#main-search-button').attr("disabled") == false)
            return false;
        $('#category-selection, #specific-venue-query, .btn-success').removeAttr('disabled');

        var oldLoc = queryParams.location;
        var loc = $('#place').val();
        if (loc == "")
            loc = queryParams.location;
        queryParams = {
            location: loc,
            dateStyle: $('#date-type-picker').val()
        };
        if (!queryParams.location) {
            return false;
        }
        
        function changeLookAndQuery() {
            hideWelcome();
            currentlyQuerying = true;
            setOptionColumnHeader(queryParams.location);
            clearMap();
            resetMap = true;
            resetMapKeepingVariables();
            doFoursquareSectionsSearch(queryParams);
            $('.loading').removeClass('done_loading');
            addNewLocationsOnceDone();
        }
        var testQuery = 'https://api.foursquare.com/v2/venues/explore?near=' + queryParams.location + 
            '&limit=1' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        $.getJSON(testQuery, function(data) {
            changeLookAndQuery();
        }).fail(function() {
            queryParams.location = oldLoc;
            $('#notFound').show();
            currentlyQuerying = false;
            setTimeout(function() {
                $('#notFound').fadeOut();
            }, 5000);
        });

        return false;
    });

    $('#specific-venue').submit(function() {
        if (currentlyQuerying)
            return false;

        var venueTerms = $("#specific-venue-query").val();
        var cat = $('#category-selection').val();
        querySpecificVenueFoursquare(venueTerms, queryParams.location, cat, false);

        return false;
    });

    function addNewLocationsOnceDone() {
        if (searchVenuesCounter < searchVenuesCounterLimit) {
            setTimeout(addNewLocationsOnceDone, 100);
            return false;
        }
        $(".loading").addClass("done_loading")
        initLocations(environment);
        setIteneraryIcons();
        currentlyQuerying = false;

        resizeStuff();
    }

    doWelcomeAnimation();

    init_saved_files();
});