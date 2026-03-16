import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import AnalyticsChart from "@/components/AnalyticsChart";
import { ShortenedURL, ClickEvent } from "@/types/url";
import { getUrlAnalytics, getBaseUrl } from "@/services/api";
import { formatDate } from "@/utils/formatDate";

export default function AnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [url, setUrl] = useState<ShortenedURL | null>(null);
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);

  useEffect(() => {
    if (id) {
      getUrlAnalytics(Number(id)).then((data) => {
        setUrl(data.url);
        setClickEvents(data.clickEvents);
      });
    }
  }, [id]);

  if (!url) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  const baseUrl = getBaseUrl();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
        >
          <ArrowLeft size={16} /> Back to URLs
        </Link>

        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-lg font-bold text-primary-foreground">URL Analytics</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Original URL</span>
                <a
                  href={url.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {url.originalUrl}
                </a>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Short URL</span>
                <span className="text-foreground font-mono">
                  {baseUrl}/{url.shortCode}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Created on</span>
                <span className="text-foreground">{formatDate(url.createdAt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Total Clicks</span>
                <span className="text-2xl font-bold text-primary">{url.clickCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="bg-table-header px-6 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Click History</h3>
          </div>
          <div className="p-6">
            {clickEvents.length > 0 ? (
              <AnalyticsChart clickEvents={clickEvents} />
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No click data available yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
