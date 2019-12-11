const app = new Vue({
  el: '#app',
  data: {
    latlng: '45.185739, 5.736236',
    pending: false,
  },
  methods: {
    form: async function (e) {
      e.preventDefault();
      try {
        if (this.$data.pending) return;
        this.$data.pending = true;
        draw((await axios(url(latlng.value))).data);
      } catch (e) {
        console.error(e);
      }
      this.$data.pending = false;
    }
  }
});

function url(latlng) {
  const latlngArr = latlng.split(',').map( l => l.trim());
  return `/api?lat=${latlngArr[0]}&lng=${latlngArr[1]}`;
}

function draw(elevation) {
  const origin = elevation.origin;
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels: elevation.elevationProfile.map(e => e.azimuth),
          datasets: [{
              label: 'Horizon profile',
              backgroundColor: '#c797e5',
              borderColor: '#9b4dca',
              data: elevation.elevationProfile.map(e => e.angle)
          }]
      },

      // Configuration options go here
      options: {
        elements: {
            point:{
                radius: 0
            }
        }
    }
  });
}