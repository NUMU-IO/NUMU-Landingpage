/**
 * OriginKit — Globe (preset `base`).
 *
 * Retrieved through OriginKit MCP (`get_component globe`, stack vite /
 * tailwind / typescript) on 2026-08-24. VENDOR SOURCE — kept as delivered so
 * it can be re-fetched and diffed. Numueg's configuration lives in
 * `../EarthGlobe.tsx`.
 *
 * Requires `three` and `d3-geo`, both installed.
 *
 * Local deltas, and only these:
 *   • `"use client"` removed — this is a Vite SPA, not Next.js.
 *   • The land-data URL is a `landUrl` prop instead of a hardcoded
 *     raw.githubusercontent.com fetch. The site ships a strict CSP
 *     (`connect-src 'self' https://numueg.app …`), so the upstream fetch is
 *     blocked in production; the data is served from `/ne_50m_land.json`.
 *   • `onReady` / `onError` callbacks, so the wrapper can show the static
 *     fallback the spec requires instead of the component's own English
 *     error text.
 *   • Coastline quality, in the `fill === 'solid'` path only — three small
 *     changes, each marked LOCAL DELTA at the line:
 *       – the fill texture is built at the land mask's own 2048x1024 rather
 *         than a fixed 1024x512, so it is a 1:1 copy of a bitmap the
 *         component has already rasterised instead of a halved resample;
 *       – it reads that mask's coverage value as alpha instead of
 *         thresholding it at >128, which keeps the antialiased edge canvas
 *         2D drew and then threw away;
 *       – the texture gets max anisotropy, without which the land smears
 *         into stripes across the limb.
 *     Together these are what took the planet from visibly stair-stepped
 *     coastlines to smooth ones. Nothing outside `fill === 'solid'` is
 *     touched — the dots path still uses the original `isOnLand` predicate.
 *   • An optional `cityLights` prop, again only in the `fill === 'solid'`
 *     path. It sprinkles seeded warm points over land into the same canvas
 *     the land is drawn on. This has to live here rather than in the wrapper
 *     for one reason: the lights must rotate with the planet, and only the
 *     sphere's own texture does that. Off by default, so the component
 *     behaves exactly as delivered unless asked.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  Color,
  Mesh,
  Group,
  InstancedMesh,
  Matrix4,
  Raycaster,
  Vector2,
  TubeGeometry,
  CatmullRomCurve3,
  Vector3,
  CanvasTexture,
} from 'three';
import { geoEquirectangular, geoPath } from 'd3-geo';

type Rgba = { r: number; g: number; b: number; a: number };

function parseColorToRgba(input: string): Rgba {
  if (!input || input.trim() === '') return { r: 0, g: 0, b: 0, a: 0 };
  const str = input.trim();
  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
  );
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
    const a = rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1;
    return { r, g, b, a };
  }
  const hex = str.replace(/^#/, '');
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    };
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
  if (ui === 0) return 0;
  return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0, 0.9);
}
function mapDensityUiToSpacing(ui: number): number {
  return mapLinear(Math.max(1, Math.min(10, ui)), 1, 10, 24, 8);
}
function mapScaleUiToMultiplier(ui: number): number {
  return mapLinear(Math.max(1, Math.min(20, ui)), 1, 20, 0.2, 2);
}
function mapDotSizeUiToMultiplier(ui: number): number {
  return mapLinear(Math.max(1, Math.min(10, ui)), 1, 10, 0.1, 0.5);
}
function mapMarkerDotSizeUiToMultiplier(ui: number): number {
  return mapLinear(Math.max(0, Math.min(100, ui)), 0, 100, 0.1, 2.5);
}
function normalizeSmoothing(ui: number): number {
  return Math.max(0, Math.min(1, ui / 10));
}
function mapDragSpeedUiToSensitivity(ui: number): number {
  return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0.001, 0.02);
}
function mapDetailToStepSize(ui: number): number {
  return mapLinear(Math.max(1, Math.min(10, ui)), 1, 10, 10, 1);
}

function simplifyRing(ring: number[][], detail: number): number[][] {
  if (ring.length < 2) return ring;
  if (detail >= 10) return ring;
  const stepSize = Math.max(1, Math.floor(mapDetailToStepSize(detail)));
  const simplified: number[][] = [];
  simplified.push(ring[0]);
  for (let i = stepSize; i < ring.length - 1; i += stepSize) {
    simplified.push(ring[Math.min(i, ring.length - 1)]);
  }
  const lastPoint = ring[ring.length - 1];
  const firstPoint = ring[0];
  const isClosed =
    Math.abs(lastPoint[0] - firstPoint[0]) < 1e-4 && Math.abs(lastPoint[1] - firstPoint[1]) < 1e-4;
  if (!isClosed) simplified.push(lastPoint);
  return simplified.length >= 2 ? simplified : ring;
}

function latLngToPosition(lat: number, lng: number): { x: number; y: number; z: number } {
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);
  return {
    x: Math.cos(latRad) * Math.sin(lngRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lngRad),
  };
}

interface Marker {
  lat: number;
  lng: number;
}
interface MarkerConfig {
  markers: Marker[];
  color: string;
  size: number;
}
interface DotsConfig {
  color: string;
  size: number;
  density: number;
  allDots: boolean;
}
export interface GlobeProps {
  speed?: number;
  smoothing?: number;
  dots?: DotsConfig;
  fill?: 'dots' | 'solid';
  fillColor?: string;
  scale?: number;
  stopOnHover?: boolean;
  markerConfig?: MarkerConfig;
  direction?: 'left' | 'right';
  initialLatitude?: number;
  initialLongitude?: number;
  oceanColor?: string;
  outlineColor?: string;
  showOutline?: boolean;
  graticuleColor?: string;
  showGrid?: boolean;
  outlineWidth?: number;
  dragSpeed?: number;
  detail?: number;
  /**
   * LOCAL DELTA — city lights. When set (and `fill` is `solid`), warm points
   * are sprinkled over land into the same texture, so they rotate with the
   * sphere the way an overlay never could. See the header note.
   */
  cityLights?: { color: string; count: number; size: number } | null;
  /** Local delta — land GeoJSON URL, so the CSP-blocked upstream fetch is avoidable. */
  landUrl?: string;
  /** Local delta — fired once the globe has drawn. */
  onReady?: () => void;
  /** Local delta — fired if the land data or WebGL fails. */
  onError?: () => void;
  style?: CSSProperties;
}

export default function OriginKitGlobe({
  speed = 2,
  smoothing = 8,
  dots = { color: '#ffffff', size: 5, density: 8, allDots: false },
  fill = 'dots',
  fillColor = '#ffffff',
  scale = 8,
  stopOnHover = true,
  markerConfig = { markers: [], color: '#00f7ff', size: 40 },
  direction = 'left',
  initialLatitude = 23,
  initialLongitude = -23,
  oceanColor = '#000000',
  outlineColor = '#ffffff',
  showOutline = true,
  graticuleColor = '#D4D4D4',
  showGrid = true,
  outlineWidth = 1,
  dragSpeed = 5,
  detail = 5,
  cityLights = null,
  landUrl = '/ne_50m_land.json',
  onReady,
  onError,
  style,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dotColor = dots.color;
  const dotSize = dots.size;
  const density = dots.density;
  const allDots = dots.allDots;
  const gridWidth = 1;
  const smoothingN = normalizeSmoothing(smoothing);

  const baseRotationSpeed = mapSpeedUiToInternal(speed);
  const rotationSpeed = direction === 'left' ? -baseRotationSpeed : baseRotationSpeed;
  const dotSpacing = mapDensityUiToSpacing(density);
  const dotSizeMultiplier = mapDotSizeUiToMultiplier(dotSize);
  const markerRadiusMultiplier = mapMarkerDotSizeUiToMultiplier(markerConfig.size);
  const scaleMultiplier = mapScaleUiToMultiplier(scale);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth || container.offsetWidth || 800;
    const containerHeight = container.clientHeight || container.offsetHeight || 600;

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1e3);
    const baseRadius = 1;
    const globeRadius = baseRadius * scaleMultiplier;
    const cameraDistance = 2.5 / scaleMultiplier;
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onError?.();
      setError('WebGL unavailable');
      return;
    }
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = 'srgb';
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.opacity = '0';
    canvas.style.visibility = 'hidden';
    container.appendChild(canvas);

    const oceanRgba = parseColorToRgba(oceanColor);
    const outlineRgba = parseColorToRgba(outlineColor);
    const dotRgba = parseColorToRgba(dotColor);
    const graticuleRgba = parseColorToRgba(graticuleColor);
    const fillRgba = parseColorToRgba(fillColor);

    const oceanGeometry = new SphereGeometry(globeRadius, 64, 64);
    const oceanMaterial = new MeshBasicMaterial({
      color: oceanColor ? new Color(oceanColor) : new Color(0, 0, 0),
      transparent: oceanRgba.a < 1 || oceanRgba.a === 0,
      opacity: oceanRgba.a,
    });
    const oceanMesh = new Mesh(oceanGeometry, oceanMaterial);

    const continentOutlineGroup = new Group();
    const graticuleGroup = new Group();

    if (showGrid && graticuleColor && graticuleRgba.a > 0) {
      const graticuleMaterial = new MeshBasicMaterial({
        color: new Color(graticuleColor),
        transparent: graticuleRgba.a < 1 || graticuleRgba.a === 0,
        opacity: graticuleRgba.a,
      });
      const gridSpacing = 15;
      const addTube = (positions: number[]) => {
        if (!positions || positions.length < 6) return;
        const points: Vector3[] = [];
        for (let i = 0; i < positions.length; i += 3) {
          points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
        }
        if (points.length < 2) return;
        const curve = new CatmullRomCurve3(points);
        const tubeGeometry = new TubeGeometry(curve, points.length * 2, (gridWidth / 10) * 0.01, 8, false);
        const tubeMesh = new Mesh(tubeGeometry, graticuleMaterial);
        tubeMesh.renderOrder = 0;
        graticuleGroup.add(tubeMesh);
      };
      for (let lat = -90; lat <= 90; lat += gridSpacing) {
        const positions: number[] = [];
        for (let i = 0; i <= 64; i++) {
          const lng = (i / 64) * 360 - 180;
          const pos = latLngToPosition(lat, lng);
          positions.push(pos.x * globeRadius, pos.y * globeRadius, pos.z * globeRadius);
        }
        addTube(positions);
      }
      for (let lng = -180; lng < 180; lng += gridSpacing) {
        const positions: number[] = [];
        for (let i = 0; i <= 64; i++) {
          const lat = (i / 64) * 180 - 90;
          const pos = latLngToPosition(lat, lng);
          positions.push(pos.x * globeRadius, pos.y * globeRadius, pos.z * globeRadius);
        }
        addTube(positions);
      }
    }

    let dotInstances: InstancedMesh | Mesh | null = null;
    let markerMeshes: Mesh[] = [];

    const globeGroup = new Group();

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(landUrl);
        if (!response.ok) throw new Error('Failed to load land data');
        const landFeatures = await response.json();

        while (continentOutlineGroup.children.length > 0) {
          continentOutlineGroup.remove(continentOutlineGroup.children[0]);
        }
        if (showOutline && outlineColor && outlineRgba.a > 0) {
          const outlineMaterial = new MeshBasicMaterial({
            color: new Color(outlineColor),
            transparent: outlineRgba.a < 1,
            opacity: outlineRgba.a,
            depthTest: true,
            depthWrite: true,
          });
          const projection = geoEquirectangular();
          const pathGenerator = geoPath().projection(projection);
          landFeatures.features.forEach((feature: any) => {
            const featureType = feature.properties?.featurecla || feature.properties?.type || '';
            const featureName = feature.properties?.name || '';
            const lowered = (featureType + ' ' + featureName).toLowerCase();
            if (lowered.includes('graticule') || lowered.includes('grid') || lowered.includes('line')) return;
            if (!pathGenerator(feature)) return;
            const geometry = feature.geometry;
            if (!geometry || !geometry.coordinates) return;

            const processRing = (ring: number[][]) => {
              if (ring.length < 2) return;
              const simplifiedRing = simplifyRing(ring, detail);
              const positions: number[] = [];
              simplifiedRing.forEach((coord) => {
                const pos = latLngToPosition(coord[1], coord[0]);
                positions.push(pos.x * globeRadius, pos.y * globeRadius, pos.z * globeRadius);
              });
              if (positions.length < 6) return;
              const points: Vector3[] = [];
              for (let i = 0; i < positions.length; i += 3) {
                points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
              }
              if (points.length > 0 && points[0].distanceTo(points[points.length - 1]) > 0.001) {
                points.push(points[0].clone());
              }
              if (points.length < 2) return;
              const curve = new CatmullRomCurve3(points);
              const tubeGeometry = new TubeGeometry(curve, points.length * 2, (outlineWidth / 10) * 0.01, 8, false);
              const tubeMesh = new Mesh(tubeGeometry, outlineMaterial);
              tubeMesh.renderOrder = 0;
              continentOutlineGroup.add(tubeMesh);
            };

            if (geometry.type === 'Polygon' && geometry.coordinates.length > 0) {
              processRing(geometry.coordinates[0]);
            } else if (geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach((polygon: any) => {
                if (polygon.length > 0) processRing(polygon[0]);
              });
            }
          });
        }

        const bitmapWidth = 2048;
        const bitmapHeight = 1024;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = bitmapWidth;
        offscreenCanvas.height = bitmapHeight;
        const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas not supported');
        const projection = geoEquirectangular().fitSize([bitmapWidth, bitmapHeight], { type: 'Sphere' } as any);
        const pathGenerator = geoPath().projection(projection).context(ctx as any);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        landFeatures.features.forEach((feature: any) => pathGenerator(feature));
        ctx.fill();
        const pixels = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight).data;
        /* LOCAL DELTA — see the header note, "Coastline quality".
           The mask above is drawn by canvas 2D, so `pixels` already holds an
           antialiased coverage value per texel, 0-255. `isOnLand` throws that
           away at a hard threshold; `landCoverage` returns it, so the solid
           fill can keep the smooth edge. `isOnLand` is unchanged, because the
           dots path below wants a yes/no answer. */
        const landCoverage = (lng: number, lat: number) => {
          const x = Math.round(((lng + 180) / 360) * bitmapWidth) % bitmapWidth;
          const y = Math.round(((90 - lat) / 180) * bitmapHeight);
          const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
          return pixels[(clampedY * bitmapWidth + x) * 4];
        };
        const isOnLand = (lng: number, lat: number) => {
          const x = Math.round(((lng + 180) / 360) * bitmapWidth) % bitmapWidth;
          const y = Math.round(((90 - lat) / 180) * bitmapHeight);
          const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
          return pixels[(clampedY * bitmapWidth + x) * 4] > 128;
        };

        if (fill === 'solid') {
          /* LOCAL DELTA — see the header note, "Coastline quality".
             Was a fixed 1024x512, i.e. half the mask's resolution, so every
             coastline was resampled down before it ever reached the GPU.
             Matching the mask makes it a 1:1 copy: no resampling, and the
             loop below reads texels it already has. */
          const texW = bitmapWidth;
          const texH = bitmapHeight;
          const fillCanvas = document.createElement('canvas');
          fillCanvas.width = texW;
          fillCanvas.height = texH;
          const fctx = fillCanvas.getContext('2d')!;
          const img = fctx.createImageData(texW, texH);
          const data = img.data;
          const fr = Math.round(fillRgba.r * 255);
          const fg = Math.round(fillRgba.g * 255);
          const fb = Math.round(fillRgba.b * 255);
          const fa = Math.round((fillRgba.a || 1) * 255);
          for (let ty = 0; ty < texH; ty++) {
            for (let tx = 0; tx < texW; tx++) {
              let lng = (tx / texW - 0.25) * 360;
              lng = ((((lng + 180) % 360) + 360) % 360) - 180;
              const lat = (ty / texH - 0.5) * 180;
              const idx = (ty * texW + tx) * 4;
              // LOCAL DELTA: coverage, not a boolean — keeps the antialiased edge.
              const coverage = allDots ? 255 : landCoverage(lng, lat);
              if (coverage > 0) {
                data[idx] = fr;
                data[idx + 1] = fg;
                data[idx + 2] = fb;
                data[idx + 3] = Math.round((fa * coverage) / 255);
              } else {
                data[idx + 3] = 0;
              }
            }
          }
          fctx.putImageData(img, 0, 0);

          /* LOCAL DELTA — city lights.
             Drawn with 2D canvas ops rather than per-pixel: a radial gradient
             per point gives the soft bloom for free, and `lighter` lets
             overlapping points build into the bright clusters real conurbations
             make. The PRNG is seeded, so the pattern is identical on every load
             and between server and client.
             Points are rejected above 65 degrees: equirectangular hugely
             oversamples the poles, and Antarctica does not glow. */
          if (cityLights && cityLights.count > 0) {
            let seed = 987654321;
            const rnd = () => {
              seed = (seed * 1664525 + 1013904223) % 4294967296;
              return seed / 4294967296;
            };
            fctx.globalCompositeOperation = 'lighter';
            const onLandAt = (tx: number, ty: number) => {
              let lng = (tx / texW - 0.25) * 360;
              lng = ((((lng + 180) % 360) + 360) % 360) - 180;
              const lat = (ty / texH - 0.5) * 180;
              if (Math.abs(lat) > 65) return false;
              return landCoverage(lng, lat) >= 200;
            };
            const spot = (tx: number, ty: number, scale: number, alpha: number) => {
              const r = cityLights.size * scale;
              const g = fctx.createRadialGradient(tx, ty, 0, tx, ty, r);
              g.addColorStop(0, cityLights.color);
              g.addColorStop(0.3, cityLights.color);
              g.addColorStop(1, 'rgba(0,0,0,0)');
              fctx.fillStyle = g;
              fctx.globalAlpha = alpha;
              fctx.beginPath();
              fctx.arc(tx, ty, r, 0, Math.PI * 2);
              fctx.fill();
            };
            /* Clustered, not uniform. Scattering points evenly over land gave
               a polka-dot planet; real light is conurbations with dark space
               between them. Each seed becomes a small cluster, which is what
               produces the bright knots the reference has. */
            const CLUSTER = 6;
            const seeds = Math.max(1, Math.round(cityLights.count / CLUSTER));
            let placed = 0;
            let guard = 0;
            while (placed < seeds && guard < seeds * 80) {
              guard++;
              const tx = Math.floor(rnd() * texW);
              const ty = Math.floor(rnd() * texH);
              if (!onLandAt(tx, ty)) continue;
              spot(tx, ty, 0.75 + rnd() * 0.7, 0.4 + rnd() * 0.45);
              const members = 2 + Math.floor(rnd() * (CLUSTER - 1));
              for (let m = 0; m < members; m++) {
                const spread = cityLights.size * (2.5 + rnd() * 7);
                const ang = rnd() * Math.PI * 2;
                const mx = Math.round(tx + Math.cos(ang) * spread);
                const my = Math.round(ty + Math.sin(ang) * spread);
                if (mx < 0 || mx >= texW || my < 0 || my >= texH) continue;
                if (!onLandAt(mx, my)) continue;
                spot(mx, my, 0.45 + rnd() * 0.5, 0.22 + rnd() * 0.4);
              }
              placed++;
            }
            fctx.globalAlpha = 1;
            fctx.globalCompositeOperation = 'source-over';
          }

          const fillTexture = new CanvasTexture(fillCanvas);
          fillTexture.flipY = false;
          // LOCAL DELTA: without anisotropy the land smears into stripes where
          // the texture is near-edge-on, which is most of the visible limb.
          fillTexture.anisotropy = renderer.capabilities?.getMaxAnisotropy?.() ?? 1;
          fillTexture.needsUpdate = true;
          dotInstances = new Mesh(
            new SphereGeometry(globeRadius * 1.002, 64, 64),
            new MeshBasicMaterial({ map: fillTexture, transparent: true }),
          );
          globeGroup.add(dotInstances);
        } else {
          const dotCoordinates: number[][] = [];
          const baseStep = dotSpacing * 0.08;
          for (let lat = -90; lat <= 90; lat += baseStep) {
            const cosLat = Math.cos((Math.abs(lat) * Math.PI) / 180);
            const lngStep = cosLat > 0.01 ? baseStep / Math.max(0.3, cosLat) : 360;
            for (let lng = -180; lng < 180; lng += lngStep) {
              if (allDots || isOnLand(lng, lat)) dotCoordinates.push([lng, lat]);
            }
          }
          if (dotCoordinates.length > 0) {
            const dotGeometry = new SphereGeometry(0.01 * dotSizeMultiplier, 4, 4);
            const dotMaterial = new MeshBasicMaterial({
              color: dotColor ? new Color(dotColor) : new Color(0.6, 0.6, 0.6),
              transparent: dotRgba.a < 1 || dotRgba.a === 0,
              opacity: dotRgba.a,
            });
            const instanced = new InstancedMesh(dotGeometry, dotMaterial, dotCoordinates.length);
            const matrix = new Matrix4();
            for (let i = 0; i < dotCoordinates.length; i++) {
              const pos = latLngToPosition(dotCoordinates[i][1], dotCoordinates[i][0]);
              matrix.makeScale(1, 1, 1);
              matrix.setPosition(pos.x * globeRadius, pos.y * globeRadius, pos.z * globeRadius);
              instanced.setMatrixAt(i, matrix);
            }
            instanced.instanceMatrix.needsUpdate = true;
            dotInstances = instanced;
            globeGroup.add(dotInstances);
          }
        }

        updateMarkers();
        renderer.render(scene, camera);
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
        setIsLoading(false);
        onReady?.();
      } catch {
        setError('Failed to load land map data');
        setIsLoading(false);
        onError?.();
      }
    };

    const updateMarkers = () => {
      markerMeshes.forEach((mesh) => globeGroup.remove(mesh));
      markerMeshes = [];
      if (markerConfig.markers && markerConfig.markers.length > 0) {
        const markerGeometry = new SphereGeometry(0.01 * markerRadiusMultiplier, 16, 16);
        const markerMaterial = new MeshBasicMaterial({
          color: markerConfig.color ? new Color(markerConfig.color) : new Color(1, 1, 1),
        });
        markerConfig.markers.forEach((marker) => {
          if (!marker || typeof marker.lat !== 'number' || typeof marker.lng !== 'number') return;
          const pos = latLngToPosition(marker.lat, marker.lng);
          const markerMesh = new Mesh(markerGeometry, markerMaterial.clone());
          markerMesh.position.set(pos.x * globeRadius, pos.y * globeRadius, pos.z * globeRadius);
          globeGroup.add(markerMesh);
          markerMeshes.push(markerMesh);
        });
      }
    };

    const initialLongitudeRad = (initialLongitude * Math.PI) / 180;
    const initialLatitudeRad = (initialLatitude * Math.PI) / 180;
    const rotation = { x: initialLongitudeRad, y: initialLatitudeRad };
    const targetRotation = { x: initialLongitudeRad, y: initialLatitudeRad };
    const velocity = { x: 0, y: 0 };
    let isDragging = false;
    let isHovering = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrameId: number | null = null;
    const lerpFactor = smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
    const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

    globeGroup.rotation.y = initialLongitudeRad;
    globeGroup.rotation.x = initialLatitudeRad;
    scene.add(globeGroup);
    globeGroup.add(oceanMesh);
    if (showGrid && graticuleColor && graticuleRgba.a > 0) globeGroup.add(graticuleGroup);
    globeGroup.add(continentOutlineGroup);

    const animate = () => {
      let needsRender = false;
      const threshold = 0.01;
      if (!isDragging && rotationSpeed !== 0 && (!stopOnHover || !isHovering)) {
        targetRotation.x += rotationSpeed * 0.01;
      }
      if (!isDragging && smoothingN > 0) {
        if (Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold) {
          targetRotation.x += velocity.x;
          targetRotation.y += velocity.y;
          targetRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.y));
          velocity.x *= velocityDecay;
          velocity.y *= velocityDecay;
        } else {
          velocity.x = 0;
          velocity.y = 0;
        }
      }
      const dx = targetRotation.x - rotation.x;
      const dy = targetRotation.y - rotation.y;
      if (Math.abs(dx) > threshold || Math.abs(dy) > threshold || rotationSpeed !== 0 || isDragging) {
        rotation.x += dx * lerpFactor;
        rotation.y += dy * lerpFactor;
        rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y));
        needsRender = true;
      }
      if (needsRender || rotationSpeed !== 0 || isDragging) {
        globeGroup.rotation.y = rotation.x;
        globeGroup.rotation.x = rotation.y;
        renderer.render(scene, camera);
      }
      const hasVelocity = Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold;
      const hasLerpDelta = Math.abs(dx) > threshold || Math.abs(dy) > threshold;
      if (isDragging || rotationSpeed !== 0 || hasVelocity || hasLerpDelta) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    };

    const startAnimation = () => {
      if (animationFrameId === null) animationFrameId = requestAnimationFrame(animate);
    };
    if (rotationSpeed !== 0) startAnimation();

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      velocity.x = 0;
      velocity.y = 0;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      startAnimation();
      const handleMouseMoveDrag = (moveEvent: MouseEvent) => {
        const sensitivity = mapDragSpeedUiToSensitivity(dragSpeed);
        const dxm = moveEvent.clientX - lastMouseX;
        const dym = moveEvent.clientY - lastMouseY;
        targetRotation.x += dxm * sensitivity;
        targetRotation.y += dym * sensitivity;
        targetRotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.y));
        velocity.x = dxm * sensitivity * 0.3;
        velocity.y = dym * sensitivity * 0.3;
        lastMouseX = moveEvent.clientX;
        lastMouseY = moveEvent.clientY;
      };
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMoveDrag);
        document.removeEventListener('mouseup', handleMouseUp);
        isDragging = false;
      };
      document.addEventListener('mousemove', handleMouseMoveDrag);
      document.addEventListener('mouseup', handleMouseUp);
    };
    canvas.addEventListener('mousedown', handleMouseDown);

    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const handleMouseMove = (event: MouseEvent) => {
      if (!stopOnHover) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      isHovering = raycaster.intersectObject(oceanMesh).length > 0;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = container.clientWidth || container.offsetWidth || 800;
      const newHeight = container.clientHeight || container.offsetHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      camera.position.set(0, 0, 2.5 / scaleMultiplier);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    loadWorldData();

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    speed, smoothing, fill, fillColor, allDots, density, dotSize, dotColor, scale,
    stopOnHover, direction, initialLatitude, initialLongitude, oceanColor, outlineColor,
    showOutline, graticuleColor, showGrid, outlineWidth, dragSpeed, detail, landUrl, cityLights,
    rotationSpeed, dotSpacing, dotSizeMultiplier, markerRadiusMultiplier, scaleMultiplier,
  ]);

  const containerStyle: CSSProperties = {
    ...style,
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Local delta: the wrapper renders the approved fallback, so this stays empty
  // rather than showing the component's own English error text.
  if (error) return <div style={containerStyle} />;

  return <div ref={containerRef} style={containerStyle} />;
}
