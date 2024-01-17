export {getAltitude, highestPointInAzimuth} from './altitude';
export {init, getCacheData, cleanCache} from './cache';
export * from './types';

import { highestPointInAzimuth } from './altitude';
import { AzimuthParams, HillTopPoint, Horizon, HorizonOptions, LatLng } from './types';

export async function getHorizon(origin: LatLng, options: HorizonOptions = {}): Promise<Horizon> {
  const horizon: Horizon = {
    elevationProfile: [],
    origin,
    contours: []
  };
  const azimuthParams = new AzimuthParams(options.azimuthOptions);
  let azimuth = azimuthParams.azimuthStart;
  while (azimuth < azimuthParams.azimuthEnd) {
    horizon.elevationProfile.push(
      await highestPointInAzimuth(
        origin,
        azimuth,
        options.highestPointOptions,
        options.contourOptions
      )
    );
    azimuth += azimuthParams.azimuthTick;
  }

  // Assemble the hill top points into contour lines
  if (options.contourOptions?.hillTopFactor) {
    const elevationProfile = horizon.elevationProfile;
    let contourLine: HillTopPoint[] = [],
      lastHillTop: HillTopPoint | undefined,
      nextContourStart: number | undefined;

    for (let i = 0; i < elevationProfile.length; i++) {
      const hillTops = elevationProfile[i].hillTops;
      if (hillTops?.length) {
        let hillTop: HillTopPoint | undefined;
        if (!lastHillTop) {
          hillTop = hillTops[0];
        } else {
          for (let top of hillTops) {
            const factor = lastHillTop.distance / top.distance;
            // Compare against the hillTopFactor
            if (factor > 0.75 && factor < (1 / 0.75)) {
              hillTop = top;
              break;
            }
          }
        }
        if (hillTop) {
          hillTops.splice(hillTops.indexOf(hillTop), 1);
          if (elevationProfile[i].hillTops?.length === 0) {
            delete elevationProfile[i].hillTops;
          }
          contourLine.push(hillTop);

          // If there are still items in this azimuth's array, mark it as
          // the next start
          if (nextContourStart === undefined && hillTops.length) {
            nextContourStart = i;
          }

        // No hill top found to continue the last one - jump back
        } else {

          horizon.contours.push(contourLine); // Gap
          contourLine = [];
          if (typeof nextContourStart === 'number') {
            i = nextContourStart;
            nextContourStart = undefined;
          }
        }
        lastHillTop = hillTop;
      }
    }
  }
  return horizon;
}
