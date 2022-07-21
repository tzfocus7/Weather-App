const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const apiKey = "edb40f4928739d720da95a8ce596abc0";
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const wIcon = document.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");
let apiUrl;

inputField.addEventListener("keyup", (e) => {
    //if user presses enter key and input value is not empty
    if (e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    } else {
        return;
    }
});

function requestApi(city){
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerHTML = "Getting weather details...";
    infoTxt.classList.add("pending");
    
    fetch(apiUrl).then(res => res.json()).then(result => {
        weatherDetails(result);
        console.log(result);
    })
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if (info.cod == "404"){
        infoTxt.innerHTML = `${inputField.value} isn't a valid city`;
    } else {
        //lets get the required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if (id == 800){
            wIcon.src = "images/clear.jpeg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "images/storm.jpeg";
        } else if (id >= 600 && id <= 622){
            wIcon.src = "images/snow.jpeg";
        } else if (id >= 701 && id <= 781){
            wIcon.src = "images/haze.png";
        } else if (id >= 801 && id <= 804){
            wIcon.src = "images/cloud.png";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "images/rain.png";
        }

        //lets pass these values to a particular HTML element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation){ //if browser supports geolocation API 
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your browser does not support geolocation API");
    }
})

function onSuccess(position){
    console.log(position);
    const {latitude, longitude} = position.coords; //getting lat and lon of the user device from coords object
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
})