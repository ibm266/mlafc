import type { MapRegion } from '@/data/types';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { GeoJSON as LeafletGeoJSON, LatLngBounds, Layer } from 'leaflet';

type CountryFeature = Feature<Geometry, { name: string }>;

export const MAP_REGIONS: MapRegion[] = ['India', 'United Kingdom', 'Europe', 'United States', 'Asia'];

export function regionCountries(region: MapRegion): string[] {
  const map: Record<MapRegion, string[]> = {
    India: ['India'],
    'United Kingdom': ['United Kingdom'],
    Europe: [
      'Austria',
      'Croatia',
      'Czechia',
      'Denmark',
      'France',
      'Germany',
      'Hungary',
      'Ireland',
      'Israel',
      'Italy',
      'Poland',
      'Portugal',
      'Spain',
      'Switzerland',
      'Turkey',
    ],
    'United States': ['United States of America'],
    Asia: ['Australia', 'China', 'Japan', 'South Korea'],
  };

  return map[region] ?? [];
}

export function countryStyle(name: string, region: MapRegion) {
  const lit = regionCountries(region).includes(name);
  if (lit) {
    return { fillColor: '#1B3949', fillOpacity: 0.85, color: '#B08D3E', weight: 1.2, opacity: 0.85 };
  }
  return {
    fillColor: '#122B3A',
    fillOpacity: 0.35,
    color: '#2A4254',
    weight: 0.6,
    opacity: 0.5,
  };
}

export function markerStyle(role: string, active: boolean) {
  const base = {
    radius: active ? 9 : 7,
    weight: active ? 2.5 : 2,
    className: 'mlafc-pin',
    fillOpacity: 1,
    opacity: 1,
    interactive: true,
    bubblingMouseEvents: true,
  };
  if (role === 'operated') {
    return {
      ...base,
      fillColor: '#B08D3E',
      color: active ? '#F7F5F1' : '#8A6A2E',
    };
  }
  if (role === 'taught') {
    return {
      ...base,
      fillColor: '#F7F5F1',
      color: active ? '#B08D3E' : '#C8C4BC',
    };
  }
  return {
    ...base,
    fillColor: '#5BA4B5',
    color: active ? '#F7F5F1' : '#3E7A88',
  };
}

function ringArea(ring: number[][]): number {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(area);
}

export function countryBounds(
  region: MapRegion,
  countries: LeafletGeoJSON,
  L: typeof import('leaflet'),
): LatLngBounds | null {
  const wanted = regionCountries(region);
  let bounds: LatLngBounds | null = null;

  countries.eachLayer((layer) => {
    const feature = (layer as Layer & { feature?: CountryFeature }).feature;
    if (!feature || wanted.indexOf(feature.properties.name) === -1) return;

    const geom = feature.geometry;
    let rings: number[][][] = [];
    if (geom.type === 'Polygon') rings = [geom.coordinates[0] as number[][]];
    else if (geom.type === 'MultiPolygon') {
      rings = (geom.coordinates as number[][][][]).map((p) => p[0] as number[][]);
    }
    if (!rings.length) return;

    let best = rings[0];
    let bestArea = -1;
    for (const ring of rings) {
      const area = ringArea(ring);
      if (area > bestArea) {
        bestArea = area;
        best = ring;
      }
    }

    const ringBounds = L.latLngBounds(best.map((c) => [c[1], c[0]] as [number, number]));
    bounds = bounds ? bounds.extend(ringBounds) : ringBounds;
  });

  return bounds;
}

export type WorldAtlas = {
  type: 'Topology';
  objects: { countries: { type: string; geometries: unknown[] } };
};

export function countriesGeoJson(world: WorldAtlas, topojson: typeof import('topojson-client')): FeatureCollection {
  return topojson.feature(world, world.objects.countries) as FeatureCollection;
}
