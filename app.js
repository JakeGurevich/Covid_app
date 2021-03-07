const asia = document.querySelector("#asia");
const africa = document.querySelector("#africa");
const europe = document.querySelector("#europe");
const america = document.querySelector("#americas");
const confirmed = document.querySelector("#confirmed");
const deaths = document.querySelector("#deaths");
const recovered = document.querySelector("#recovered");
const critical = document.querySelector("#critical");
let status = "recovered";
let region = "asia";
const urlCorona = "https://corona-api.com/countries";
let url =
  "https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1";
const countries = [];

let country = [];

async function getCountries() {
  const res = await fetch(urlCorona);
  const data = await res.json();
  console.log(data.data[0]);

  data.data.map((el) => {
    const obj = {};
    obj.name = el.name;
    obj.data = el.latest_data;
    countries.push(obj);
  });
}

const ctx = document.querySelector("#myChart").getContext("2d");
const chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "bar",

  // The data for our dataset
  data: {
    labels: [],
    datasets: [
      {
        label: "Covid - 19",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
    ],
  },

  // Configuration options go here
  options: {},
});

chart.canvas.style.height = "400px";
chart.canvas.style.width = "1200px";

async function getRegions(region, param) {
  console.log(region, param);
  let urlFetch = "";
  if (region === "world") {
    console.log("yes");
    urlFetch = url;
  } else {
    urlFetch = `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1/region/${region}`;
  }
  const res = await fetch(urlFetch);
  const data = await res.json();

  // removeData(chart);
  chart.data.labels.splice(0, chart.data.labels.length);

  chart.data.datasets[0].data.splice(0, chart.data.datasets[0].data.length);
  data.forEach((el, index) => {
    for (i = 0; i < countries.length; i++) {
      if (el.name.common === countries[i].name) {
        let data = param;

        let parametr = "";
        switch (data) {
          case "recovered":
            parametr = countries[i].data.recovered;
            break;
          case "deaths":
            parametr = countries[i].data.deaths;
            break;
          case "confirmed":
            parametr = countries[i].data.confirmed;
            break;
          case "critical":
            parametr = countries[i].data.critical;
        }

        addData(chart, countries[i].name, parametr);
      }
    }
  });
}

const checkStatus = (event) => {
  status = event.target.id;
  console.log(status, region);
  getRegions(region, status);
};
const clickHandler = (event) => {
  region = event.target.id;

  // checkStatus();

  console.log(region, status);
  getRegions(region, status);
};
getCountries();
getRegions("world", "recovered");
asia.addEventListener("click", clickHandler);
africa.addEventListener("click", clickHandler);
europe.addEventListener("click", clickHandler);
america.addEventListener("click", clickHandler);
world.addEventListener("click", clickHandler);
confirmed.addEventListener("click", checkStatus);
deaths.addEventListener("click", checkStatus);
recovered.addEventListener("click", checkStatus);
critical.addEventListener("click", checkStatus);

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}
