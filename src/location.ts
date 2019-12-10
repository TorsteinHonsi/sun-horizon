import { LatLng } from './types';
import {computeDestinationPoint} from 'geolib';

export function getLocationDestination(from: LatLng, azimuth: number, distance: number): LatLng {
  const location = computeDestinationPoint(from, distance, azimuth);
  return {
    lat: location.latitude,
    lng: location.longitude
  };
}