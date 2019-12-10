import GeoPoint from 'geo-point';
import { LatLng } from './types';

export function getLocationDestination(from: LatLng, azimuth: number, distance: number): LatLng {
  const origin = new GeoPoint(from.lat, from.lng);
  const destination = origin.calculateDestination(distance, azimuth);
  return {
    lat: destination.latitude,
    lng: destination.longitude
  };
}