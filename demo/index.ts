import { getHorizon, init } from "../src";

const express = require('express');
const app = express();

init();

app.use('/', express.static('app'));

app.get('/api', async (req, res) => {
  const altitude = await getHorizon({
    lat: Number(req.query.lat),
    lng: Number(req.query.lng),
  });
  res.json(altitude);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
