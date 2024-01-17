import { getLocationDestination } from './location';
import { HighestPointParams, HorizonPoint, LatLng, HighestPointOptions, HillTopPoint } from './types';
import { getTiles } from './cache';

export async function getAltitude(latLng: LatLng): Promise<number> {
  return new Promise((resolve, reject) => {
    getTiles().getElevation(
      [latLng.lat, latLng.lng],
      (err: any, altitude: number) => {
        if (err) reject(err);
        resolve(altitude);
    });
  });
}

export async function highestPointInAzimuth(origin: LatLng, azimuth: number, options: HighestPointOptions = {}): Promise<HorizonPoint> {
  let originAltitude = await getAltitude(origin) + (options.originElevation || 0);
  let highestPoint: HorizonPoint = {
    latLng: origin,
    altitude: originAltitude,
    angle: 0,
    azimuth,
    hillTops: []
  };
  let highestPointDistance = 0;
  const parametes = new HighestPointParams(options);
  const hillTops: Array<HillTopPoint> = [];
  let distance = parametes.distanceTick;
  while (distance <= parametes.distanceMax) {
    const location = getLocationDestination(origin, azimuth, distance);
    const altitude = await getAltitude(location);
    const angle = getAngle(originAltitude, altitude, distance);

    if (angle > highestPoint.angle) {

      // Record previous highestPoint as hill top for visualization
      if (
        options.hillTopFactor &&
        highestPointDistance &&
        // Record as hill top only if there has been a valley between
        highestPointDistance / distance < options.hillTopFactor
      ) {
        hillTops.push({ angle: highestPoint.angle })
      }

      highestPoint = {
        latLng: location,
        altitude,
        angle,
        azimuth,
        hillTops
      };
      highestPointDistance = distance;
    }
    distance += parametes.distanceTick;
  }

  return highestPoint;
}

function getAngle(fromAltitude: number, toAltitude: number, distance: number): number {
  return radToDeg(Math.atan((toAltitude - fromAltitude) / distance));
}

function radToDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

