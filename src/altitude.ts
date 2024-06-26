import { getLocationDestination } from './location';
import { HighestPointParams, HorizonPoint, LatLng, HighestPointOptions, HillTopPoint, ContourOptions } from './types';
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

export async function highestPointInAzimuth(
  origin: LatLng,
  azimuth: number,
  options: HighestPointOptions = {},
  contourOptions: ContourOptions = {}
): Promise<HorizonPoint> {
  let originAltitude = await getAltitude(origin) + (options.originElevation || 0);
  let highestPoint: HorizonPoint = {
    latLng: origin,
    altitude: originAltitude,
    angle: 0,
    azimuth,
    distance: 0,
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
        contourOptions.hillTopFactor &&
        highestPointDistance &&
        // Record as hill top only if there has been a valley between
        highestPointDistance / distance < contourOptions.hillTopFactor
      ) {
        hillTops.push({
          azimuth,
          angle: highestPoint.angle,
          distance: highestPoint.distance
        });
      }

      highestPoint = {
        latLng: location,
        altitude,
        angle,
        azimuth,
        distance,
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

