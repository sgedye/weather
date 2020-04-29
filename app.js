// document.addEventListener("DOMContentLoaded", () => {
//   let long, lat
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(position => {
//       long = Math.round(position.coords.longitude)
//       lat = Math.round(position.coords.latitude)
//       console.log(long, lat)
//     })
//
//     const api = "http://www.bom.gov.au/fwo/IDW60901/IDW60901.94608.json"  // BOM Data for Perth Observations - Individual Stations
//
//   } else { alert("Please allow geolocation") }
// })
  

document.addEventListener("DOMContentLoaded", () => {
  const location = document.getElementById("location")
  const realTemperature = document.getElementById("real-temp")
  const lastChecked = document.getElementById("last-checked")
  const feelsLike = document.getElementById("feel-temp")
  const humidity = document.getElementById("humidity")
  const proxy = 'https://cors-anywhere.herokuapp.com/'
  const api = 'http://reg.bom.gov.au/fwo/IDW60901/IDW60901.94608.json' // BOM Data for Perth Observations - Individual Stations
  fetch(proxy + api)
    .then(response => response.json())
    .then(data => {
      //console.log(data.observations.data[3])
      const { refresh_message, state_time_zone } = data.observations.header[0]
      const {name, apparent_t, air_temp, local_date_time, rel_hum } = data.observations.data[0]
      //const dataArray = data.observations.data
      //console.log("Issue time", lastUpdated)
      console.log(name, apparent_t, air_temp, local_date_time, rel_hum)

      location.innerHTML = `${name}, ${state_time_zone}`
      realTemperature.innerHTML = `${air_temp}°C`
      feelsLike.innerHTML = `Feels Like: <strong>${apparent_t}°C</strong>`
      let lastReport = local_date_time.replace(/\d+\/0?/, '')

      lastChecked.innerHTML = `Accurate as of: <strong>${lastReport}</strong>`
      humidity.innerHTML = `Humidity: <strong>${rel_hum}%</strong>`
    })

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