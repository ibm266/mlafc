import type { MapRegion } from '@/data/types';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { GeoJSON as LeafletGeoJSON, LatLngBounds, Layer } from 'leaflet';

type CountryFeature = Feature<Geometry, { name: string }>;

export const MAP_REGIONS: MapRegion[] = ['All', 'United Kingdom', 'Europe', 'United States', 'India'];

export function regionCountries(region: MapRegion): string[] {
  const map: Record<Exclude<MapRegion, 'All'>, string[]> = {
    'United Kingdom': ['United Kingdom'],
    Europe: ['Belgium', 'France', 'Czechia', 'Germany'],
    'United States': ['United States of America'],
    India: ['India'],
  };

  if (region === 'All') {
    return Object.values(map).flat();
  }
  return map[region] ?? [];
}

export function countryStyle(name: string, region: MapRegion) {
  const lit = region !== 'All' && regionCountries(region).includes(name);
  if (lit) {
    return { fillColor: '#1B3949', fillOpacity: 0.85, color: '#B08D3E', weight: 1.2, opacity: 0.85 };
  }
  const dim = region !== 'All';
  return {
    fillColor: '#122B3A',
    fillOpacity: dim ? 0.35 : 0.55,
    color: '#2A4254',
    weight: 0.6,
    opacity: dim ? 0.5 : 0.8,
  };
}

export function markerStyle(role: string, active: boolean) {
  const base = { radius: active ? 6 : 4, weight: active ? 2 : 1.5, className: 'mlafc-pin' };
  if (role === 'operated') {
    return { ...base, color: active ? '#F7F5F1' : '#B08D3E', fillColor: '#B08D3E', fillOpacity: 1 };
  }
  if (role === 'taught') {
    return { ...base, color: '#D8B15A', fillColor: '#0C1F2B', fillOpacity: active ? 0.9 : 0.5 };
  }
  return { ...base, color: '#8A97A3', fillColor: '#0C1F2B', fillOpacity: active ? 0.9 : 0.5 };
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
