import { useState } from "react";
import { Copy, ExternalLink, BarChart3, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShortenedURL } from "@/types/url";
import { formatDate } from "@/utils/formatDate";
import { getBaseUrl } from "@/services/api";

interface UrlTableProps {
  urls: ShortenedURL[];
}

export default function UrlTable({ urls }: UrlTableProps) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const baseUrl = getBaseUrl();

  const handleCopy = (url: ShortenedURL) => {
    navigator.clipboard.writeText(`${baseUrl}/${url.shortCode}`);
    setCopiedId(url.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpen = (url: ShortenedURL) => {
    window.open(url.originalUrl, "_blank");
  };

  if (urls.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No URLs shortened yet. Enter a URL above to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-table-border text-sm">
        <thead>
          <tr className="bg-table-header">
            <th className="text-left py-3 px-4 font-semibold border-b border-table-border">Original URL</th>
            <th className="text-left py-3 px-4 font-semibold border-b border-table-border">Short URL</th>
            <th className="text-center py-3 px-4 font-semibold border-b border-table-border w-24"></th>
            <th className="text-left py-3 px-4 font-semibold border-b border-table-border">Created on</th>
            <th className="text-center py-3 px-4 font-semibold border-b border-table-border">Clicks</th>
            <th className="text-center py-3 px-4 font-semibold border-b border-table-border w-28"></th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => {
            const shortUrl = `${baseUrl}/URLShortener/${url.shortCode}=`;
            return (
              <tr key={url.id} className="border-b border-table-border hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-4 max-w-[280px]">
                  <span className="block truncate text-foreground">{url.originalUrl}</span>
                </td>
                <td className="py-3 px-4">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-xs"
                  >
                    <ExternalLink size={12} />
                    {shortUrl}
                  </a>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopy(url)}
                      className="p-2 bg-primary text-primary-foreground rounded hover:opacity-80 transition-opacity"
                      title="Copy short URL"
                    >
                      {copiedId === url.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => handleOpen(url)}
                      className="p-2 bg-primary text-primary-foreground rounded hover:opacity-80 transition-opacity"
                      title="Open original URL"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-xs">
                  {formatDate(url.createdAt)}
                </td>
                <td className="py-3 px-4 text-center font-semibold">{url.clickCount}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/analytics/${url.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-analytics-btn text-card rounded text-xs font-medium hover:opacity-80 transition-opacity"
                  >
                    <BarChart3 size={12} />
                    Analytics
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
