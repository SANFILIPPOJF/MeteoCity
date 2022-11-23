const validation = document.getElementById('validation');
const villeInput = document.getElementById('ville-input');
const meteo = document.getElementById('meteo');

const idnomVille = document.getElementById('idnomVille');
const idIcon = document.getElementById('idIcon');
const idtempMini = document.getElementById('idtempMini');
const idtempMax = document.getElementById('idtempMax');
const idressentie = document.getElementById('idressentie');
const idwindSpeed = document.getElementById('idwindSpeed');
const idwindDir = document.getElementById('idwindDir');
const idhumidity = document.getElementById('idhumidity');

validation.addEventListener('click', getCoordonnees);

class City {
    constructor(nom = "", lon = 0, lat = 0){
        this.nom = nom;
        this.lon = lon;
        this.lat = lat;
        this.descript = "";
        this.icon = 0;
        this.tempMini = 0;
        this.tempMax = 0;
        this.ressentie = 0;
        this.windSpeed = 0;
        this.windDir = 0;
        this.humidity = 0
    }

}

function getCoordonnees() {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${villeInput.value}&limit=1&type=municipality&autocomplete=1`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.features[0].properties.city);        
        console.log(data.features[0].geometry.coordinates[0]);
        console.log(data.features[0].geometry.coordinates[1]);
        let result = new City(data.features[0].properties.city,data.features[0].geometry.coordinates[0],data.features[0].geometry.coordinates[1]);
        getMeteo(result);
        return;
    })
}
function getMeteo(objcity){
    console.log(objcity);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${objcity.lat}&lon=${objcity.lon}&units=metric&appid=2ace5cdf8228e455e6b46adda9aade40`)
    .then((response) => response.json())
    .then((data) => {
        console.log("meteo", data);
        console.log("description",data.weather[0].description);
        console.log("icon",data.weather[0].icon);
        console.log("temp mini",data.main.temp_min);
        console.log("temp max",data.main.temp_max);
        console.log("ressentie",data.main.feels_like);
        console.log("vitesse du vent",data.wind.speed);
        console.log("direction du vent",data.wind.deg);
        console.log("humidité",data.main.humidity);
        objcity.descript = data.weather[0].description;
        objcity.icon = data.weather[0].icon;
        objcity.tempMini = data.main.temp_min;
        objcity.tempMax = data.main.temp_max;
        objcity.ressentie = data.main.feels_like;
        objcity.windSpeed = data.wind.speed;
        objcity.windDir = data.wind.deg;
        objcity.humidity = data.main.humidity;
        console.log("objet city", objcity);
        afficheMeteo(objcity);
    })
}

function afficheMeteo(objCity){
    idnomVille.textContent=objCity.nom;
    idIcon.src=`http://openweathermap.org/img/wn/${objCity.icon}@2x.png`;
    idtempMini.textContent=objCity.tempMini+"°C";
    idtempMax.textContent=objCity.tempMax+"°C";
    idressentie.textContent=objCity.ressentie+"°C";
    idwindSpeed.textContent=objCity.windSpeed+"Km/h";

    idhumidity.textContent=objCity.humidity+"%";
    meteo.className="";
    return
}