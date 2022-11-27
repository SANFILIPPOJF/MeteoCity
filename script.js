// lien HTML
const validation = document.getElementById('validation');
const villeInput = document.getElementById('ville-input');
const meteo = document.getElementById('meteo');
const aiguille = document.getElementById('aiguille');
const idnomVille = document.getElementById('idnomVille');
const idIcon = document.getElementById('idIcon');
const idtempMini = document.getElementById('idtempMini');
const idtempMax = document.getElementById('idtempMax');
const idressentie = document.getElementById('idressentie');
const idwindSpeed = document.getElementById('idwindSpeed');
const idwindDir = document.getElementById('idwindDir');
const idhumidity = document.getElementById('idhumidity');
const boussole = document.getElementById('boussole');

validation.addEventListener('click', getCoordonnees);
// définition de classe
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
// fonction permettant de recupéer les coordonnees gps d'une ville via l'API du gouvernement
function getCoordonnees() {
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${villeInput.value}&limit=1&type=municipality&autocomplete=1`)
    .then((response) => response.json())
    .then((data) => {
        let result = new City(data.features[0].properties.city,data.features[0].geometry.coordinates[0],data.features[0].geometry.coordinates[1]);
        getMeteo(result);
        return;
    })
}
// fonction permettant de récuperer les données meteorologiques en un point gps precis
function getMeteo(objcity){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${objcity.lat}&lon=${objcity.lon}&units=metric&appid=2ace5cdf8228e455e6b46adda9aade40`)
    .then((response) => response.json())
    .then((data) => {
        objcity.descript = data.weather[0].description;
        objcity.icon = data.weather[0].icon;
        objcity.tempMini = data.main.temp_min;
        objcity.tempMax = data.main.temp_max;
        objcity.ressentie = data.main.feels_like;
        // convertion vitesse du vent m/s => km/h (arondi à 1 dixieme)
        objcity.windSpeed = Math.round(data.wind.speed*36)/10;
        objcity.windDir = data.wind.deg;
        objcity.humidity = data.main.humidity;
        afficheMeteo(objcity);
    })
}
// affichage des données météorologiques
function afficheMeteo(objCity){
    idnomVille.textContent=objCity.nom;
    idIcon.src=`https://openweathermap.org/img/wn/${objCity.icon}@2x.png`;
    idIcon.label=objCity.descript;
    idtempMini.textContent=objCity.tempMini+"°C";
    idtempMax.textContent=objCity.tempMax+"°C";
    idressentie.textContent=objCity.ressentie+"°C";
// definition de la direction du vent sous la forme S SE
    let direction="";
    if(objCity.windDir <=30 || objCity.windDir >= 330){
        direction +="Nord ";
    } if (objCity.windDir >=60 && objCity.windDir <= 120){
        direction +="Est ";
    } if (objCity.windDir >=150 && objCity.windDir <= 210){
        direction +="Sud ";
    } if (objCity.windDir >=240 && objCity.windDir <= 300) {
        direction +="Ouest ";
    } if (objCity.windDir >=15 && objCity.windDir <= 75) {
        direction +="Nord-Est";
    } if (objCity.windDir >=105 && objCity.windDir <= 165) {
        direction +="Sud-Est";
    } if (objCity.windDir >=195 && objCity.windDir <= 255) {
        direction +="Sud-Ouest";
    } if (objCity.windDir >=285 && objCity.windDir <= 345) {
        direction +="Nord-Ouest";
    }
    idwindSpeed.textContent=`${objCity.windSpeed}Km/h -> ${direction}`;
    aiguille.style.transform = `rotate(${objCity.windDir}deg)`;
    idhumidity.textContent=objCity.humidity+"%";
    meteo.className="";
    return
}