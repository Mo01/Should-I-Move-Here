//Zomato API Call
function zomatoCall(event) {
  event.preventDefault(); //Stop button from submitting
  $(".zomato-nightlife").empty();
  $(".zomato-top-cuisines").empty();
  let query = $(".city-input").val()
  let URL = "https://developers.zomato.com/api/v2.1/locations?query=" + query;
  let key = "c7026f9c7b7d563d6a029354b3f03a9a";
  //Declaring and opening an XHR
  let xhr = new XMLHttpRequest();
  xhr.open('GET', URL, true);
  xhr.setRequestHeader('user-key', key) //Requirement of API request, setting key as a header after open

  xhr.onload = function () {
    if (this.status == 200) { //If success
      let location = JSON.parse(this.responseText); //Parsing response text into JSON object
      let entityId = location.location_suggestions[0].entity_id; //Sets ID of city
      let type = location.location_suggestions[0].entity_type; //Specifies that request is for a city
      console.log(location)

      //Second request, to take city info and perform request for additional info on city
      let URL = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + type

      let xhr = new XMLHttpRequest();
      xhr.open('GET', URL, true);
      xhr.setRequestHeader('user-key', key)

      xhr.onload = function () {
        let cityInfo = JSON.parse(this.responseText);
        console.log(cityInfo)
        //Pushing names of top cuisines to page
        let topCuisines = cityInfo.top_cuisines;
        for (let i = 0; i < topCuisines.length; i++) {
          $(".zomato-top-cuisines").append("<p>" + topCuisines[i])
        }
        let nightlifeIndex = cityInfo.nightlife_index
        console.log(nightlifeIndex)
        $(".zomato-nightlife").append("<h2>" + nightlifeIndex)
      }
      xhr.send();
    }
  }
  xhr.send();
}

//Click listeners
$(".city-submit").on("click", zomatoCall)


//*****************************************************************//

//Google Map API

function initMap() {
  var myLatLng = { lat: 30.2672, lng: -97.7431 };

  // Create a map object and specify the DOM element
  // for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 11
  });

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    draggable: true,
    title: 'Welcome to SIMTO!',
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

  });
  // Animation marker
  marker.setAnimation(google.maps.Animation.BOUNCE)
  // to serarch for the location
  var searchBox = new google.maps.places.SearchBox(document.getElementById("city-input"));

  // to change event on search box
  google.maps.event.addListener(searchBox, 'places_changed', function () {

    var places = searchBox.getPlaces();

    //bound
    var bounds = new google.maps.LatLngBounds();
    var i, place;
    for (i = 0; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
      //set marker postion new....
      marker.setPosition(place.geometry.location);
      // Latitude
      var lat1 = places[i].geometry.location.lat();
      console.log(lat1);
      //Longitude
      var lng1 = places[i].geometry.location.lng();
      console.log(lng1);
      var cityName = places[i];
      console.log(cityName);
      //info window
      var contentString = '<div id="content">' +
        '<h6>Latitude =' + lat1 + '</h6><br>' +
        '<h6>Longitude  =' + lng1 + '</h6>' +


        '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      
         // Add the circle for this city to the map.
         var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: {lat: lat1, lng: lng1},
          radius: Math.sqrt(100000000)
        });
        console.log("cityCircle =   "+cityCircle);

      
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });
    }
    //fit to the bound
    map.fitBounds(bounds);
    // set zoom
    map.setZoom(9);
  });


}
   //Google map API ended