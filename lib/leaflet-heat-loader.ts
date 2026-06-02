import type { Layer } from "leaflet";

type HeatOptions = {
  minOpacity?: number;
  maxZoom?: number;
  max?: number;
  radius?: number;
  blur?: number;
  gradient?: Record<number, string>;
};

type LeafletWithHeat = typeof import("leaflet") & {
  heatLayer(latlngs: [number, number, number?][], options?: HeatOptions): Layer;
};

/** Load leaflet.heat side effect and return typed heatLayer helper. */
export async function loadLeafletHeat(): Promise<{
  L: typeof import("leaflet");
  heatLayer: (
    latlngs: [number, number, number?][],
    options?: HeatOptions,
  ) => Layer;
}> {
  const L = (await import("leaflet")).default;
  await import("leaflet.heat/dist/leaflet-heat.js");
  const heatLayer = (L as LeafletWithHeat).heatLayer.bind(L);
  return { L, heatLayer };
}
