import { highestPointInAzimuth } from './altitude';
import { AzimuthParams, HighestPointParams, Horizon, HorizonOptions, LatLng } from './types';

export function hello(): string {
  return 'Hello horizon!';
}

export async function getHorizon(origin: LatLng, options: HorizonOptions = {}): Promise<Horizon> {
  const horizon: Horizon = {
    elevationProfile: [],
    origin
  };
  const azimuthParams = new AzimuthParams(options.azimuthOptions);
  let azimuth = azimuthParams.azimuthStart;
  while (azimuth < azimuthParams.azimuthEnd) {
    horizon.elevationProfile.push(await highestPointInAzimuth(origin, azimuth, new HighestPointParams(options.highestPointOptions)));
    azimuth += azimuthParams.azimuthTick;
  }
  return horizon;
}
