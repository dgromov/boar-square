 var blankEnvironment = {
    "__START__": {nextCategory: null}
 };

 var environment = {
    "__START__": {nextCategory: null}
    //"__START__": {nextCategory: "Coffee"}

    
    // "Coffee": {
    //     previousCategory: null, 
    //     nextCategory: "Museum",
    //     categoryColorClass: "coffee-color",
    //     categoryDateTime: "1 PM",
    //     places: [ 
    //         {name: "Stumptown", address: "123 town", point: [37.9, -122.2], selected: true, pathsTo: [], pathsFrom: []}
    //         // ,{name: "doodo", address: "123 town", point: [37.89, -122.25], selected: false, pathsTo: [], pathsFrom: []}
        
    //     ] 
    // },
    // "Museum": {
    //     previousCategory: "Coffee",
    //     nextCategory: "Restaurant",
    //     categoryColorClass: "park-color",
    //     categoryDateTime: "2 PM",
    //     places: [
    //         {name: "Met", address: "123 town", point: [37.7, -122.0], selected: true, pathsTo: [], pathsFrom: []},
    //         {name: "History Museum", address: "123 town", point: [37.85, -122.25], selected: false, pathsTo: [], pathsFrom: []},
    //         {name: "Guggenheim", address: "123 town", point: [37.9, -122.5], selected: false, pathsTo: [], pathsFrom: []}
    //     ]
    // },
    // "Restaurant": {
    //     previousCategory: "Museum",
    //     nextCategory: "Bar",
    //     categoryColorClass: "museum-color",
    //     categoryDateTime: "3 PM",
    //     places: [
    //         {name: "#1 Chinese Food", address: "123 town", point: [37.8, -122.4], selected: true, pathsTo: [], pathsFrom: []},
    //         {name: "Mels", address: "123 town", point: [37.7, -122.25], selected: false, pathsTo: [], pathsFrom: []},
    //         {name: "Thai Market", address: "123 town", point: [37.6, -122.1], selected: false, pathsTo: [], pathsFrom: []}
    //     ]
    // }
    // ,
    // "Bar": {
    //     previousCategory: "Restaurant",
    //     nextCategory: null,
    //     categoryColorClass: "bar-color",
    //     categoryDateTime: "4 PM",
    //     places: [
    //         {name: "1020", address: "123 town", point: [37.65, -122.3], selected: true , pathsTo: [], pathsFrom: []  }
    //     ] 
    // }
    
};

// var clientId = 'CUZWQH2U4X1MDB2B4CL1PVANQG5K4DDLVWMVTV3OIARYVLT0';
// var secret = 'JVAYYMT2T1YAJHR43LMLKSHOP3PWI42SYQKH1XEPOWFCQMGV';

var clientId = 'ISKQFNT5EU3KSXC5GW5N1AJS5WGQOWH3B2DE3ZFSNN31S5N4';
var secret = 'KJE4NUK5W3K4E33JT1UV2CSC5UYQWQRJ1BRGT2WOC4LMY0E3';

var cats;
var categoryIds = {};

var placeID = "";   
var nearbyVenues = {};

var map;
var markersInMap = [];
var mapInitiated = false;
var resetMap = true;

var searchVenuesCounter = 0;
var searchVenuesCounterLimit;
var mostRecentCategoryAdded = "__START__";
var timeForNextDate = 1;
var currentArea = null;
var currentStartTime = null;
var currentEndTime = null;
var currentDay = null;

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
        labelAnchor: [23, -25],
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

var foursquareSections = ['food', 'drinks', 'coffee', 'shops', 'arts', 'outdoors', 'sights', 'trending'];
var foursquareSectionToCat = {
    'food': 'Restaurant',
    'drinks': 'Bar',
    'coffee': 'Coffee',
    'shops': 'Shopping',
    'arts': 'Museum',
    'outdoors': 'Outdoors',
    'sights': 'Sights',
    'trending': 'Hot spots'
};
var categoryColors = {
    Coffee: {color: 'rgba(255, 215, 128, 0.8)', 'class': 'coffee-color', 'iconUrl': 'img/markers/coffee-heart-marker.png'},
    Museum: {color: 'rgba(0, 225, 75, 0.8)', 'class': 'park-color', 'iconUrl': 'img/markers/park-heart-marker.png'}, 
    Restaurant: {color: 'rgba(225, 0, 25, 0.8)', 'class': 'restaurant-color', 'iconUrl': 'img/markers/restaurant-heart-marker.png'},
    Bar: {color: 'rgba(200, 200, 200, 0.8)', 'class': 'bar-color', 'iconUrl': 'img/markers/bar-heart-marker.png'},
    Shopping: {color: 'rgba(155, 100, 200, 0.8)', 'class': 'shopping-color', 'iconUrl': 'img/markers/shopping-heart-marker.png'},
    Outdoors: {color: 'rgba(100, 150, 175, 0.8)', 'class': 'outdoors-color', 'iconUrl': 'img/markers/outdoors-heart-marker.png'},
    Sights: {color: 'rgba(50, 75, 100, 0.8)', 'class': 'sights-color', 'iconUrl': 'img/markers/sights-heart-marker.png'},
    'Hot spots': {color: 'rgba(25, 25, 200, 0.8)', 'class': 'hotspots-color', 'iconUrl': 'img/markers/hotspots-heart-marker.png'}
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

//function addToEnvironment(category, new_name, new_address, new_point, new_selected) {
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
    //console.log(environment[category]);

    return newPlace;
}

function addNewCategory(name, previous, color, date_time) {
    if (environment[name]) {
        console.error("Category: " + category + " already exists!");
    }
    
    //console.log(previous);
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

 // what the api takes as 'section' parameter
function toNearbyVenues(venues, section){ 
    //log("raw venue object from api:"); 
    //console.dir(venues);
    var tmp = [venues.length];
    
    for(var i = 0; i<venues.length; i++)
    {
        //console.log(venues[i].venue.name);
        var ven = rawVenueToOurVenue(venues[i].venue, venues[i].tips, section);

        //console.dir(ven);
        tmp[i]= ven;//push[ven];
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
        hours: venue.hours.status,
        url: venue.url,               //the business' website
        checkInsCount: venue.stats.checkinsCount,
        point: [venue.location.lat, venue.location.lng],                    
        address: venue.location.address + ", " + venue.location.postalCode
        //status: v.venue.hours.status    //number to  $$$ amount
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
    console.log("hi");
    for(var i = 0;i<cats.response.categories.length;i++) {
        var cat = cats.response.categories[i];
        categoryIds[cat.name] = cat.id;
        for (var j=0; j<cat.categories.length; j++) {
            var subcat = cat.categories[j];
            //categoryIds[subcat.name] = subcat.id;
        }
    } 
    //console.log(categoryIds);
}

function initMap(lat,lon) {
    the_lon = lon; 
    the_lat = lat; 
    var options ={
        center: new L.LatLng(lat, lon),
        //center: new L.LatLng(40.77, -73.94),
        zoom: 15
    };

    map = new L.Map('map', options);

    var cloudmadeUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        subDomains = ['1','2','3','4'],
        cloudmade = new L.TileLayer(cloudmadeUrl, {subdomains: subDomains, maxZoom: 18});

    map.addLayer(cloudmade);
    mapInitiated = true;
}

function findSelectedInCategory(category) {
    return _(environment[category].places).find(function(place) {
        return place.selected;
    })
}

function setIteneraryIcons() {
    var category = environment.__START__.nextCategory;
    column = $('#itenerary-div');
    column.empty(); 

    idx = 1; 
    while (category != null) {
        var selected = findSelectedInCategory(category);
        var itemId = '"itenerary_' + category + '"';
        column.append("<div id=" + itemId +" class='special-well'><div class='itenerary-item'> \
                          <div class='itenerary-item-text'>" + idx + ": " + selected.name + "</div>" +
                          "<div class='itenerary-item-details'>" + environment[category].categoryDateTime + "<br>" +
                          selected.address + "</div>" + 
                       "</div></div>");
        // $("#itenerary_" + category).offset({top: $("#category_div_" + category).offset().top}); 
        category = environment[category].nextCategory;
        if (category)
            column.append("<div class='itenerary-arrow-transition'><i class='fa fa-arrow-down fa-3x'></i></div>");
        idx += 1; 

      
    }


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
    itenerary_piece.css('color', categoryColors[category].color);
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
    var option_column = $('#option-column');
    var option_div = $("<div/>", {
        "class": "category-options"
    }).appendTo(option_column); 
   
    while(category != null ) { 
        var typeOfPlace = environment[category];
        var locOptions = typeOfPlace.places
        typeOfPlace.color = iToColor[idx]; 

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
        }).appendTo(container_div); 

        
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
            addThumbnail(loc, venue_info_div, true);
        }

        idx += 1; 
        // venue_info_div.appendTo(category_div);
      
        option_div.append("<hr class='clear_both'>");
        category = environment[category].nextCategory;
    }
}

    function refreshCategorySuggestions(ev) {
        var target_id = ev.currentTarget.id;
        var sections = target_id.split('_');
        var category = sections[sections.length-1];

        addSuggestions(category, nextToSuggest[category]);
        clearMap();
        initLocations(environment);
        setIteneraryIcons();
        setCategoryDivWidth(category);



        return false;
}

function addThumbnail(loc, venue_info_div, suggested) {
    if (suggested)
        var thumbnailClass = "thumb_suggested";
    else
        var thumbnailClass = "thumb_personal";

    if (loc.selected) {
        thumbnailClass += " thumb_selected";
        setInfoDiv(venue_info_div, loc);
    }
    //console.log(loc.photo);
    var thumb = $( "<img/>", {
      //"src": "img/placeholder.jpg",
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
            setInfoDiv(venue_info_div, loc)
        }, 
        function() {
        
        }
    )
    loc.thumbnailDiv.append(loc.name);
    loc.thumb = thumb;


}

function setInfoDiv(venue_info_div, loc) {
    var link = loc.name; 
    if (loc.url)
        link = "<a target='_blank' href='" + loc.url + "'>" + loc.name + "</a>"

    console.log(venue_info_div);
    venue_info_div.html("<div>" + link + " (" + loc.rating + "/10) - Cost: " + loc.price + "</div>");
}

function addNewLocation(category, location, personal) {
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

    var marker = L.marker(loc.point);
    loc.marker = marker;
    if (!loc.selected)  
        marker.setOpacity(0.5)                  

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
    
    marker.addTo(map);
    markersInMap.push(marker);
    marker._leaflet_id = category + "_" + marker._leaflet_id;

    var venue_info_div_id = "#info_" + category;
    var venue_info_div = $(venue_info_div_id);
    var thumbnailDiv = $("<div/>", {
        "class": "place_thumbnail"
        
    }).appendTo(category_div); 
    loc.thumbnailDiv = thumbnailDiv;
    addThumbnail(loc, venue_info_div, !personal);

    setCategoryDivWidth(category);
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
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            map.removeLayer(map._layers[i]);
        }
    }
    for (var i = 0; i < markersInMap.length; i++)
        map.removeLayer(markersInMap[i]);
    markersInMap = [];
    $('#option-column').empty();
    $('#option-column').append('<h2 class="major-column-header">Date template</h2>');
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
    // category = tag._leaflet_id.split("_")[0]

    // option_div = $('#option-column');
    // option_div.scrollTo("#category_header_" + category);    
    ev.target.openPopup();
}

function markerMouseLeft(ev) {
    ev.target.closePopup();
}

function getRandomColor()  {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ )
       color += letters[Math.round(Math.random() * 15)];
    return color;
}

console.log($.support.cors);

function queryFoursquare(queryString, sectionName) {
    $('#notFound').css('visibility','hidden');

    var lat,lon;
    var search = $.getJSON(queryString, function( data ) {
       // console.log('objects from section ' + sectionName);
        var thisCategory = foursquareSectionToCat[sectionName];
        console.log(data.response.groups[0]);
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
        //console.dir(theseVenues);

        if(resetMap)
        {   
            //console.dir(theseVenues[0].point[0]);//.venue.location.lat);
            if (!mapInitiated) {
                //initMap(theseVenues[0].point[0], theseVenues[0].point[1]);
                initMap(avLat, avLon);
            }
            else {
                var center = new L.LatLng(avLat, avLon);
                map.panTo(center);
            }
            resetMap = false;
        }

        /* add the new category */
        addNewCategory(thisCategory, mostRecentCategoryAdded, categoryColors[thisCategory].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = thisCategory;
        timeForNextDate += 1; // 1 hour change

        var openVenues = [];
        var venuescheckedOpen = 0;
        _.each(theseVenues, function(venue) {
            var openQuery = 'https://api.foursquare.com/v2/venues/' + venue.id + '/hours?' +
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
            $.getJSON(openQuery, function(openData) {
                var hours = openData.response.popular;
                if (hours.timeframes === undefined) {
                    openVenues.push(venue);
                    venuescheckedOpen++;
                    return false;
                }
                var timeframe = hours.timeframes[0].open; // not *technically* correct, maybe
                var openDuringDate = false;
                _.each(timeframe, function(openClose) {
                    if (currentStartTime >= openClose.start && currentEndTime <= openClose.end)
                        openDuringDate = true;
                });
                if (openDuringDate) {
                    openVenues.push(venue);
                }
                venuescheckedOpen++;
            });
        });
        function actuallyAddVenues() {
            if (venuescheckedOpen < theseVenues.length) {
                setTimeout(actuallyAddVenues, 100);
                return false;
            }
            openVenues.sort(function() { return 0.5 - Math.random() });
            nearbyVenues[thisCategory] = openVenues;
            addSuggestions(thisCategory, 0); // add the first 3 !
            searchVenuesCounter++;
        }
        actuallyAddVenues();
    }).fail(function(){
        $('#notFound').css('visibility','visible');
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
    if (endIndex >= venues.length)
        nextToSuggest[category] = 0;
}

function querySpecificVenueFoursquare(venueTerms, location, categoryName) {
    $('#notFound').css('visibility','hidden');  //remove error message
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
        var categoryId = categoryIds[categoryName];
        queryString += '&categoryId=' + categoryId;
    }
    var search = $.getJSON(queryString, function(data) {
        //console.log(venueTerms + ' results:');

        var bestMatch = data.response.venues[0];
        if(bestMatch == null)
            $('#notFound').css('visibility','visible');
        //console.log(bestMatch.id);
        var photoQuery = 'https://api.foursquare.com/v2/venues/' + bestMatch.id + '/photos?' +
            'limit=1' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        $.getJSON(photoQuery, function(photoData) {
            var photos = photoData.response.photos;
            bestMatch.photos = photos;
            var niceMatch = rawVenueToOurVenue(bestMatch, 'food');
            addedPlace = addToEnvironment("Restaurant", niceMatch, true, false);
            addNewLocation("Restaurant", addedPlace, true);
        })        
    }).fail(function(){
        $('#notFound').css('visibility','visible');
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
    //console.dir(vars);
}

function doFoursquareSectionsSearch(locationName) {
    foursquareSections.sort(function() { return 0.5 - Math.random() }); // sort the sections list

    // only take the top 3.
    // TODO: Have it take variable amount based on length of date
    searchVenuesCounterLimit = 3;
    for (var i=0; i<searchVenuesCounterLimit && i<foursquareSections.length; i++) {
        var queryString = 'https://api.foursquare.com/v2/venues/explore?near=' + locationName + 
            '&section=' + foursquareSections[i] +
            '&limit=45' + 
            '&venuePhotos=1' + 
            '&time=any' +
            '&day=any' + 
            '&client_id=' + clientId + 
            '&client_secret=' + secret + 
            '&v=20120625';
        queryFoursquare(queryString, foursquareSections[i]);
    };
}

function resetMapKeepingVariables() {
    searchVenuesCounter = 0;
    mostRecentCategoryAdded = "__START__";
    timeForNextDate = 1;
    environment = jQuery.extend(true, {}, blankEnvironment); // deep copy
}

function loadFromStore(saveName) {
    data = load_boar_sq("myData"); 

    savedEnv = data.env; 
    thisCategory = savedEnv['__START__'].nextCategory;
    while (thisCategory != null) {
        addNewCategory(thisCategory, mostRecentCategoryAdded, categoryColors[thisCategory].class, timeForNextDate + ":00");
        mostRecentCategoryAdded = thisCategory;
        timeForNextDate += 1; // 1 hour change

        _(savedEnv[thisCategory].places).each(function(savedPlace){
            addToEnvironment(thisCategory, savedPlace, savedPlace.selected, true); 
        }); 

        thisCategory = savedEnv[thisCategory].nextCategory;
    }

    initMap(data.loc[0], data.loc[1]);
}

function setFooterDescription(queryParams) {
    var d = "A date in " + queryParams.location + 
        " from " + queryParams.startTime + 
        " to " + queryParams.endTime +
        ". Have fun!";
    $('#footer-loc').html(d);
}

$(document).ready(function (){
    if (!store.enabled) {
        console.error('Local storage is not supported by your browser. Please disabled "Private Mode", or upgrade to a modern browser')
    }

    $.getJSON('https://api.foursquare.com/v2/venues/categories?client_id='
        +clientId+'&client_secret='+secret+'&v=20120625', function( data ) {
            setCategoryRef(data);
    });

    //querySpecificVenueFoursquare('mels burger', 'New York City', null);
    
    var $area = $('#place')[0];        //jquery objects for each input field
    var $startTime = $('#start')[0];
    var $duration = $('#duration')[0];
    
    //add 'not found' handler later
    $($area).change(function(e){   //find location match, get list of nearby places
        resetMap = true;                  // of recommended nearby venues
        area = this.value;
        currentArea = area; 

        clearMap();
        resetMapKeepingVariables();
        doFoursquareSectionsSearch(area);
        addNewLocationsOnceDone();
    });

    $('#specific-venue').submit(function() {
        var venueTerms = $("#specific-venue-query").val();
       // console.log('specific venue query');
        //console.log(currentArea);
        querySpecificVenueFoursquare(venueTerms, currentArea, null);

        return false;
    });

    var initialQueryParams = getUrlParams();
    //console.log(initialQueryParams);
    if (!initialQueryParams.location) {
        initialQueryParams.location = 'San Francisco';
    }
    if (!initialQueryParams.startTime) {
        initialQueryParams.startTime = "1200";
    }
    if (!initialQueryParams.endTime) {
        initialQueryParams.endTime = "1800";
    }
    currentArea = initialQueryParams.location;
    currentStartTime = initialQueryParams.startTime;
    currentEndTime = initialQueryParams.endTime;
    currentDay = 1;
    doFoursquareSectionsSearch(initialQueryParams.location);
    setFooterDescription(initialQueryParams);
    // loadFromStore("myData");
    // initLocations(environment);
    // setIteneraryIcons();

    function addNewLocationsOnceDone() {
        if (searchVenuesCounter < searchVenuesCounterLimit) {
            //console.log('not done');
            setTimeout(addNewLocationsOnceDone, 100);
            return false;
        }
        $(".loading").addClass("done_loading")
        initLocations(environment);
        setIteneraryIcons();
        save_boar_sq({
                      q: initialQueryParams, 
                      env: environment,
                      loc: [the_lat, the_lon],
                      },  
                      "myData");

        // data = load('myData');
        // console.log(load_boar_sq("myData"));
    }
    addNewLocationsOnceDone();

    $("#startTime").clockpick({
          starthour : 8,
          endhour : 23,
          event : "mouseover"
    });

    $("#endTime").clockpick({
      starthour : 8,
      endhour : 23,
      event : "mouseover"
    });
});