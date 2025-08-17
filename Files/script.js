const apiKey = "12a15334ee2ff243c9bf080ae0666f77"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

const cityInput = document.getElementById('inpValue')
const searchBtn = document.getElementById('btn')
const locBtn = document.getElementById('locBtn')
const cityElement = document.getElementById('city')
const tempElement = document.getElementById('temp')
const windElement = document.getElementById('wind')

async function searchWeather(city) {
  if (!city.trim()) {
    showError("Please enter a city name")
    return
  }
  showLoading()
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`)
    if (!response.ok) throw new Error()
    const data = await response.json()
    updateWeather(data)
  } catch {
    showError("City not found")
  }
}

async function searchWeatherByLocation(lat, lon) {
  showLoading()
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    if (!response.ok) throw new Error()
    const data = await response.json()
    updateWeather(data)
  } catch {
    showError("Unable to fetch location weather")
  }
}

function updateWeather(data) {
  cityElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.name}, ${data.sys.country}`
  tempElement.innerHTML = `<i class="fas fa-thermometer-half"></i> ${Math.round(data.main.temp)}°C`
  windElement.innerHTML = `<i class="fas fa-wind"></i> ${data.wind.speed} km/hr`
}

function showLoading() {
  cityElement.innerHTML = '<div class="loading"></div> Loading...'
  tempElement.innerHTML = ''
  windElement.innerHTML = ''
}

function showError(msg) {
  cityElement.innerHTML = `<div class="error-message">${msg}</div>`
  tempElement.innerHTML = ''
  windElement.innerHTML = ''
}

searchBtn.addEventListener('click', () => searchWeather(cityInput.value))
cityInput.addEventListener('keypress', e => { if (e.key === 'Enter') searchWeather(cityInput.value) })
locBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => searchWeatherByLocation(pos.coords.latitude, pos.coords.longitude),
      () => showError("Location access denied")
    )
  } else {
    showError("Geolocation not supported")
  }
})

cityElement.innerHTML = "Enter a city to get weather"
