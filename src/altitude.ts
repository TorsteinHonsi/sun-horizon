import { getLocationDestination } from './location';
import { LatLng, HighestPointParams, HorizonPoint } from './types';

const TileSet = require('node-hgt').TileSet
const ImagicoElevationDownloader = require('node-hgt').ImagicoElevationDownloader
const tileDirectory = './data'
const tileDownloader = new ImagicoElevationDownloader(tileDirectory)
const tiles = new TileSet(tileDirectory, {downloader:tileDownloader});

export async function getAltitude(latLng: LatLng): Promise<number> {
  return new Promise((resolve, reject) => {
    tiles.getElevation(
      [latLng.lat, latLng.lng],
      (err: any, altitude: number) => {
        if (err) reject(err);
        resolve(altitude);
    });
  });
}

export async function highestPointInAzimuth(origin: LatLng, azimuth: number, options: HighestPointParams): Promise<HorizonPoint> {
  let highestPoint: HorizonPoint = {
    latLng: origin,
    altitude: await getAltitude(origin),
    angle: 0,
    azimuth
  };

  let distance = options.distanceTick;
  while (distance <= options.distanceMax) {
    const location = getLocationDestination(origin, azimuth, distance);
    const altitude = await getAltitude(location);
    const angle = getAngle(highestPoint.altitude, altitude, distance);

    if (angle > highestPoint.angle) {
      highestPoint = {
        latLng: location,
        altitude,
        angle,
        azimuth
      };
    }
    distance += options.distanceTick;
  }
  return highestPoint;
}

function getAngle(fromAltitude: number, toAltitude: number, distance: number): number {
  return radToDeg(Math.atan((toAltitude - fromAltitude) / distance));
}

function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}
