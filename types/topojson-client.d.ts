declare module 'topojson-client' {
  import type { FeatureCollection } from 'geojson';

  export function feature(
    topology: { objects: Record<string, unknown> },
    object: unknown,
  ): FeatureCollection;
}
