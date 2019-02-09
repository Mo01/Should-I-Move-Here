//Zomato API Call
function zomatoCall(event) {
  $(".zomato-nightlife").empty();
  $(".zomato-top-cuisines").empty();
  let query = $(".city-input").val()
  let URL = "https://developers.zomato.com/api/v2.1/locations?query=" + query;
  let key = "c7026f9c7b7d563d6a029354b3f03a9a";
  //Declaring and opening an XHR
  let xhr = new XMLHttpRequest();
  xhr.open("GET", URL, true);
  xhr.setRequestHeader("user-key", key); //Requirement of API request, setting key as a header after open

  xhr.onload = function() {
    if (this.status == 200) {
      //If success
      $(".zomato-nightlife").empty();
      $(".zomato-top-cuisines").empty();
      $(".zomato-restaurants").empty();
      let location = JSON.parse(this.responseText); //Parsing response text into JSON object
      let entityId = location.location_suggestions[0].entity_id; //Sets ID of city
      let type = location.location_suggestions[0].entity_type; //Specifies that request is for a city
      console.log(location);

      //Second request, to take city info and perform request for additional info on city
      let URL =
        "https://developers.zomato.com/api/v2.1/location_details?entity_id=" +
        entityId +
        "&entity_type=" +
        type;

      let xhr = new XMLHttpRequest();
      xhr.open("GET", URL, true);
      xhr.setRequestHeader("user-key", key);

      xhr.onload = function() {
        let cityInfo = JSON.parse(this.responseText);
        console.log(cityInfo);
        //Pushing names of top cuisines to page
        let topCuisines = cityInfo.top_cuisines;
        for (let i = 0; i < topCuisines.length; i++) {
          $(".zomato-top-cuisines").append("<p>" + topCuisines[i]);
        }
        let nightlifeIndex = Number(cityInfo.nightlife_index);
        let cityPopularity = Number(cityInfo.popularity);
        $(".zomato-nightlife").append("<div class='score-titles'><p>Nightlife</p><p>Food</p></div><div class='score-box'><div class='nightlife-score score-bubble'><h2>" + nightlifeIndex + "</div><div class='popularity-score score-bubble'><h2>" + cityPopularity + "</div></div>");
        //Add color of popularity index
        if(cityPopularity >= 3.5){
          $(".popularity-score").addClass("green")
        } else if (cityPopularity > 1.5 && cityPopularity <3.5){
          $(".popularity-score").addClass("yellow")
        } else if (cityPopularity < 1.5){
          $(".popularity-score").addClass("red")
        }
        //Add color of nightlife index
        if(nightlifeIndex >= 3.5){
          $(".nightlife-score").addClass("green")
        } else if (nightlifeIndex > 1.5 && cityPopularity <3.5){
          $(".nightlife-score").addClass("yellow")
        } else if (nightlifeIndex < 1.5){
          $(".nightlife-score").addClass("red")
        }
        $(".city-submit").on("click", zomatoCall);
        let bestRestaurants = cityInfo.best_rated_restaurant;
        for (let i = 0; i < bestRestaurants.length; i++) {
          $(".zomato-restaurants").append(
            "<div class='img-" +
              i +
              " col-md-4 col-xs-6 image-box'><a class='restaurant-title' href='" +
              bestRestaurants[i].restaurant.url +
              "'>" +
              bestRestaurants[i].restaurant.name +
              "</a></div>"
          );
          if (bestRestaurants[i].restaurant.featured_image === "") {
            $(".img-" + i).append(
              "<img id='blank-img' class='restaurant-img img-thumbnail' src='assets/images/noimg.png'>"
            );
          } else {
            $(".img-" + i).append(
              "<img class='restaurant-img img-thumbnail' src ='" +
                bestRestaurants[i].restaurant.featured_image +
                "'>"
            );
          }
        }
      };
      xhr.send();
    }
  };
  xhr.send();
}

//Click listeners

//*****************************************************************//

//Google Map API

function initMap() {
  var myLatLng = { lat: 30.2672, lng: -97.7431 };

  // Create a map object and specify the DOM element
  // for display.
  var map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 11
  });

  // Create a marker and set its position..
  var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    draggable: true,
    title: "Welcome to SIMTO!",
    icon:
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
  });
  // to serarch for the location
  var searchBox = new google.maps.places.SearchBox(
    document.getElementById("city-input")
  );

  console.log(searchBox)

  // to change event on search box
  google.maps.event.addListener(searchBox, "places_changed", function() {
    var places = searchBox.getPlaces();

    //bound
    var bounds = new google.maps.LatLngBounds();
    var i, place;
    for (i = 0; (place = places[i]); i++) {
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
      zomatoCall();
    }
    //fit to the bound
    map.fitBounds(bounds);
    // set zoom
    map.setZoom(11);
  });
}
//Google map API ended
   //Google map API ended