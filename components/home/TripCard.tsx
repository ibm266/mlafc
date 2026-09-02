'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Reveal } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';
import { INDIA_GEOMETRY, projectToMap } from '@/components/map/mapGeometry';
import linksJson from '@/data/links.json';
import { useReveal } from '@/lib/useReveal';
import type { SiteLinks, Trip, TripCity, TripFeature } from '@/data/types';

const links = linksJson as SiteLinks;

/** Frames the whole outline (x 24 to 376, y 111 to 488) with a little margin. */
const MAP_VIEWBOX = '10 96 380 410';
/** How long the line takes to travel the whole route, once. */
const DRAW_MS = 3200;
/** How long a stop holds before the card moves itself on, until a visitor takes over. */
const ADVANCE_MS = 4000;
/** Sideways bulge on each leg, as a fraction of the leg's own length. */
const CURVE = 0.13;
/** Big enough to stay legible when the map is only 319px wide on a phone. */
const LABEL_FONT_SIZE = 11.5;
/** Keeps a label inside the viewBox rather than running off the edge. */
const LABEL_MIN_X = 12;
const LABEL_MAX_X = 388;

const SEAL_BOX = 168;
const SEAL_CENTRE = SEAL_BOX / 2;
const SEAL_RING_RADIUS = 76;
const SEAL_TEXT_RADIUS = 63;
const SEAL_CIRCUMFERENCE = Math.round(2 * Math.PI * SEAL_TEXT_RADIUS);
/**
 * Larger than the full-size seal on /conditions: this copy renders at 84px,
 * half the viewBox, so the legend needs the extra size to stay readable.
 */
const SEAL_FONT_SIZE = 15;
/** Rough advance of one uppercase character at that size, tracking included. */
const SEAL_CHAR_WIDTH = SEAL_FONT_SIZE * 0.72;

type Point = { x: number; y: number };

const round = (n: number) => Math.round(n * 100) / 100;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * One leg as a quadratic curve. The control point sits off the midpoint,
 * perpendicular to the leg, and the side alternates so that legs sharing a
 * city (Hyderabad to Chennai, Bengaluru to Chennai, Chennai to Mumbai) stay
 * apart rather than stacking on one another.
 */
function legPath(from: Point, to: Point, side: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const bulge = length * CURVE * side;
  const cx = (from.x + to.x) / 2 - (dy / length) * bulge;
  const cy = (from.y + to.y) / 2 + (dx / length) * bulge;
  return `Q ${round(cx)} ${round(cy)} ${to.x} ${to.y}`;
}

/**
 * Where a city's label sits relative to its pin, so no label crosses the route,
 * nudged back inside the viewBox when the name would otherwise run off it.
 */
function labelPlacement(city: TripCity, point: Point) {
  const anchor: 'start' | 'middle' | 'end' =
    city.labelSide === 'left' ? 'end' : city.labelSide === 'top' || city.labelSide === 'bottom' ? 'middle' : 'start';

  let x = point.x + (anchor === 'end' ? -9 : anchor === 'start' ? 9 : 0);
  let y = point.y + 3.5;
  if (city.labelSide === 'top') y = point.y - 10;
  if (city.labelSide === 'bottom') y = point.y + 16;

  // Roughly how wide the name renders, letter spacing included.
  const width = city.name.length * LABEL_FONT_SIZE * 0.74;
  const left = x - (anchor === 'end' ? width : anchor === 'middle' ? width / 2 : 0);
  const right = x + (anchor === 'start' ? width : anchor === 'middle' ? width / 2 : 0);
  if (left < LABEL_MIN_X) x += LABEL_MIN_X - left;
  else if (right > LABEL_MAX_X) x -= right - LABEL_MAX_X;

  return { x: round(x), y: round(y), anchor };
}

/**
 * The stamp, repeated as many whole times as the ring will hold. `textLength`
 * then spreads it over the exact circumference, so the legend closes the
 * circle whatever the stamp says and however the font measures.
 */
function sealLegend(stamp: string): string {
  const unit = `${stamp.toUpperCase()} · `;
  const repeats = Math.max(1, Math.floor(SEAL_CIRCUMFERENCE / (unit.length * SEAL_CHAR_WIDTH)));
  return unit.repeat(repeats);
}

/**
 * The turning stamp: the legend rotates, the ECG beat inside it stays put.
 * A small copy of the seal on the full case study, kept here rather than
 * shared so the two can be sized and tuned apart. The ring path carries the
 * trip id so the two ids never collide when both are on a page.
 */
function TripSeal({ feature, tripId }: { feature: TripFeature; tripId: string }) {
  const pathId = `${tripId}-seal-ring`;

  return (
    <svg
      viewBox={`0 0 ${SEAL_BOX} ${SEAL_BOX}`}
      role="img"
      aria-label={`${feature.stamp}, ${feature.eyebrow}`}
      className="block h-[72px] w-[72px] md:h-[84px] md:w-[84px]"
    >
      <g className="seal-turn">
        <circle
          cx={SEAL_CENTRE}
          cy={SEAL_CENTRE}
          r={SEAL_RING_RADIUS}
          fill="none"
          stroke="#B08D3E"
          strokeOpacity="0.7"
          strokeWidth="1.2"
        />
        <path
          id={pathId}
          fill="none"
          d={`M ${SEAL_CENTRE} ${SEAL_CENTRE - SEAL_TEXT_RADIUS} a ${SEAL_TEXT_RADIUS} ${SEAL_TEXT_RADIUS} 0 1 1 0 ${
            SEAL_TEXT_RADIUS * 2
          } a ${SEAL_TEXT_RADIUS} ${SEAL_TEXT_RADIUS} 0 1 1 0 ${-SEAL_TEXT_RADIUS * 2}`}
        />
        <text
          fill="#B08D3E"
          fillOpacity="0.85"
          fontSize={SEAL_FONT_SIZE}
          fontWeight="600"
          letterSpacing="0.18em"
          className="font-sans"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textLength={SEAL_CIRCUMFERENCE}
            lengthAdjust="spacing"
          >
            {sealLegend(feature.stamp)}
          </textPath>
        </text>
      </g>
      <g>
        <circle cx={SEAL_CENTRE} cy={SEAL_CENTRE} r="52" fill="none" stroke="#B08D3E" opacity="0.3" />
        <path
          d="M 40 84 L 66 84 L 72 70 L 80 100 L 86 84 L 128 84"
          fill="none"
          stroke="#B08D3E"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="72" cy="70" r="3.2" fill="#B08D3E" />
      </g>
    </svg>
  );
}

/**
 * The latest visit in one card: the route drawn across India on the left, the
 * numbers, the headline moment and the stops on the right. The full case study
 * lives on the conditions page and the photographs in the carousel below, so
 * this card only has to say where the visit went and what came of it.
 *
 * The outlet count is looked up from data/links.json by `feature.storyId`,
 * syndication included, so it follows the data rather than being written here.
 */
export function TripCard({ trip }: { trip: Trip }) {
  const { ref: cardRef, visible } = useReveal<HTMLDivElement>();
  const routeRef = useRef<SVGPathElement>(null);
  const travellerRef = useRef<SVGCircleElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  /** Highest route point the line has reached, so pins light in travel order. */
  const [litIndex, setLitIndex] = useState(-1);
  const [drawn, setDrawn] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const map = useMemo(() => {
    const byId = new Map(trip.cities.map((city) => [city.id, city]));
    const routeCities = trip.route
      .map((id) => byId.get(id))
      .filter((city): city is TripCity => Boolean(city));

    const points: Point[] = routeCities.map((city) => {
      const projected = projectToMap(INDIA_GEOMETRY.projection, city.lat, city.lng);
      return { x: round(projected.x), y: round(projected.y) };
    });

    const head = points.length ? `M ${points[0].x} ${points[0].y}` : 'M 0 0';
    const legs = points.slice(1).map((to, i) => legPath(points[i], to, i % 2 === 0 ? 1 : -1));
    const prefixes = legs.map((_, i) => `${head} ${legs.slice(0, i + 1).join(' ')}`);

    const stops: TripCity[] = [];
    const firstIndex = new Map<string, number>();
    routeCities.forEach((city, i) => {
      if (firstIndex.has(city.id)) return;
      firstIndex.set(city.id, i);
      stops.push(city);
    });

    return { routeCities, points, stops, firstIndex, prefixes, d: `${head} ${legs.join(' ')}`.trim() };
  }, [trip]);

  const routeLabel = useMemo(() => {
    const names = map.routeCities.map((city) => city.name);
    if (names.length < 2) return `Route of the ${trip.label}.`;
    const [first, ...rest] = names;
    const last = rest[rest.length - 1];
    const middle = rest.slice(0, -1);
    const tail = last === first ? `and back to ${last}` : `and ${last}`;
    const body = middle.length ? `${first} to ${middle.join(', ')} ${tail}` : `${first} ${tail}`;
    return `Route of the ${trip.label}: ${body}.`;
  }, [map.routeCities, trip.label]);

  /** "12 to 27 August 2026" gives the month and year for the map caption. */
  const period = useMemo(() => trip.dates.split(' ').slice(-2).join(' '), [trip.dates]);

  const feature = trip.feature;
  const outletCount = useMemo(() => {
    if (!feature) return 0;
    const story = links.press.filter((item) => item.story === feature.storyId);
    return story.length + story.flatMap((item) => item.syndicated ?? []).length;
  }, [feature]);

  const stopAuto = useCallback(() => setInteracted(true), []);

  const goTo = useCallback(
    (index: number, focus = false) => {
      setInteracted(true);
      const clamped = Math.min(Math.max(index, 0), map.stops.length - 1);
      setActiveIndex(clamped);
      if (focus) tabRefs.current[clamped]?.focus();
    },
    [map.stops.length],
  );

  // Draw the line once the card is in view, lighting each pin as the head of
  // the line passes it. Reduced motion, and jsdom, get the finished state.
  useEffect(() => {
    const path = routeRef.current;
    const traveller = travellerRef.current;
    const measure = measureRef.current;
    if (!path || !traveller || !measure) return;

    const lastPoint = map.points[map.points.length - 1];
    const lastIndex = map.points.length - 1;
    const canMeasure =
      typeof path.getTotalLength === 'function' &&
      typeof path.getPointAtLength === 'function' &&
      typeof measure.getTotalLength === 'function';

    if (!canMeasure || prefersReducedMotion()) {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      if (lastPoint) {
        traveller.setAttribute('cx', String(lastPoint.x));
        traveller.setAttribute('cy', String(lastPoint.y));
      }
      setLitIndex(lastIndex);
      return;
    }

    const total = path.getTotalLength();
    path.style.strokeDasharray = String(total);

    if (!visible) {
      path.style.strokeDashoffset = String(total);
      return;
    }

    // The length at which the line reaches each stop, measured leg by leg.
    const marks = [
      0,
      ...map.prefixes.map((d) => {
        measure.setAttribute('d', d);
        return measure.getTotalLength();
      }),
    ];

    let raf = 0;
    let start = 0;

    const tick = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / DRAW_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      const travelled = total * eased;

      path.style.strokeDashoffset = String(total - travelled);
      const head = path.getPointAtLength(travelled);
      traveller.setAttribute('cx', String(head.x));
      traveller.setAttribute('cy', String(head.y));

      let reached = 0;
      while (reached + 1 < marks.length && marks[reached + 1] <= travelled) reached += 1;
      setLitIndex((current) => (reached > current ? reached : current));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (lastPoint) {
        traveller.setAttribute('cx', String(lastPoint.x));
        traveller.setAttribute('cy', String(lastPoint.y));
      }
      setLitIndex(lastIndex);
      setDrawn(true);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [map.points, map.prefixes, visible]);

  // A gentle tour of the stops once the line has landed, abandoned the moment
  // somebody touches, hovers, clicks or tabs into the card. `drawn` is only
  // ever set by the animation, so reduced motion never starts the tour.
  useEffect(() => {
    if (!drawn || interacted || map.stops.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % map.stops.length);
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [drawn, interacted, map.stops.length]);

  const active = map.stops[activeIndex] ?? map.stops[0];
  if (!active) return null;

  const total = map.stops.length;
  const panelId = `${trip.id}-route-panel`;
  const tabId = (cityId: string) => `${trip.id}-route-tab-${cityId}`;

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % total;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + total) % total;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = total - 1;
    if (next === null) return;
    event.preventDefault();
    goTo(next, true);
  };

  return (
    <Reveal>
      <div
        ref={cardRef}
        onPointerEnter={stopAuto}
        onClickCapture={stopAuto}
        onFocusCapture={stopAuto}
        onKeyDownCapture={stopAuto}
        className="overflow-hidden rounded-2xl border border-line-dark bg-night text-paper shadow-[0_28px_64px_rgba(6,15,21,0.28),0_0_0_1px_rgba(58,84,104,0.22)]"
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-w-0 px-2 py-4 md:self-center md:p-6">
            {trip.feature ? (
              <div className="pointer-events-none absolute right-3 top-3 md:right-6 md:top-6">
                <TripSeal feature={trip.feature} tripId={trip.id} />
              </div>
            ) : null}
            <svg
              viewBox={MAP_VIEWBOX}
              role="img"
              aria-label={routeLabel}
              preserveAspectRatio="xMidYMid meet"
              className="block h-auto w-full"
            >
              {INDIA_GEOMETRY.paths.map((shape) => (
                <path key={shape.name} d={shape.d} fill="#16303F" stroke="#2A4254" strokeWidth="0.8" />
              ))}

              <path
                d={map.d}
                fill="none"
                stroke="#B08D3E"
                strokeOpacity="0.22"
                strokeWidth="1.2"
                strokeDasharray="2 3"
              />
              <path
                ref={routeRef}
                d={map.d}
                fill="none"
                stroke="#B08D3E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Measures the length at which the line reaches each stop. */}
              <path ref={measureRef} d="M 0 0" fill="none" stroke="none" />

              <g aria-hidden="true">
                {map.stops.map((city, i) => {
                  const point = map.points[map.firstIndex.get(city.id) ?? 0];
                  if (!point) return null;
                  const lit = litIndex >= (map.firstIndex.get(city.id) ?? 0);
                  const isActive = i === activeIndex;
                  const label = labelPlacement(city, point);

                  return (
                    <g
                      key={city.id}
                      className={lit ? 'route-pin route-pin-lit' : 'route-pin'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => goTo(i)}
                      onMouseEnter={() => goTo(i)}
                    >
                      {isActive ? (
                        <circle
                          className="route-pin-halo"
                          cx={point.x}
                          cy={point.y}
                          r="6"
                          fill="none"
                          stroke="#D8B15A"
                          strokeWidth="1"
                        />
                      ) : null}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4.2"
                        fill={isActive ? '#B08D3E' : '#0C1F2B'}
                        stroke="#B08D3E"
                        strokeWidth="1.6"
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor={label.anchor}
                        className="font-sans"
                        fontSize={LABEL_FONT_SIZE}
                        fontWeight="600"
                        letterSpacing="0.12em"
                        fill={isActive ? '#D8B15A' : '#F7F5F1'}
                        fillOpacity={isActive ? 1 : 0.72}
                      >
                        {city.name.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>

              <circle
                ref={travellerRef}
                cx={map.points[0]?.x ?? 0}
                cy={map.points[0]?.y ?? 0}
                r="3.2"
                fill="#D8B15A"
              />
            </svg>

            <p className="pointer-events-none absolute bottom-2 left-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/45 md:bottom-4 md:left-6">
              Route, {period}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-5 p-5 md:relative md:border-l md:border-line-dark/60 md:p-7">
            <div className="flex flex-wrap gap-x-7 gap-y-2">
              {trip.stats.map((stat) => (
                <p key={stat.label} className="flex items-baseline">
                  <span className="font-serif text-2xl text-paper md:text-3xl">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">
                    {stat.label}
                  </span>
                </p>
              ))}
            </div>

            {feature ? (
              <div className="border-t border-line-dark/60 pt-5">

                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  {feature.stamp} · {feature.eyebrow}
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-tight text-paper md:text-[1.7rem]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/75">{feature.summary}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link
                    href={feature.href}
                    className="interactive rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-night hover:bg-brass-bright"
                  >
                    Read the full case &rarr;
                  </Link>
                  <Link
                    href="/testimonials#press"
                    className="arrow-link interactive text-sm font-semibold text-brass hover:underline"
                  >
                    Reported by {outletCount} outlets &rarr;
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="border-t border-line-dark/60 pt-5">
              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                The route
              </p>

              <div role="tablist" aria-label="Stops on the visit" className="mt-3 flex flex-wrap gap-2">
                {map.stops.map((city, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={city.id}
                      type="button"
                      role="tab"
                      id={tabId(city.id)}
                      aria-selected={isActive}
                      aria-controls={panelId}
                      tabIndex={isActive ? 0 : -1}
                      ref={(node) => {
                        tabRefs.current[i] = node;
                      }}
                      onClick={() => goTo(i)}
                      onKeyDown={(event) => onTabKeyDown(event, i)}
                      className={`interactive inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-1.5 ${
                        isActive
                          ? 'border-brass bg-night-soft text-paper'
                          : 'border-line-dark text-paper/70 hover:bg-night-soft/50'
                      }`}
                    >
                      <span className="text-[11px] font-semibold tabular-nums tracking-[0.16em] text-brass">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-base leading-none">{city.name}</span>
                    </button>
                  );
                })}
              </div>

              <p
                key={active.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId(active.id)}
                className="mlafc-panel-in mt-3 min-h-[3.4rem] text-sm leading-relaxed text-paper/75"
              >
                <strong className="text-paper">{active.name}</strong>, {active.dates} ·{' '}
                {active.hospitals.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
