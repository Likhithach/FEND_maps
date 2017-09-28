var map,
    infowindow,
    markers = ko.observableArray(),
    view_model;
// this Model holds locations to be displayed in our map
var Model = {

  // the currentplace will be assigned with the clicked location
  currentPlace: null,

  // Array of objects of places to visit
  locations: [{
    title: "Varaha Lakshmi Narasimha temple",
    location: {
      lat: 17.766380,
      lng: 83.250627
    },
    wiki: null
  }, {
    title: "RamaKrishna Mission Beach",
    location: {
      lat: 17.710722,
      lng: 83.318528
    },
    wiki: null
  }, {
    title: "kailasagiri",
    location: {
      lat: 17.749216,
      lng: 83.342202
    },
    wiki: null
  }, {
    title: "Thotlakonda",
    location: {
      lat: 17.828455,
      lng: 83.409315
    },
    wiki: null
  }, {
    title: "Shilparamam Jathara",
    location: {
      lat: 17.804793,
      lng: 83.353335
    },
    wiki: null
  }, {
    title: "Bheemili beach",
    location: {
      lat: 17.890253,
      lng: 83.455852
    },
    wiki: null
  }, {
    title: "Devipuram",
    location: {
      lat: 17.766281,
      lng: 83.083248
    },
    wiki: null
  }, {
    title: "Borra Caves",
    location: {
      lat: 18.280693,
      lng: 83.039699
    },
    wiki: null
  }, {
    title: "Araku Valley",
    location: {
      lat: 18.327349,
      lng: 83.318376
    },
    wiki: null
  }, {
    title: "Lambasingi",
    location: {
      lat: 17.818596,
      lng: 82.492196
    },
    wiki: null
  }, ]
};

function initMap() {
    // costructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 17.688112,
            lng: 83.213121
        },
        zoom: 13
    });

    // Adding mapBounds property to the window object
    window.mapBounds = new google.maps.LatLngBounds();

    infoWindow = new google.maps.InfoWindow({
      maxWidth: 250
    });

    createMarkers(Model.locations);


    view_model = new viewModel();
}

// This function creates markers on the map
function createMarkers(locations) {

  // initlizing variables
  var place,
    i,
    boundaries,
    lengthOfAllPlaces = locations.length;

  //This loop itterates over the locations and creates marker for every place
  for (i = 0; i < lengthOfAllPlaces; i++) {
    //current place
    place = locations[i];


    boundaries = window.mapBounds;

    // It creates new marker and assign to map
    marker = new google.maps.Marker({
      position: place.location,
      animation: google.maps.Animation.DROP,
      map: map,
      title: place.title
    });



    marker.addListener('click', (function(place) {
      return function() {


        (function(place) {
          Model.currentPlace = place;
        })(place);

        // invoking showInfoWindow
        toggleBounce();
        showInfoWindow();

      };
    })(place));

    // wikimedia information about the place
    getWikiInfo(place, i);

    // closeclick event is initialised to make activeIndex null
    google.maps.event.addListener(infoWindow, 'closeclick', function() {
      toggleBounce();
      view_model.activeIndex(null);
    });

    //Extend the map boundry, that the marker is included in visible region
    boundaries.extend(new google.maps.LatLng(place.location.lat, place.location.lng));


    // Fit map to the boundry
    map.fitBounds(boundaries);


    //It Push the marker to the markers array(ko observable)
    markers.push(marker);
  }
}

// Displays infoWindow
showInfoWindow = function() {

  var
    currentPlace = Model.currentPlace,

    index = Model.locations.indexOf(currentPlace),

    content = '<div class="info-window">';
  content += '<h4>' + currentPlace.title + '</h4>';
  if (currentPlace.wiki === null) {
    content += '<p>Sorry! Unable to load wikipedia information</p>';
  } else {
    content += '<p><strong><i>' + currentPlace.wiki + '</i></strong></p>' + '</div>';
  }
  

  //set current place active
  view_model.activeIndex(index);

  // setting infowindow content
  infoWindow.setContent(content);

  //Center the infoWindow on map
  map.panTo(currentPlace.location);

  //Opens the infowindow on the marker on which we clicked
  infoWindow.open(map, markers()[index]);
};

//Adds animation effect on google map markers taken from google map markers animation effects
var toggleBounce = function() {

  //get index of the current place
  var index = Model.locations.indexOf(Model.currentPlace);

  //get the marker of the current place
  var marker = markers()[index];

  //itterate over the markers
  markers().forEach(function(mark, i) {
    //if current marker index of itterating loop is
    //not same as currentPlace index remove animation
    if (index !== i) mark.setAnimation(null);
  });


  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    infoWindow.close();
    view_model.activeIndex(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};


window.addEventListener('resize', function(e) {

  map.fitBounds(mapBounds);
});

//getting place information from wikipedia
var getWikiInfo = function(place, i) {
  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + place.title + "&format=json";

  // timeout function runs and alert failed after 8 sec
  var wikiTimeout = setTimeout(function() {
    if (i === 0) alert('Unable to Load Information from wikipedia');
  }, 8000);

  //It set the response to current Model.locations object property wiki
  $.ajax({
    url: wikiURL,
    dataType: "jsonp",
    success: function(data) {
      Model.locations[i].wiki = data[2][0];


      //we got response from wiki. clear the timeout so that the alert will not open.
      clearTimeout(wikiTimeout);
    }
  });
};

//knockout view model
var viewModel = function() {
  var self = this;



  //it holds the index of active items
  self.activeIndex = ko.observable(null);
  };