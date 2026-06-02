"use client";

import { useEffect, useRef } from "react";
import type L from "leaflet";
import { loadLeafletHeat } from "@/lib/leaflet-heat-loader";
import { pickupSpots } from "@/lib/pickup";
import { VISITOR_MAP_BOUNDS, type VisitorGeoPoint } from "@/lib/visitor-geo";
import "./visitor-map.css";
import "leaflet/dist/leaflet.css";

type Props = {
  points: VisitorGeoPoint[];
  cityCounts: { city: string; count: number }[];
  sessionCount: number;
  rangeLabel: string;
};

/** Downtown Oakville — map anchor. */
const MAP_CENTER: [number, number] = [43.4675, -79.6877];

const HEAT_GRADIENT: Record<number, string> = {
  0.12: "#eef2eb",
  0.28: "#c5d4be",
  0.45: "#8fa88a",
  0.62: "#5a7354",
  0.82: "#3d5238",
  1.0: "#2f3a2a",
};

function pickupIconHtml(area: string): string {
  return `<div class="pluk-pickup-pin" title="${area}"><span class="pluk-pickup-pin__ring"></span><span class="pluk-pickup-pin__dot"></span></div>`;
}

function sessionDotHtml(): string {
  return `<div class="pluk-session-dot__inner"></div>`;
}

export function VisitorHeatMap({
  points,
  cityCounts,
  sessionCount,
  rangeLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    (async () => {
      const { L, heatLayer } = await loadLeafletHeat();

      if (cancelled || !containerRef.current) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(container, {
        center: MAP_CENTER,
        zoom: 11,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map);

      if (points.length > 0) {
        const heatData: [number, number, number][] = points.map((p) => [
          p.lat,
          p.lng,
          0.55,
        ]);
        const radius = points.length < 6 ? 36 : points.length < 20 ? 30 : 26;
        heatLayer(heatData, {
          radius,
          blur: 20,
          maxZoom: 15,
          minOpacity: 0.38,
          gradient: HEAT_GRADIENT,
        }).addTo(map);
      }

      for (const p of points) {
        const city = p.city ? ` · ${p.city}` : "";
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            className: "pluk-session-dot",
            html: sessionDotHtml(),
            iconSize: [10, 10],
            iconAnchor: [5, 5],
          }),
          interactive: true,
        })
          .bindPopup(
            `<strong>Approx. browser location</strong><br><span style="color:#6b6b66">One anonymous session${city}</span>`,
          )
          .addTo(map);
      }

      for (const spot of pickupSpots) {
        L.marker([spot.lat, spot.lng], {
          icon: L.divIcon({
            className: "pluk-pickup-marker",
            html: pickupIconHtml(spot.area),
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
          zIndexOffset: 500,
        })
          .bindPopup(
            `<strong>${spot.name}</strong><br>${spot.area}<br><span style="color:#6b6b66">${spot.slot}</span><br><span style="color:#6b6b66;font-size:11px">${spot.address}</span><br><span style="color:#b86f4a;font-size:11px">Sunday pickup spot</span>`,
          )
          .addTo(map);
      }

      const bounds = L.latLngBounds([
        [VISITOR_MAP_BOUNDS.south, VISITOR_MAP_BOUNDS.west],
        [VISITOR_MAP_BOUNDS.north, VISITOR_MAP_BOUNDS.east],
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="border border-line overflow-hidden bg-surface shadow-sm">
        <div
          ref={containerRef}
          className="pluk-visitor-map h-[min(520px,70vh)] w-full min-h-[360px]"
          aria-label="Visitor interest heat map around Oakville"
        />
        <p className="text-[11px] text-muted px-4 py-3 border-t border-line leading-relaxed">
          <span className="pluk-map-legend mb-2 block">
            <span className="pluk-map-legend__item">
              <span className="pluk-map-legend__swatch pluk-map-legend__swatch--heat" />
              Visitor interest (green heat)
            </span>
            <span className="pluk-map-legend__item">
              <span className="pluk-map-legend__swatch pluk-map-legend__swatch--visitor" />
              Session location
            </span>
            <span className="pluk-map-legend__item">
              <span className="pluk-map-legend__swatch pluk-map-legend__swatch--pickup" />
              Sunday pickup spot
            </span>
          </span>
          Oakville &amp; west GTA · approximate IP, one point per session (
          {rangeLabel.toLowerCase()}).
        </p>
      </div>

      <div className="text-sm space-y-4">
        <div className="border border-line p-4">
          <div className="eyebrow mb-1">Sessions with location</div>
          <div className="text-2xl tabular-nums">{points.length}</div>
          {sessionCount > 0 && (
            <p className="text-xs text-muted mt-1">
              {Math.round((points.length / sessionCount) * 100)}% of{" "}
              {sessionCount} tracked sessions
            </p>
          )}
        </div>

        {cityCounts.length > 0 ? (
          <div>
            <div className="eyebrow mb-2">By city</div>
            <ul className="space-y-2 text-sm">
              {cityCounts.slice(0, 8).map((row) => (
                <li
                  key={row.city}
                  className="flex justify-between gap-3 tabular-nums"
                >
                  <span>{row.city}</span>
                  <span className="text-muted">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">
            No geo data in this window yet. Browse the shop on production
            (Vercel) — local dev has no IP headers.
          </p>
        )}
      </div>
    </div>
  );
}
