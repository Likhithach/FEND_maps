var map;

function initMap() {
    // costructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 17.688112,
            lng: 83.213121
        },
        zoom: 13
    });
}