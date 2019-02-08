//Zomato API Call
function zomatoCall(event){
    event.preventDefault(); //Stop button from submitting
    $(".city-submit").off();
    $(".zomato-nightlife").empty();
    $(".zomato-top-cuisines").empty();
    let query = $(".city-input").val()
    let URL = "https://developers.zomato.com/api/v2.1/locations?query=" + query;
    let key = "c7026f9c7b7d563d6a029354b3f03a9a";
    //Declaring and opening an XHR
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.setRequestHeader('user-key', key) //Requirement of API request, setting key as a header after open

    xhr.onload = function() {
        if(this.status == 200){ //If success
            $(".zomato-nightlife").empty();
            $(".zomato-top-cuisines").empty();
            $(".zomato-restaurants").empty();
            let location = JSON.parse(this.responseText); //Parsing response text into JSON object
            let entityId = location.location_suggestions[0].entity_id; //Sets ID of city
            let type = location.location_suggestions[0].entity_type; //Specifies that request is for a city
            console.log(location)

            //Second request, to take city info and perform request for additional info on city
            let URL = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + type
            
            let xhr = new XMLHttpRequest();
            xhr.open('GET', URL, true);
            xhr.setRequestHeader('user-key', key)

            xhr.onload = function(){
                    let cityInfo = JSON.parse(this.responseText);
                    console.log(cityInfo)
                    //Pushing names of top cuisines to page
                    let topCuisines = cityInfo.top_cuisines;
                    for(let i=0;i<topCuisines.length;i++){
                        $(".zomato-top-cuisines").append("<p>" + topCuisines[i])
                    }
                    let nightlifeIndex = cityInfo.nightlife_index
                    $(".zomato-nightlife").append("<h2>" + nightlifeIndex)
                    $(".city-submit").on("click", zomatoCall)
                    let bestRestaurants = cityInfo.best_rated_restaurant
                    for (let i=0;i<bestRestaurants.length;i++){
                        $(".zomato-restaurants").append("<h4>" + bestRestaurants[i].restaurant.name)
                        if(bestRestaurants[i].restaurant.featured_image === ""){
                            $(".zomato-restaurants").append("<img class='restaurant-img' src='assets/images/noimg.png'>")
                        } else {
                            $(".zomato-restaurants").append("<img class='restaurant-img' src ='" + bestRestaurants[i].restaurant.featured_image + "'>")
                        }
                        $(".zomato-restaurants").append("<a href='"+ bestRestaurants[i].restaurant.url + "' class='website-link'>Link to Website</a>")
                        console.log(bestRestaurants[i].restaurant)
                        console.log(bestRestaurants[i].restaurant.name)
                        console.log(bestRestaurants[i].restaurant.featured_image)
                        console.log(bestRestaurants[i].restaurant.url)
                    }
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
        var myLatLng = {lat: 30.2672, lng: -97.7431};

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
        // to serarch for the location
        var searchBox = new google.maps.places.SearchBox(document.getElementById("city-input"));

        // to change event on search box
        google.maps.event.addListener(searchBox, 'places_changed',function(){

            var places = searchBox.getPlaces();
            
            //bound
            var bounds = new google.maps.LatLngBounds();
            var i, place;
            for (i=0; place=places[i];i++){
              bounds.extend(place.geometry.location);
              //set marker postion new....
              marker.setPosition(place.geometry.location);
            }
            //fit to the bound
            map.fitBounds(bounds);
            // set zoom
            map.setZoom(11);
        });


      }    
   //Google map API ended