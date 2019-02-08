//Zomato API Call
function zomatoCall(event){
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

    xhr.onload = function() {
        if(this.status == 200){ //If success
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