//  If you want to use GeoLocation:
//
// document.addEventListener("DOMContentLoaded", () => {
//   let long, lat
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(position => {
//       long = Math.round(position.coords.longitude)
//       lat = Math.round(position.coords.latitude)
//       console.log(long, lat)
//     })
//     const api = "https://www.whatever.json"
//   } else { 
//     alert("Please allow geolocation")
//   }
// })


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("temperature").style.display = 'none'

  const location = document.getElementById("location")
  const realTemperature = document.getElementById("real-temp")
  const lastChecked = document.getElementById("last-checked")
  const feelsLike = document.getElementById("feel-temp")
  const humidity = document.getElementById("humidity")
  const weatherIcon = document.getElementById("weather-icon")

  const proxy = 'https://cors-anywhere.herokuapp.com/'
  const api = 'http://reg.bom.gov.au/fwo/IDW60901/IDW60901.94608.json' // BOM Data for Perth Observations - Individual Stations

  fetch(proxy + api)
    .then(response => response.json())
    .then(data => {
      const { state_time_zone } = data.observations.header[0]
      const { name, apparent_t, air_temp, local_date_time, rel_hum } = data.observations.data[0]
      const { wind_spd_kmh, rain_trace, cloud } = data.observations.data[0]

      location.innerHTML = `${name}, ${state_time_zone}`
      realTemperature.innerHTML = `${air_temp}°C`
      let lastReport = local_date_time.replace(/\d+\/0?/, '')
      lastChecked.innerHTML = `Accurate as of: <strong>${lastReport}</strong>`
      feelsLike.innerHTML = `Feels Like: <strong>${apparent_t}°C</strong>`
      humidity.innerHTML = `Humidity: <strong>${rel_hum}%</strong>`
      wind.innerHTML = `Wind: <strong>${wind_spd_kmh} km/h</strong>`

      document.getElementById("loading").style.display = 'none'
      document.getElementById("temperature").style.display = 'block'
      setWeatherIcon(wind_spd_kmh, rain_trace, cloud, lastReport)
    })
    
  function setWeatherIcon(wind, rain, cloud, time) {
    let militaryTime = time.includes('pm') 
      ? Number(time.replace(/\D/g, '')) + 1200
      : Number(time.replace(/\D/g, ''))
    let isDay = (militaryTime >= 0600 && militaryTime < 1800)
    let iconName
    if (Number(rain) >= 0.5) {
      iconName = 'RAIN'
    } else if (wind >= 15) {
      iconName = 'WIND'
    } else if (cloud === "Cloudy") {
      iconName = 'CLOUDY'
    } else if (cloud === "Partly cloudy") {
      iconName = isDay ? 'PARTLY_CLOUDY_DAY' : 'PARTLY_CLOUDY_NIGHT'
    } else {
      iconName = isDay ? 'CLEAR_DAY' : 'CLEAR_NIGHT'
    }
    const skycons = new Skycons({ 'color': '#222' })
    skycons.play()
    return skycons.set(weatherIcon, Skycons[iconName])
  }

  const convertToFahrenheit = tempInC => tempInC * 9 / 5 + 32
  const convertToCelsius = tempInF => (tempInF - 32) * 5 / 9

  realTemperature.addEventListener('click', () => {
    let isCelsius = realTemperature.innerHTML.includes('C')
    let temp = Number(realTemperature.innerHTML.replace(/°\w/, ''))
    let convertedTemp = isCelsius ? convertToFahrenheit(temp) : convertToCelsius(temp)
    convertedTemp = convertedTemp.toString().replace(/(\d+\.\d)\d*/, ($1, $2) => $2)
    realTemperature.innerHTML = isCelsius ? `${convertedTemp}°F` : `${convertedTemp}°C` 
  })
})