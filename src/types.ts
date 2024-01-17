export interface LatLng {
  lat: number;
  lng: number;
}

export interface HorizonOptions {
  azimuthOptions?: AzimuthOptions;
  highestPointOptions?: HighestPointOptions;
}

export interface AzimuthOptions {
  azimuthStart?: number; // degree, 0 is North, 90 Eeast
  azimuthEnd?: number; // degree
  azimuthTick?: number; // degree
}

export class AzimuthParams {
  azimuthStart: number = 0;
  azimuthEnd: number = 360;
  azimuthTick: number = 1

  constructor(options: AzimuthOptions = {}) {
    if (options.azimuthStart !== undefined) this.azimuthStart = options.azimuthStart;
    if (options.azimuthEnd !== undefined) this.azimuthEnd = options.azimuthEnd;
    if (options.azimuthTick !== undefined) this.azimuthTick = options.azimuthTick;
  }
}

export interface HighestPointOptions {
  distanceMax?: number; // meter
  distanceTick?: number; // meter
  hillTopFactor?: number;
  originElevation?: number; // meter
}

export class HighestPointParams {
  distanceMax: number = 50000;
  distanceTick: number = 50;

  constructor(options: HighestPointOptions = {}) {
    if (options.distanceMax !== undefined) this.distanceMax = options.distanceMax;
    if (options.distanceTick !== undefined) this.distanceTick = options.distanceTick;
  }
}

export interface HillTopPoint {
  angle: number;
  distance: number;
}

export interface HorizonPoint {
  azimuth: number; // degree
  angle: number; // degree, 0 is same elevation as origin
  altitude: number; // meter
  distance: number; // meter
  hillTops: Array<HillTopPoint>;
  latLng?: LatLng;
}

export interface Horizon {
  origin: LatLng;
  elevationProfile: HorizonPoint[];
}

export interface CacheData {
  bytes: number;
  files: number;
}