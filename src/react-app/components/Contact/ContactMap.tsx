import { useEffect, useRef, type FC } from "react";
import * as L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";
import "./ContactMap.css";
import { MAP_ATTRIBUTION, PUNE_HEAD_OFFICE } from "../../data/contact";
import { getAssetUrl } from "../../utils";

const INDIA_BOUNDS: L.LatLngBoundsExpression = [
  [6.5, 67.8],
  [37.3, 97.6],
];
const MAX_BOUNDS: L.LatLngBoundsExpression = [
  [1, 58],
  [42, 106],
];

interface IndiaStateProperties {
  readonly NAME_1?: string;
}

function stateStyle(
  feature?: Feature<Geometry, IndiaStateProperties>
): L.PathOptions {
  if (feature?.properties?.NAME_1 === "Maharashtra") {
    return {
      color: "#0c9990",
      weight: 1.25,
      opacity: 0.95,
      fillColor: "#087f78",
      fillOpacity: 0.4,
    };
  }
  return {
    color: "#3a3a3e",
    weight: 0.7,
    opacity: 0.85,
    fillColor: "#101012",
    fillOpacity: 0.68,
  };
}

function buildPopup(): HTMLElement {
  const root = document.createElement("div");
  root.className = "cx-map-popup";

  const eyebrow = document.createElement("span");
  eyebrow.className = "cx-map-popup-eyebrow";
  eyebrow.textContent = "Pune head office";

  const title = document.createElement("strong");
  title.className = "cx-map-popup-title";
  title.textContent = "Aadi Enterprises";

  const address = document.createElement("p");
  address.className = "cx-map-popup-address";
  address.textContent = PUNE_HEAD_OFFICE.address;

  const directions = document.createElement("a");
  directions.className = "cx-map-popup-link";
  directions.href = PUNE_HEAD_OFFICE.directionsUrl;
  directions.target = "_blank";
  directions.rel = "noopener noreferrer";
  directions.textContent = "Get directions";

  root.append(eyebrow, title, address, directions);
  return root;
}

const ContactMap: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const map = L.map(container, {
      center: [PUNE_HEAD_OFFICE.coordinates.lat, PUNE_HEAD_OFFICE.coordinates.lng],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
      preferCanvas: true,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 0.7,
      inertia: !reduceMotion,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
      markerZoomAnimation: !reduceMotion,
    });
    map.fitBounds(INDIA_BOUNDS, { padding: [10, 10] });

    // OpenStreetMap standard tiles, toned to the dark palette in CSS.
    // Free, accurate and keyless; the state outline is our own GeoJSON layer.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: MAP_ATTRIBUTION,
    }).addTo(map);

    const markerIcon = L.divIcon({
      className: "cx-map-marker",
      html: '<span class="cx-map-marker-pulse"></span><span class="cx-map-marker-dot"></span>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -18],
    });

    const marker = L.marker(
      [PUNE_HEAD_OFFICE.coordinates.lat, PUNE_HEAD_OFFICE.coordinates.lng],
      {
        icon: markerIcon,
        alt: "Aadi Enterprises Pune head office",
        title: "Aadi Enterprises Pune head office",
        keyboard: true,
      }
    ).addTo(map);
    marker.bindPopup(buildPopup(), {
      className: "cx-map-popup-shell",
      maxWidth: window.innerWidth < 360 ? 180 : 240,
      autoPanPadding: [10, 10],
      closeButton: false,
      offset: [0, -4],
    });

    const controller = new AbortController();
    fetch(getAssetUrl("data/india-states.geojson"), {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Map data unavailable");
        return response.json() as Promise<
          FeatureCollection<Geometry, IndiaStateProperties>
        >;
      })
      .then((geojson) => {
        L.geoJSON(geojson, {
          style: stateStyle,
          interactive: false,
        }).addTo(map);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        // The dark basemap still renders the correct geography if the
        // optional state overlay cannot load.
      });

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 120);

    return () => {
      controller.abort();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      map.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cx-map-canvas"
      role="region"
      aria-label={`Map showing Aadi Enterprises Pune head office at ${PUNE_HEAD_OFFICE.address}`}
    />
  );
};

export default ContactMap;
