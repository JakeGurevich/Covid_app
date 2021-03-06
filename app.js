const urlCorona = "https://corona-api.com/countries";

const countries = [];

let country = [];

async function getCountries() {
  const res = await fetch(urlCorona);
  const data = await res.json();
  console.log(data.data[0]);
  getRegions("africa", "confirmed");
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
  type: "line",

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
  const res = await fetch(
    `https://api.codetabs.com/v1/proxy?quest=https://restcountries.herokuapp.com/api/v1/region/${region}`
  );
  const data = await res.json();
  removeData(chart);
  data.forEach((el, index) => {
    for (i = 0; i < countries.length; i++) {
      if (el.name.common === countries[i].name) {
        let data = param;
        let parametr = "";
        switch (data) {
          case "recovered":
            parametr = countries[i].data.recovered;
          case "deaths":
            parametr = countries[i].data.deaths;
          case "confirmed":
            parametr = countries[i].data.confirmed;
          case "critical":
            parametr = countries[i].data.critical;
        }

        console.log(countries[i].name, parametr);
        addData(chart, countries[i].name, parametr);
      }
    }
    // asia.push(el.name.common);
    // });
    // console.log(chart.data.labels);
    // console.log(asia[0]);
    // console.log(countries[0].name);
    // if (asia.includes(countries[0].name)) {
    //   console.log("yes");
  });
}
getCountries();
// getRegions("asia");

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}
