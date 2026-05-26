import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminContext } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type PageViewRow = Database["public"]["Tables"]["analytics_page_views"]["Row"];
type SummaryRow = Pick<
  PageViewRow,
  | "country"
  | "device_type"
  | "path"
  | "referrer"
  | "referrer_host"
  | "session_id"
  | "visited_at"
  | "visitor_id"
>;

type AggregateItem = {
  label: string;
  value: number;
  percent: number;
};

type CountryCoordinate = {
  lat: number;
  lon: number;
};

type CountryAggregate = AggregateItem & {
  code: string;
  coordinates?: CountryCoordinate;
};

const SUMMARY_LIMIT = 1000;
const TABLE_PAGE_SIZE = 25;
const UNKNOWN_COUNTRY = "unknown";
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const PERIOD_OPTIONS = [
  {
    value: "week",
    label: "Ultima semana",
    days: 7,
    summary: "de los ultimos 7 dias",
  },
  {
    value: "month",
    label: "Ultimo mes",
    days: 30,
    summary: "de los ultimos 30 dias",
  },
  {
    value: "all",
    label: "Todo",
    days: null,
    summary: "de todo el historico",
  },
] as const;

type AnalyticsPeriod = (typeof PERIOD_OPTIONS)[number]["value"];

const numberFormatter = new Intl.NumberFormat("es-ES");
const regionNames =
  typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["es"], { type: "region" })
    : null;

const COUNTRY_COORDINATES: Record<string, CountryCoordinate> = {
  AD: { lat: 42.5, lon: 1.5 },
  AE: { lat: 24.4, lon: 54.4 },
  AF: { lat: 34.5, lon: 69.2 },
  AG: { lat: 17.1, lon: -61.8 },
  AL: { lat: 41.3, lon: 19.8 },
  AM: { lat: 40.2, lon: 44.5 },
  AO: { lat: -8.8, lon: 13.2 },
  AR: { lat: -34.6, lon: -58.4 },
  AT: { lat: 48.2, lon: 16.4 },
  AU: { lat: -35.3, lon: 149.1 },
  AZ: { lat: 40.4, lon: 49.9 },
  BA: { lat: 43.9, lon: 18.4 },
  BB: { lat: 13.1, lon: -59.6 },
  BD: { lat: 23.8, lon: 90.4 },
  BE: { lat: 50.9, lon: 4.4 },
  BF: { lat: 12.4, lon: -1.5 },
  BG: { lat: 42.7, lon: 23.3 },
  BH: { lat: 26.2, lon: 50.6 },
  BI: { lat: -3.4, lon: 29.9 },
  BJ: { lat: 6.5, lon: 2.6 },
  BN: { lat: 4.9, lon: 114.9 },
  BO: { lat: -16.5, lon: -68.1 },
  BR: { lat: -15.8, lon: -47.9 },
  BS: { lat: 25.0, lon: -77.4 },
  BT: { lat: 27.5, lon: 89.6 },
  BW: { lat: -24.7, lon: 25.9 },
  BY: { lat: 53.9, lon: 27.6 },
  BZ: { lat: 17.5, lon: -88.2 },
  CA: { lat: 45.4, lon: -75.7 },
  CD: { lat: -4.3, lon: 15.3 },
  CF: { lat: 4.4, lon: 18.6 },
  CG: { lat: -4.3, lon: 15.3 },
  CH: { lat: 46.9, lon: 7.4 },
  CI: { lat: 5.3, lon: -4.0 },
  CL: { lat: -33.4, lon: -70.7 },
  CM: { lat: 3.9, lon: 11.5 },
  CN: { lat: 39.9, lon: 116.4 },
  CO: { lat: 4.7, lon: -74.1 },
  CR: { lat: 9.9, lon: -84.1 },
  CU: { lat: 23.1, lon: -82.4 },
  CV: { lat: 14.9, lon: -23.5 },
  CY: { lat: 35.2, lon: 33.4 },
  CZ: { lat: 50.1, lon: 14.4 },
  DE: { lat: 52.5, lon: 13.4 },
  DK: { lat: 55.7, lon: 12.6 },
  DO: { lat: 18.5, lon: -69.9 },
  DZ: { lat: 36.8, lon: 3.1 },
  EC: { lat: -0.2, lon: -78.5 },
  EE: { lat: 59.4, lon: 24.8 },
  EG: { lat: 30.0, lon: 31.2 },
  ES: { lat: 40.4, lon: -3.7 },
  ET: { lat: 9.0, lon: 38.8 },
  FI: { lat: 60.2, lon: 24.9 },
  FJ: { lat: -18.1, lon: 178.4 },
  FR: { lat: 48.9, lon: 2.4 },
  GA: { lat: 0.4, lon: 9.5 },
  GB: { lat: 51.5, lon: -0.1 },
  GE: { lat: 41.7, lon: 44.8 },
  GH: { lat: 5.6, lon: -0.2 },
  GM: { lat: 13.5, lon: -16.6 },
  GN: { lat: 9.6, lon: -13.6 },
  GQ: { lat: 3.8, lon: 8.8 },
  GR: { lat: 38.0, lon: 23.7 },
  GT: { lat: 14.6, lon: -90.5 },
  GW: { lat: 11.9, lon: -15.6 },
  GY: { lat: 6.8, lon: -58.2 },
  HK: { lat: 22.3, lon: 114.2 },
  HN: { lat: 14.1, lon: -87.2 },
  HR: { lat: 45.8, lon: 16.0 },
  HT: { lat: 18.5, lon: -72.3 },
  HU: { lat: 47.5, lon: 19.0 },
  ID: { lat: -6.2, lon: 106.8 },
  IE: { lat: 53.3, lon: -6.3 },
  IL: { lat: 31.8, lon: 35.2 },
  IN: { lat: 28.6, lon: 77.2 },
  IQ: { lat: 33.3, lon: 44.4 },
  IR: { lat: 35.7, lon: 51.4 },
  IS: { lat: 64.1, lon: -21.9 },
  IT: { lat: 41.9, lon: 12.5 },
  JM: { lat: 18.0, lon: -76.8 },
  JO: { lat: 31.9, lon: 35.9 },
  JP: { lat: 35.7, lon: 139.7 },
  KE: { lat: -1.3, lon: 36.8 },
  KG: { lat: 42.9, lon: 74.6 },
  KH: { lat: 11.6, lon: 104.9 },
  KR: { lat: 37.6, lon: 127.0 },
  KW: { lat: 29.4, lon: 47.9 },
  KZ: { lat: 51.2, lon: 71.4 },
  LA: { lat: 17.9, lon: 102.6 },
  LB: { lat: 33.9, lon: 35.5 },
  LK: { lat: 6.9, lon: 79.9 },
  LR: { lat: 6.3, lon: -10.8 },
  LT: { lat: 54.7, lon: 25.3 },
  LU: { lat: 49.6, lon: 6.1 },
  LV: { lat: 56.9, lon: 24.1 },
  LY: { lat: 32.9, lon: 13.2 },
  MA: { lat: 34.0, lon: -6.8 },
  MD: { lat: 47.0, lon: 28.9 },
  ME: { lat: 42.4, lon: 19.3 },
  MG: { lat: -18.9, lon: 47.5 },
  MK: { lat: 42.0, lon: 21.4 },
  ML: { lat: 12.6, lon: -8.0 },
  MM: { lat: 16.8, lon: 96.2 },
  MN: { lat: 47.9, lon: 106.9 },
  MR: { lat: 18.1, lon: -15.9 },
  MT: { lat: 35.9, lon: 14.5 },
  MU: { lat: -20.2, lon: 57.5 },
  MV: { lat: 4.2, lon: 73.5 },
  MW: { lat: -13.9, lon: 33.8 },
  MX: { lat: 19.4, lon: -99.1 },
  MY: { lat: 3.1, lon: 101.7 },
  MZ: { lat: -25.9, lon: 32.6 },
  NA: { lat: -22.6, lon: 17.1 },
  NE: { lat: 13.5, lon: 2.1 },
  NG: { lat: 6.5, lon: 3.4 },
  NI: { lat: 12.1, lon: -86.3 },
  NL: { lat: 52.4, lon: 4.9 },
  NO: { lat: 59.9, lon: 10.8 },
  NP: { lat: 27.7, lon: 85.3 },
  NZ: { lat: -41.3, lon: 174.8 },
  OM: { lat: 23.6, lon: 58.4 },
  PA: { lat: 9.0, lon: -79.5 },
  PE: { lat: -12.0, lon: -77.0 },
  PG: { lat: -9.5, lon: 147.2 },
  PH: { lat: 14.6, lon: 121.0 },
  PK: { lat: 33.7, lon: 73.1 },
  PL: { lat: 52.2, lon: 21.0 },
  PR: { lat: 18.5, lon: -66.1 },
  PT: { lat: 38.7, lon: -9.1 },
  PY: { lat: -25.3, lon: -57.6 },
  QA: { lat: 25.3, lon: 51.5 },
  RO: { lat: 44.4, lon: 26.1 },
  RS: { lat: 44.8, lon: 20.5 },
  RU: { lat: 55.8, lon: 37.6 },
  RW: { lat: -1.9, lon: 30.1 },
  SA: { lat: 24.7, lon: 46.7 },
  SD: { lat: 15.6, lon: 32.5 },
  SE: { lat: 59.3, lon: 18.1 },
  SG: { lat: 1.4, lon: 103.8 },
  SI: { lat: 46.1, lon: 14.5 },
  SK: { lat: 48.1, lon: 17.1 },
  SN: { lat: 14.7, lon: -17.5 },
  SO: { lat: 2.0, lon: 45.3 },
  SR: { lat: 5.8, lon: -55.2 },
  SV: { lat: 13.7, lon: -89.2 },
  SY: { lat: 33.5, lon: 36.3 },
  TD: { lat: 12.1, lon: 15.0 },
  TG: { lat: 6.1, lon: 1.2 },
  TH: { lat: 13.8, lon: 100.5 },
  TJ: { lat: 38.6, lon: 68.8 },
  TN: { lat: 36.8, lon: 10.2 },
  TR: { lat: 39.9, lon: 32.9 },
  TT: { lat: 10.7, lon: -61.5 },
  TW: { lat: 25.0, lon: 121.6 },
  TZ: { lat: -6.8, lon: 39.3 },
  UA: { lat: 50.5, lon: 30.5 },
  UG: { lat: 0.3, lon: 32.6 },
  US: { lat: 38.9, lon: -77.0 },
  UY: { lat: -34.9, lon: -56.2 },
  UZ: { lat: 41.3, lon: 69.2 },
  VE: { lat: 10.5, lon: -66.9 },
  VN: { lat: 21.0, lon: 105.8 },
  XK: { lat: 42.7, lon: 21.2 },
  YE: { lat: 15.4, lon: 44.2 },
  ZA: { lat: -25.7, lon: 28.2 },
  ZM: { lat: -15.4, lon: 28.3 },
  ZW: { lat: -17.8, lon: 31.0 },
};

type AdminAnalyticsPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    period?: string | string[];
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function requestLabel(count: number) {
  return count === 1 ? "1 peticion" : `${formatNumber(count)} peticiones`;
}

function isNoisyQueryParam(name: string) {
  const normalizedName = name.toLowerCase();

  return (
    normalizedName.startsWith("utm_") ||
    [
      "fbclid",
      "gclid",
      "gbraid",
      "wbraid",
      "igshid",
      "mc_cid",
      "mc_eid",
      "msclkid",
    ].includes(normalizedName)
  );
}

function cleanDisplayPath(value: string) {
  try {
    const url = new URL(value, "https://www.alvaral.dev");

    Array.from(url.searchParams.keys()).forEach((key) => {
      if (isNoisyQueryParam(key)) {
        url.searchParams.delete(key);
      }
    });

    const query = url.searchParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return value;
  }
}

function locationLabel(view: PageViewRow) {
  return [view.city, view.region, view.country].filter(Boolean).join(", ") || "-";
}

function referrerLabel(view: PageViewRow) {
  if (!view.referrer) return "Directa";
  return view.referrer_host ?? view.referrer;
}

function normalizeCountryCode(value: string | null) {
  const code = value?.trim().toUpperCase();

  if (!code || code === "XX" || !/^[A-Z]{2}$/.test(code)) {
    return null;
  }

  return code;
}

function countryName(code: string) {
  if (code === UNKNOWN_COUNTRY) return "Sin pais";

  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

function countryLabel(code: string) {
  if (code === UNKNOWN_COUNTRY) return countryName(code);
  return `${countryName(code)} (${code})`;
}

function aggregateRows(
  rows: SummaryRow[],
  getLabel: (row: SummaryRow) => string | null | undefined,
  limit = 5
) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    const label = getLabel(row)?.trim() || "Sin datos";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  const total = Math.max(rows.length, 1);

  return Array.from(counts.entries())
    .map(([label, value]) => ({
      label,
      value,
      percent: (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function aggregateCountries(rows: SummaryRow[]) {
  const counts = new Map<string, number>();

  rows.forEach((row) => {
    const code = normalizeCountryCode(row.country) ?? UNKNOWN_COUNTRY;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  });

  const total = Math.max(rows.length, 1);

  return Array.from(counts.entries())
    .map(([code, value]) => ({
      code,
      label: countryLabel(code),
      value,
      percent: (value / total) * 100,
      coordinates: COUNTRY_COORDINATES[code],
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

function projectCoordinate({ lat, lon }: CountryCoordinate) {
  return {
    x: ((lon + 180) / 360) * MAP_WIDTH,
    y: ((90 - lat) / 180) * MAP_HEIGHT,
  };
}

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parsePeriod(value: string | string[] | undefined): AnalyticsPeriod {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return PERIOD_OPTIONS.some((option) => option.value === rawValue)
    ? (rawValue as AnalyticsPeriod)
    : "all";
}

function periodConfig(period: AnalyticsPeriod) {
  return PERIOD_OPTIONS.find((option) => option.value === period)!;
}

function periodStartDate(period: AnalyticsPeriod) {
  const days = periodConfig(period).days;

  if (!days) return null;

  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function analyticsHref({
  page,
  period,
  withAnchor = false,
}: {
  page?: number;
  period: AnalyticsPeriod;
  withAnchor?: boolean;
}) {
  const params = new URLSearchParams();

  if (period !== "all") {
    params.set("period", period);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return `/admin/analytics${query ? `?${query}` : ""}${
    withAnchor ? "#recent-visits" : ""
  }`;
}

function visiblePageItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages, currentPage]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  if (currentPage <= 3) {
    [2, 3, 4].forEach((page) => {
      if (page < totalPages) pages.add(page);
    });
  }

  if (currentPage >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => {
      if (page > 1) pages.add(page);
    });
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const items: Array<number | string> = [];

  sortedPages.forEach((page, index) => {
    const previous = sortedPages[index - 1];

    if (previous && page - previous > 1) {
      items.push(`ellipsis-${previous}-${page}`);
    }

    items.push(page);
  });

  return items;
}

function MetricCard({
  help,
  label,
  value,
}: {
  help: string;
  label: string;
  value: string | number;
}) {
  return (
    <section className="rounded-md border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-gray-500">{help}</p>
    </section>
  );
}

function TopList({
  emptyLabel,
  items,
  title,
}: {
  emptyLabel: string;
  items: AggregateItem[];
  title: string;
}) {
  return (
    <section className="rounded-md border border-gray-200 p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex min-w-0 items-start justify-between gap-3 text-sm">
              <span
                className="min-w-0 max-w-full truncate break-all font-medium"
                title={item.label}
              >
                {item.label}
              </span>
              <span className="shrink-0 text-gray-500">
                {requestLabel(item.value)}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gray-950"
                style={{ width: `${Math.max(item.percent, 4)}%` }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-500">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}

function PeriodFilter({ period }: { period: AnalyticsPeriod }) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-1">
      {PERIOD_OPTIONS.map((option) => {
        const isActive = option.value === period;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-950",
            ].join(" ")}
            href={analyticsHref({ period: option.value })}
            key={option.value}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

function PaginationLink({
  children,
  href,
  isActive = false,
  isDisabled = false,
  label,
}: {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
  isDisabled?: boolean;
  label: string;
}) {
  const className = [
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
    isActive
      ? "border-gray-950 bg-gray-950 text-white"
      : "border-gray-200 text-gray-700 hover:bg-gray-50",
    isDisabled ? "pointer-events-none opacity-40" : "",
  ].join(" ");

  if (isDisabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
      className={className}
      href={href}
    >
      {children}
    </Link>
  );
}

function RecentVisitsPagination({
  currentPage,
  pageSize,
  period,
  totalPages,
}: {
  currentPage: number;
  pageSize: number;
  period: AnalyticsPeriod;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginacion de visitas"
      className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-gray-500">
        Pagina {formatNumber(currentPage)} de {formatNumber(totalPages)} -{" "}
        {formatNumber(pageSize)} por pagina
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PaginationLink
          href={analyticsHref({
            page: currentPage - 1,
            period,
            withAnchor: true,
          })}
          isDisabled={currentPage === 1}
          label="Pagina anterior"
        >
          Anterior
        </PaginationLink>

        {visiblePageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <PaginationLink
              href={analyticsHref({ page: item, period, withAnchor: true })}
              isActive={item === currentPage}
              key={item}
              label={`Pagina ${item}`}
            >
              {formatNumber(item)}
            </PaginationLink>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-gray-400"
              key={item}
            >
              ...
            </span>
          )
        )}

        <PaginationLink
          href={analyticsHref({
            page: currentPage + 1,
            period,
            withAnchor: true,
          })}
          isDisabled={currentPage === totalPages}
          label="Pagina siguiente"
        >
          Siguiente
        </PaginationLink>
      </div>
    </nav>
  );
}

function CountryActivityMap({
  countries,
}: {
  countries: CountryAggregate[];
}) {
  const knownCountries = countries.filter(
    (country) => country.code !== UNKNOWN_COUNTRY
  );
  const mappedCountries = countries.filter(
    (country) => country.code !== UNKNOWN_COUNTRY && country.coordinates
  );
  const countriesWithoutPosition = countries.filter(
    (country) => country.code !== UNKNOWN_COUNTRY && !country.coordinates
  );
  const maxValue = Math.max(1, ...countries.map((country) => country.value));

  return (
    <section className="rounded-md border border-gray-200 p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold">Peticiones por pais</h2>
          <p className="text-sm text-gray-500">
            Puntos escalados por volumen de visitas registradas.
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {formatNumber(knownCountries.length)} ubicaciones
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          <svg
            aria-label="Mapa de peticiones por pais"
            className="h-[320px] w-full"
            role="img"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          >
            <rect fill="#f8fafc" height={MAP_HEIGHT} width={MAP_WIDTH} />
            {[200, 400, 600, 800].map((x) => (
              <line
                key={`vertical-${x}`}
                stroke="#e2e8f0"
                strokeWidth="1"
                x1={x}
                x2={x}
                y1="0"
                y2={MAP_HEIGHT}
              />
            ))}
            {[125, 250, 375].map((y) => (
              <line
                key={`horizontal-${y}`}
                stroke="#e2e8f0"
                strokeWidth="1"
                x1="0"
                x2={MAP_WIDTH}
                y1={y}
                y2={y}
              />
            ))}
            <image
              height={MAP_HEIGHT}
              href="/assets/maps/world-equirectangular.svg"
              preserveAspectRatio="none"
              width={MAP_WIDTH}
              x="0"
              y="0"
            />
            {mappedCountries.map((country) => {
              const point = projectCoordinate(country.coordinates!);
              const radius = 6 + Math.sqrt(country.value / maxValue) * 16;

              return (
                <g key={country.code}>
                  <title>{`${country.label}: ${requestLabel(country.value)}`}</title>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="#2563eb"
                    opacity="0.16"
                    r={radius + 8}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    fill="#f97316"
                    r={radius}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <text
                    fill="#111827"
                    fontSize="22"
                    fontWeight="700"
                    textAnchor="middle"
                    x={point.x}
                    y={point.y + radius + 24}
                  >
                    {country.code}
                  </text>
                </g>
              );
            })}
            {mappedCountries.length === 0 && (
              <text
                fill="#6b7280"
                fontSize="24"
                textAnchor="middle"
                x={MAP_WIDTH / 2}
                y={MAP_HEIGHT / 2}
              >
                Sin paises para pintar todavia
              </text>
            )}
          </svg>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            {countries.slice(0, 8).map((country) => (
              <div key={country.code}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span
                    className="min-w-0 truncate font-medium"
                    title={country.label}
                  >
                    {country.label}
                  </span>
                  <span className="shrink-0 text-gray-500">
                    {requestLabel(country.value)}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${Math.max(country.percent, 4)}%` }}
                  />
                </div>
              </div>
            ))}
            {countries.length === 0 && (
              <p className="text-sm text-gray-500">
                Aun no hay visitas con pais registrado.
              </p>
            )}
          </div>

          {countriesWithoutPosition.length > 0 && (
            <p className="text-xs text-gray-500">
              Sin posicion en el mapa:{" "}
              {countriesWithoutPosition
                .map((country) => country.code)
                .slice(0, 6)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const params = await searchParams;
  const requestedPage = parsePage(params?.page);
  const period = parsePeriod(params?.period);
  const periodOption = periodConfig(period);
  const visitedSince = periodStartDate(period);
  const { supabase, user } = await getAdminContext();
  const countQuery = visitedSince
    ? supabase
        .from("analytics_page_views")
        .select("id", { count: "exact", head: true })
        .gte("visited_at", visitedSince)
    : supabase
        .from("analytics_page_views")
        .select("id", { count: "exact", head: true });
  const summaryQuery = visitedSince
    ? supabase
        .from("analytics_page_views")
        .select(
          "country, device_type, path, referrer, referrer_host, session_id, visited_at, visitor_id"
        )
        .gte("visited_at", visitedSince)
        .order("visited_at", { ascending: false })
        .limit(SUMMARY_LIMIT)
    : supabase
        .from("analytics_page_views")
        .select(
          "country, device_type, path, referrer, referrer_host, session_id, visited_at, visitor_id"
        )
        .order("visited_at", { ascending: false })
        .limit(SUMMARY_LIMIT);
  const [countResult, summaryResult] = await Promise.all([
    countQuery,
    summaryQuery,
  ]);

  const summaryViews = (summaryResult.data ?? []) as SummaryRow[];
  const totalViews = countResult.count ?? summaryViews.length;
  const totalPages = Math.max(1, Math.ceil(totalViews / TABLE_PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * TABLE_PAGE_SIZE;
  const pageEnd = pageStart + TABLE_PAGE_SIZE - 1;
  const recentQuery = visitedSince
    ? supabase
        .from("analytics_page_views")
        .select("*")
        .gte("visited_at", visitedSince)
        .order("visited_at", { ascending: false })
        .range(pageStart, pageEnd)
    : supabase
        .from("analytics_page_views")
        .select("*")
        .order("visited_at", { ascending: false })
        .range(pageStart, pageEnd);
  const recentResult = await recentQuery;
  const views = (recentResult.data ?? []) as PageViewRow[];
  const visibleStart = totalViews === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageEnd + 1, totalViews);
  const uniquePages = new Set(
    summaryViews.map((view) => cleanDisplayPath(view.path))
  ).size;
  const uniqueSessions = new Set(
    summaryViews.map((view) => view.session_id).filter(Boolean)
  ).size;
  const uniqueVisitors = new Set(
    summaryViews.map((view) => view.visitor_id).filter(Boolean)
  ).size;
  const countryData = aggregateCountries(summaryViews);
  const knownCountryCount = countryData.filter(
    (country) => country.code !== UNKNOWN_COUNTRY
  ).length;
  const scopeLabel =
    totalViews > summaryViews.length && summaryViews.length > 0
      ? `Agregados calculados sobre las ultimas ${formatNumber(
          summaryViews.length
        )} visitas ${periodOption.summary}.`
      : `Agregados calculados sobre las visitas ${periodOption.summary}.`;

  const topPages = aggregateRows(
    summaryViews,
    (view) => cleanDisplayPath(view.path),
    6
  );
  const topReferrers = aggregateRows(
    summaryViews,
    (view) => view.referrer_host ?? (view.referrer ? "Otros" : "Directa"),
    6
  );
  const topDevices = aggregateRows(
    summaryViews,
    (view) => view.device_type,
    4
  );

  return (
    <AdminShell userEmail={user.email}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analiticas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visitas registradas por el tracker propio de la web. {scopeLabel}
          </p>
        </div>
        <PeriodFilter period={period} />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          help={
            period === "all"
              ? "Historico completo guardado en Supabase"
              : periodOption.label
          }
          label={period === "all" ? "Visitas totales" : "Visitas"}
          value={formatNumber(totalViews)}
        />
        <MetricCard
          help="Sesiones anonimas detectadas"
          label="Sesiones"
          value={formatNumber(uniqueSessions)}
        />
        <MetricCard
          help="Visitantes anonimos detectados"
          label="Visitantes"
          value={formatNumber(uniqueVisitors)}
        />
        <MetricCard
          help="Rutas distintas vistas recientemente"
          label="Paginas"
          value={formatNumber(uniquePages)}
        />
        <MetricCard
          help="Paises detectados por Vercel"
          label="Paises"
          value={formatNumber(knownCountryCount)}
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <TopList
          emptyLabel="Aun no hay paginas registradas."
          items={topPages}
          title="Paginas mas vistas"
        />
        <TopList
          emptyLabel="Aun no hay origenes registrados."
          items={topReferrers}
          title="Origen del trafico"
        />
        <TopList
          emptyLabel="Aun no hay dispositivos registrados."
          items={topDevices}
          title="Dispositivos"
        />
      </div>

      <div className="mb-6">
        <CountryActivityMap countries={countryData} />
      </div>

      <section
        className="overflow-hidden rounded-md border border-gray-200"
        id="recent-visits"
      >
        <div className="flex flex-col gap-1 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-semibold">Ultimas visitas</h2>
          <p className="text-sm text-gray-500">
            Mostrando {formatNumber(visibleStart)}-
            {formatNumber(visibleEnd)} de {formatNumber(totalViews)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[170px]" />
              <col className="w-[260px]" />
              <col className="w-[220px]" />
              <col className="w-[150px]" />
              <col className="w-[130px]" />
              <col className="w-[250px]" />
            </colgroup>
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cuando</th>
                <th className="px-4 py-3 font-medium">Pagina</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Dispositivo</th>
                <th className="px-4 py-3 font-medium">Navegador</th>
                <th className="px-4 py-3 font-medium">Web previa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {views.map((view) => {
                const referrer = referrerLabel(view);

                return (
                  <tr key={view.id}>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(view.visited_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="block truncate font-medium"
                        title={view.path}
                      >
                        {view.path}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="block truncate"
                        title={locationLabel(view)}
                      >
                        {locationLabel(view)}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className="block truncate"
                        title={`${view.device_type} | ${view.os}`}
                      >
                        {view.device_type} | {view.os}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block truncate" title={view.browser}>
                        {view.browser}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block truncate" title={referrer}>
                        {referrer}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {views.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    Aun no hay visitas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <RecentVisitsPagination
          currentPage={currentPage}
          pageSize={TABLE_PAGE_SIZE}
          period={period}
          totalPages={totalPages}
        />
      </section>
    </AdminShell>
  );
}
