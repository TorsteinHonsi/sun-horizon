import { expect } from 'chai';
import { getAltitude, highestPointInAzimuth } from "../src/altitude";
import { getLocationDestination } from "../src/location";
import { HighestPointParams, LatLng } from '../src/types';
import { getCacheData, cleanCache, init } from '../src/cache';
import { getHorizon } from '../src';

const grenoble = {name: 'Grenoble', lat: 45.185739, lng: 5.736236, altitude: 218}; // grenoble;
const chamonix = {name: 'Chamonix', lat: 45.923592, lng: 6.870126, altitude: 1035}; // chamonix

init();

describe('getLocationDestination', () => {
  it ('East', () => {
    const location = getLocationDestination(grenoble, 90, 15000);
    expect(errorPercentLatLng(location, {lat: 45.185739, lng: 5.927671})).to.be.below(0.0001);
  });
  it ('North', () => {
    const location = getLocationDestination(grenoble, 0, 20000);
    expect(errorPercentLatLng(location, {lat: 45.365603, lng: 5.736236})).to.be.below(0.0001);
  });
});

describe('getAltitude', () => {
  const points = [
    {name: 'Col du galibier', lat: 45.064116, lng: 6.407821, altitude: 2642}, // galibier
    chamonix,
    grenoble
  ];

  for (const p of points) {
    it(`${p.name}: ${p.altitude}m`, async () => {
        const altitude = await getAltitude(p);
        expect(errorPercent(altitude, p.altitude)).to.be.below(0.02);
      });
    }
});

describe('highestPointInAzimuth', () => {
  it ('North (⛰  Chartreuse) [1200, 1500]', async () => {
    const highest = await highestPointInAzimuth(grenoble, 0, new HighestPointParams());
    expect(highest.altitude).to.be.above(1200);
    expect(highest.altitude).to.be.below(1500);
  });
  it ('East (🏔  Belledonne) [2300, 3000]', async () => {
    const highest = await highestPointInAzimuth(grenoble, 90, new HighestPointParams());
    expect(highest.altitude).to.be.above(2300);
    expect(highest.altitude).to.be.below(3000);
  });
  it ('West (⛰  Vercors) [1200, 1500]', async () => {
    const highest = await highestPointInAzimuth(grenoble, 180, new HighestPointParams());
    expect(highest.altitude).to.be.above(1200);
    expect(highest.altitude).to.be.below(1500);
  });
  it ('Grenoble [200, 250]', async () => {
    const highest = await highestPointInAzimuth(grenoble, 180, new HighestPointParams({
      distanceMax: 50,
      distanceTick: 10
    }));
    expect(highest.altitude).to.be.above(200);
    expect(highest.altitude).to.be.below(250);
  });
});

describe('getHorizon', () => {
  it ('Grenoble', async () => {
    const horizon = await getHorizon(grenoble);
    expect(horizon.elevationProfile.length).equal(360);

    const altitudes = horizon.elevationProfile.map(p => p.altitude);

    expect(Math.min(...altitudes)).to.be.within(300, 400);
    expect(Math.max(...altitudes)).to.be.within(3200, 3500);
  });

  it ('Chamonix', async () => {
    const horizon = await getHorizon(chamonix);
    expect(horizon.elevationProfile.length).equal(360);

    const altitudes = horizon.elevationProfile.map(p => p.altitude);

    expect(Math.min(...altitudes)).to.be.within(1400, 1500);
    expect(Math.max(...altitudes)).to.be.within(3800, 4500);
  });
});

describe('cache', () => {
  it ('getCacheData', async () => {
    await getAltitude(grenoble);
    const cacheData = await getCacheData();
    expect(cacheData.files).to.be.above(1);
    expect(cacheData.bytes).to.be.above(cacheData.files * 2800000);
  });

  it ('clean cache not empty', async () => {
    await getAltitude(grenoble);
    expect(await cleanCache()).to.have.above(2);
  });

  it ('clean empty cache', async () => {
    await cleanCache();
    expect(await cleanCache()).equals(0);
  });
});



function errorPercentLatLng(v1: LatLng, v2: LatLng): number {
  return Math.max(errorPercent(v1.lat, v2.lat), errorPercent(v1.lng, v2.lng))
}

function errorPercent(v1: number, v2: number): number {
  return Math.abs(v1 - v2) / Math.max(v1, v2);
}