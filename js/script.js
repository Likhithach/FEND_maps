var map,
    markers = ko.observableArray();
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

    createMarkers(Model.locations);
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

      };
    })(place));




    //Extend the map boundry, that the marker is included in visible region
    boundaries.extend(new google.maps.LatLng(place.location.lat, place.location.lng));


    // Fit map to the boundry
    map.fitBounds(boundaries);


    //It Push the marker to the markers array(ko observable)
    markers.push(marker);
  }
}
