//Zomato API Call

//Location query to recieve log and lat
let query = "Sag Harbor"
let URL = "https://developers.zomato.com/api/v2.1/locations?query=" + query;
let key = "c7026f9c7b7d563d6a029354b3f03a9a";

function loadLongLat(){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.setRequestHeader('user-key', key)

    xhr.onload = function() {
        if(this.status == 200){
            let location = JSON.parse(this.responseText);
            let lat = location.location_suggestions[0].latitude;
            let long = location.location_suggestions[0].longitude;
            console.log(lat, long)
            let URL = "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + long
            
            let xhr = new XMLHttpRequest();
            xhr.open('GET', URL, true);
            xhr.setRequestHeader('user-key', key)

            xhr.onload = function(){
                    let cityInfo = JSON.parse(this.responseText);
                    console.log(cityInfo.popularity)
            }
        
            xhr.send();
        }
        
    }
    xhr.send();
}

loadLongLat()