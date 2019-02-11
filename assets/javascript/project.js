//Brewery Call
function breweryCall(city) {
  console.log("calling brew");
  var queryURL = "https://api.openbrewerydb.org/breweries?&by_city=" + city;
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var results = response.data;
    for (let i = 0; i < response.length; i++) {
      console.log(response[i].name);
      $(".brewery").append("<p>" + response[i].name + "</p>");
    }
  });
}

// Weather Call
function weatherCall(lat, long) {
  var tempsArray = [];
  //var key = "cd768e4e7c686a1539e5422b289fe5ee";
  var colinkey = "5362525d5bdad9fb24c68f96bf2e2f26";
  var latitude = lat.toString();
  var longitude = long.toString();
  var date = new Date();
  var lastYear = (date.getFullYear() - 1).toString();
  var month = "0";
  var callCounter = 0;
  for (var i = 1; i < 13; i++) {
    if (i < 10) {
      month = "0" + i;
    } else {
      month = i;
    }
    var queryDate = lastYear + "-" + month + "-15" + "T12:00:00";
    var queryURL =
      "https://api.darksky.net/forecast/" +
      colinkey +
      "/" +
      latitude +
      "," +
      longitude +
      "," +
      queryDate;

    $.ajax({
      method: "GET",
      url: queryURL,
      crossDomain: true,
      dataType: "jsonp",
      success: function(response) {
        callCounter++;
        console.log("callCounter", callCounter);
        var monthObject = {
          time: response.currently.time,
          tempHigh: response.daily.data[0].temperatureHigh,
          tempLow: response.daily.data[0].temperatureLow
        };
        tempsArray.push(monthObject);
        if (tempsArray.length === 12) {
          onDataReceived();
        }
      }
    });
  }

  function onDataReceived() {
    tempsArray.sort(function(a, b) {
      return a.time - b.time;
    });
    createWeatherChart(tempsArray);
  }

  function createWeatherChart(tempArray) {
    var highs = [];
    var lows = [];
    for (var i = 0; i < tempArray.length; i++) {
      highs.push(tempArray[i].tempHigh);
      lows.push(tempArray[i].tempLow);
    }
    var ctx = document.getElementById("tempChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "High Temperature",
            data: highs,
            backgroundColor: ["rgba(255, 0, 0, 0)"],
            borderColor: ["rgba(255, 0, 0, 1)"],
            borderWidth: 2
          },
          {
            label: "Low Temperature",
            data: lows,
            backgroundColor: ["rgba(0,0,256,0)"],
            borderColor: ["rgba(0,0,256,1)"],
            borderWidth: 2
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}

//Zomato API Call
function zomatoCall(city) {
  $(".score-box").empty();
  let query = city;
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
        $("#food-header").append(
          "<div class='score-box'><div class='popularity-score score-bubble'><h2>" +
            cityPopularity +
            "</div></div>"
        );
        $("#nightlife-header").append(
          "<div class='score-box'><div class='nightlife-score score-bubble'><h2>" +
            nightlifeIndex +
            "</div>"
        );
        //Add color of popularity index
        if (cityPopularity >= 3.5) {
          $(".popularity-score").addClass("green");
        } else if (cityPopularity > 1.5 && cityPopularity < 3.5) {
          $(".popularity-score").addClass("yellow");
        } else if (cityPopularity < 1.5) {
          $(".popularity-score").addClass("red");
        }
        //Add color of nightlife index
        if (nightlifeIndex >= 3.5) {
          $(".nightlife-score").addClass("green");
        } else if (nightlifeIndex > 1.5 && nightlifeIndex < 3.5) {
          $(".nightlife-score").addClass("yellow");
        } else if (nightlifeIndex < 1.5) {
          $(".nightlife-score").addClass("red");
        }
        $(".city-submit").on("click", zomatoCall);
        let bestRestaurants = cityInfo.best_rated_restaurant;
        for (let i = 0; i < bestRestaurants.length; i++) {
          $(".zomato-restaurants").append(
            "<div class='img-" +
              i +
              " col-md-6 col-xs-12 image-box'><a class='restaurant-title' href='" +
              bestRestaurants[i].restaurant.url +
              "'>" +
              bestRestaurants[i].restaurant.name +
              "</a></div>"
          );
          console.log(bestRestaurants[i].restaurant.price_range)
          let priceRange = bestRestaurants[i].restaurant.price_range;
          let cuisines = bestRestaurants[i].restaurant.cuisines;
          $(".img-" + i).append("<p class='par-"+ i +"'><i class='fas fa-star' aria-hidden='true'></i>" + bestRestaurants[i].restaurant.user_rating.aggregate_rating + "</p>");
          if(priceRange === 1){
            $(".img-" + i).append(cuisines + " | <i class='fas fa-dollar-sign'></i>")
          } else if(priceRange === 2){
            $(".img-" + i).append(cuisines + " | <i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i>")
          } else if (priceRange === 3){
            $(".img-" + i).append(cuisines + " | <i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i>")
          } else if (priceRange === 4){
            $(".img-" + i).append(cuisines + " | <i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i><i class='fas fa-dollar-sign'></i>")
          }
          //For blank img, append default img. for filled ones, append image URL
          if (bestRestaurants[i].restaurant.featured_image === "") {
            $(".img-" + i).append(
              "<img class='restaurant-img img-thumbnail' src='assets/images/noimg.png'>"
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

  console.log(searchBox);

  // to change event on search box
  google.maps.event.addListener(searchBox, "places_changed", function() {
    $("#main-content").css("display", "block");
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
      var cityName = places[i].name;
      $(".city").text(cityName);
      //info window
      var contentString =
        '<div id="content">' +
        "<h6>Latitude =" +
        lat1 +
        "</h6><br>" +
        "<h6>Longitude  =" +
        lng1 +
        "</h6>" +
        "</div>";

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      // Add the circle for this city to the map.
      var cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: { lat: lat1, lng: lng1 },
        radius: Math.sqrt(100000000)
      });
      console.log("cityCircle =   " + cityCircle);

      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
      zomatoCall(cityName);
      weatherCall(lat1, lng1);
      console.log(cityName);
      breweryCall(cityName);
    }
    //fit to the bound
    map.fitBounds(bounds);
    // set zoom
    map.setZoom(11);
  });
}

//Google map API ended
//Google map API ended
