# sun-horizon 🌄
[![License](https://img.shields.io/npm/l/sun-horizon.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/sun-horizon.svg)](https://www.npmjs.com/package/sun-horizon)
[![Build Status](https://travis-ci.org/Jeremy38100/sun-horizon.svg?branch=master)](https://travis-ci.org/Jeremy38100/sun-horizon)

🌄 Get Horizon profile based on topography from a (latitude, longitude) point.

🙌🏻 This module is heavily based on [node-hgt](https://github.com/perliedman/node-hgt).

 - [Types](#Types)
 - [Function](#Functions)
   - [init](#init)
   - [getHorizon](#getHorizon)
   - [highestPointInAzimuth](#highestPointInAzimuth)
   - [getAltitude](#getAltitude)
   - [getCacheData](#getCacheData)
   - [cleanCache](#cleanCache)

## ☕️ Support
<a href="https://www.buymeacoffee.com/jOVt3wg" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="42" ></a>
<a href="https://www.paypal.me/Jeremy38100" target="_blank"><img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png" height="42" alt="PayPal"></a>

## 🏁 Install
`npm install sun-horizon`

## 🏃‍♂️ Usage

✅ Call [init()](#init) function before any other operations.

🗄 __sun-horizon__ uses a cache directory of HGT files (default `sun-horizon-data/`).

💻 This module supports __javascript__ or __typescirpt__.

```js
const sunHorizon = require('sun-horizon');

sunHorizon.init();
const horizon = await sunHorizon.getHorizon({"lat": 45, "lng": 5});
```

or

```ts
import { getHorizon, init } from 'sun-horizon';

init();
const horizon = await getHorizon({lat: 45, lng: 5});
```

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

## `init`

```ts :
init(cacheDirectory?: string): void
```

Initialize module and create the required cache directory (default is `sun-horizon-data/`)  + populate with a `.gitignore` file.

## `getHorizon`

```ts
getHorizon(origin: LatLng, options?: HorizonOptions): Promise<Horizon>
```

```ts
const grenoble: LatLng = {
  lat: 45.185739,
  lng: 5.736236
}
const horizon = await getHorizon(grenoble);
console.log(horizon.elevationProfile.map(point => point.altitude));
```

## `highestPointInAzimuth`

```ts
highestPointInAzimuth(origin: LatLng, azimuth: number, options?: HighestPointOptions): Promise<HorizonPoint>
```

```ts
const origin: LatLng = {
  lat: 45.185739,
  lng: 5.736236
}
const azimuth = 90; // East
const point = await highestPointInAzimuth(origin, azimuth);
```

## `getAltitude`

```ts
getAltitude(latLng: LatLng): Promise<number>
```

```ts
const origin: LatLng = {
  lat: 45.185739,
  lng: 5.736236
}
const altitude = await getAltitude(origin); // in meter
```

## `getCacheData`

Return number of files and total size in `bytes`. (See [CacheData](#CacheData))

```ts
getCacheData(): Promise<CacheData>
```

```ts
const cache = await getCacheData();
```

## `cleanCache`

Delete all .hgt cache files and return number of deleted files.

```ts
cleanCache(): Promise<number>
```

```ts
const deletedFiles = await cleanCache();
```
