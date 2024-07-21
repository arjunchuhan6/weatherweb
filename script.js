const city = document.getElementById("city");
const temp = document.getElementById("temp");
const wind = document.getElementById("hind");
const humidity = document.getElementById("humidity");
const image = document.getElementById("image");
const feels = document.getElementById("feels");
const mDate = document.getElementById("date");
const cards = document.querySelector(".cards");
const inputCity = document.querySelector("#inputcity");
const searchBtn = document.querySelector("#searchbtn")
const locationbutton = document.getElementById("locationbtn")
const date = new Date();
mDate.textContent = date.toLocaleDateString();

// latitude and longitude undefined, to access in whole document
let uLat = undefined;
let uLon = undefined;


// added event listener with search functionality
searchBtn.addEventListener("click", () => {
    if (!inputCity.value) {
        alert("Please enter City Name");
    } else {
        fetchForecast(false, false, inputCity.value);
        showPosition(false, inputCity.value);
    }
})

// get current location when click on button below
locationbutton.addEventListener("click", () => {
    getCurrentUserLocation();
})


// get current location of user, location permission is required
const getCurrentUserLocation = () => {
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation is not supported by this browser, try another browser.");
        }
    }
    const showError = (err) => {
        alert(err.message)
        return console.warn(err)
    }
    getLocation();
}

// function to fetch 5 days forecast, 

// the function can fetch based on latitude, longitude or on location  
const fetchForecast = async (uLat, uLon, location = false) => {

    let response = undefined;
    if (location) {
        try {
            response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${"7be4b62cc2b01d0fd844b4dec5d30d1e"}&units=metric`);
        } catch (error) {
            console.log(error)
        }

    } else {
        try {
            response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${uLat}&lon=${uLon}&appid=${"7be4b62cc2b01d0fd844b4dec5d30d1e"}&units=metric`);
        } catch (error) {
            console.log(error)
        }
    }

    const data = await response.json();
    if (data.cod == 404) {
        alert("Invalid City")
        document.location.reload();
    }
    const forecast = data.list.filter((item, index) => {
        return index % 8 === 0;
    })
    cards.innerHTML = "";
    forecastMap(forecast)
}

// function to display forecast data 
const forecastMap = (forecast) => {
    forecast.map((item) => {
        const cardContent = document.createElement("div");
        cardContent.classList.add("card", "w-full", "xs:w-[13rem]", "p-4", "backdrop-blur-sm", "bg-[#ffffff5c]", "transition-all", "hover:bg-[#ff00005c]", "border", "border-white");

        cardContent.innerHTML = `
            <h3>${item.dt_txt.split(" ")[0]}</h3>
            <img
              src="http://openweathermap.org/img/w/${item.weather[0].icon}.png"
              width="100px"
              alt=""
            />
            <p>Temperature: ${item.main.temp}0C</p>
            <p>Wind: ${item.wind.speed} M/S</p>
            <p>Humidity: ${item.main.humidity}%</p>
        `
        cards.appendChild(cardContent);
    })
}

// show position function to fetch location info  
const showPosition = async (position, location = false) => {
    if (location) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${"7be4b62cc2b01d0fd844b4dec5d30d1e"}&units=metric`)
            const data = await response.json();
            setMainData(data);
        } catch (error) {
            
        }
    } else {
        uLat = position.coords.latitude;
        uLon = position.coords.longitude;
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${uLat}&lon=${uLon}&appid=${"7be4b62cc2b01d0fd844b4dec5d30d1e"}&units=metric`)
            const data = await response.json();
            setMainData(data);
            fetchForecast(uLat, uLon);
        } catch (error) {
        }
    }
}

// function for setting the weather data 
const setMainData = (data) => {

    city.textContent = data.name;
    temp.textContent = data.main.temp;
    wind.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;
    image.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    feels.textContent = data.weather[0].description;

}
getCurrentUserLocation();