# sun-horizon 🌄
[![License](https://img.shields.io/npm/l/sun-horizon.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/sun-horizon.svg)](https://www.npmjs.com/package/spongebob-speech)
[![Build Status](https://travis-ci.org/Jeremy38100/sun-horizon.svg?branch=master)](https://travis-ci.org/Jeremy38100/sun-horizon)


This library is highly based on [node-hgt](https://github.com/perliedman/node-hgt)

 - [Types](#Types)
 - [Function](#Functions)

## Install
`npm install sun-horizon`

## Usage

`const sunHorizon = require('sun-horizon');`

or

`import * as sunHorizon from 'sun-horizon';`

## Types

### LatLng
```ts
{
  lat: number;
  lng: number;
}
```

### HorizonOptions
```ts
{
  azimuthOptions?: AzimuthOptions;
  highestPointOptions?: HighestPointOptions;
}
```

### AzimuthOptions
```ts
{
  azimuthStart?: number; // degree, 0 is North, 90 Eeast
  azimuthEnd?: number; // degree
  azimuthTick?: number; // degree
}
```

### HighestPointOptions
```ts
{
  distanceMax?: number; // meter
  distanceTick?: number; // meter
}
```

### HorizonPoint
```ts
{
  azimuth: number; // degree
  angle: number; // degree, 0 is same elevation as origin
  altitude: number; // meter

  latLng?: LatLng;
}
```

### Horizon
```ts
{
  origin: LatLng;
  elevationProfile: HorizonPoint[];
}
```

### CacheData
```ts
{
  bytes: number;
  files: number;
}
```

## Functions

#### `getHorizon(origin: LatLng, options: HorizonOptions = {}): Promise<Horizon>`

#### Example
```ts
  const grenoble: LatLng = {
    lat: 45.185739,
    lng: 5.736236
  }
  const horizon = await getHorizon(grenoble);
  console.log(horizon.elevationProfile.map(point => point.altitude));
```
