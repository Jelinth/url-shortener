export interface ShortenedURL {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clickCount: number;
}

export interface ClickEvent {
  id: number;
  urlId: number;
  clickedAt: string;
}

export interface AnalyticsData {
  url: ShortenedURL;
  clickEvents: ClickEvent[];
}

export interface ChartDataPoint {
  date: string;
  clicks: number;
  creations: number;
}
