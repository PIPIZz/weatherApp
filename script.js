const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
wIcon = wrapper.querySelector(".weather-part img");
arrowBack =  wrapper.querySelector("header i");
let api;
const apiKey ="ee13eac903d7ec9949c547d2360b00b4"
inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click" , ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }else{
        alert("Your brower not support geolocation api");
    }
});

arrowBack.addEventListener("click" , ()=>{
    wrapper.classList.remove("active");
    infoTxt.classList.remove("pending");
})

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api)
    .then(response => response.json())
    .then(result => weatherDetails(result))
}

function onError(error){
    console.log(error);
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function onSuccess(position){
    // let longitude = position.coords.longitude;
    // let latitude = position.coords.latitude;
    const {latitude , longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function requestApi(cityName){
    // console.log(cityName);
    api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetchData();
}



function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending","error");
        infoTxt.innerText = `${inputField.value} isn't a valid city`;
    }else{
        const country = info.sys.country;
        const cityName = info.name;
        const{description , id} = info.weather[0];
        const {feels_like, humidity , temp} = info.main;

        if(id == 800){
            wIcon.src = "WeatherIcons/clear.svg"; 
        }else if(id >= 200 && id <= 232){
            wIcon.src = "WeatherIcons/storm.svg"; 
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531 )) {
            wIcon.src = "WeatherIcons/rain.svg"; 
        }else if(id >= 600 && id <= 622){
            wIcon.src = "WeatherIcons/snow.svg"; 
        }else if(id >= 701 && id <= 781){
            wIcon.src = "WeatherIcons/haze.svg"; 
        }else if(id >= 801 && id <= 804){
            wIcon.src = "WeatherIcons/cloud.svg"; 
        }

        wrapper.querySelector(".temp .numb").innerText =Math.floor(temp);
        wrapper.querySelector(".weather ").innerText = description;
        wrapper.querySelector(".location span").innerText = `${cityName}, ${country}`;
        wrapper.querySelector(" .feels .numb-2").innerText = Math.floor(feels_like);;
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.replace("error","pending");
        wrapper.classList.add("active");
       console.log(info);
    }
}
