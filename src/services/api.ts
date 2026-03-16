import { ShortenedURL, ClickEvent, ChartDataPoint } from "@/types/url";
import { seedUrls, seedClickEvents } from "@/mock/seedData";

const API_BASE = "http://localhost:5000";

// In-memory store (falls back to seed data when backend is unavailable)
let urls: ShortenedURL[] = [...seedUrls];
let clickEvents: ClickEvent[] = [...seedClickEvents];
let nextUrlId = urls.length + 1;
let nextClickId = clickEvents.length + 1;

function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function tryBackend<T>(
  path: string,
  options?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, data };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function createShortUrl(originalUrl: string): Promise<ShortenedURL> {
  const backendRes = await tryBackend<{ id: number; original_url: string; short_code: string; clicks: number; created_at: string }>("/api/urls", {
    method: "POST",
    body: JSON.stringify({ url: originalUrl }),
  });

  if (backendRes.ok) {
    const d = backendRes.data;
    return {
      id: d.id,
      originalUrl: d.original_url,
      shortCode: d.short_code,
      createdAt: d.created_at,
      clickCount: d.clicks,
    };
  }

  // Fallback: local mock
  const newUrl: ShortenedURL = {
    id: nextUrlId++,
    originalUrl,
    shortCode: generateShortCode(),
    createdAt: new Date().toISOString(),
    clickCount: 0,
  };
  urls = [newUrl, ...urls];
  return newUrl;
}

export async function getUrls(): Promise<ShortenedURL[]> {
  const backendRes = await tryBackend<Array<{ id: number; original_url: string; short_code: string; clicks: number; created_at: string }>>("/api/urls");

  if (backendRes.ok) {
    return backendRes.data.map((d) => ({
      id: d.id,
      originalUrl: d.original_url,
      shortCode: d.short_code,
      createdAt: d.created_at,
      clickCount: d.clicks,
    }));
  }

  return [...urls].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUrlAnalytics(urlId: number): Promise<{ url: ShortenedURL; clickEvents: ClickEvent[] }> {
  const backendRes = await tryBackend<{ url: any; click_events: any[] }>(`/api/urls/${urlId}/analytics`);

  if (backendRes.ok) {
    const d = backendRes.data;
    return {
      url: {
        id: d.url.id,
        originalUrl: d.url.original_url,
        shortCode: d.url.short_code,
        createdAt: d.url.created_at,
        clickCount: d.url.clicks,
      },
      clickEvents: d.click_events.map((e: any) => ({
        id: e.id,
        urlId: e.url_id,
        clickedAt: e.clicked_at,
      })),
    };
  }

  const url = urls.find((u) => u.id === urlId);
  const events = clickEvents.filter((e) => e.urlId === urlId);
  return { url: url || urls[0], clickEvents: events };
}

export async function incrementClick(shortCode: string): Promise<void> {
  const backendRes = await tryBackend(`/${shortCode}`);
  if (!backendRes.ok) {
    const url = urls.find((u) => u.shortCode === shortCode);
    if (url) {
      url.clickCount++;
      clickEvents.push({
        id: nextClickId++,
        urlId: url.id,
        clickedAt: new Date().toISOString(),
      });
    }
  }
}

export function getStatisticsData(): ChartDataPoint[] {
  const dateMap = new Map<string, { clicks: number; creations: number }>();

  const allDates = new Set<string>();
  urls.forEach((u) => {
    const date = u.createdAt.split("T")[0];
    allDates.add(date);
  });
  clickEvents.forEach((e) => {
    const date = e.clickedAt.split("T")[0];
    allDates.add(date);
  });

  allDates.forEach((date) => {
    dateMap.set(date, { clicks: 0, creations: 0 });
  });

  urls.forEach((u) => {
    const date = u.createdAt.split("T")[0];
    const entry = dateMap.get(date)!;
    entry.creations++;
  });

  clickEvents.forEach((e) => {
    const date = e.clickedAt.split("T")[0];
    const entry = dateMap.get(date)!;
    entry.clicks++;
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getBaseUrl(): string {
  return API_BASE;
}
