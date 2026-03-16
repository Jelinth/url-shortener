import { useState } from "react";
import { Link2 } from "lucide-react";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    onSubmit(url);
    setUrl("");
  };

  return (
    <section className="bg-primary py-10 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary-foreground">Simplify your URL</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="Enter your original URL eg. http://demos.nelliwinne.net/URLShortener/"
              className="w-full h-12 pl-4 pr-4 rounded bg-card text-foreground border border-border outline-none focus:ring-2 focus:ring-ring/30 text-sm"
            />
            {error && <p className="text-destructive text-xs mt-1 text-left">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-6 bg-foreground text-card rounded font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            <Link2 size={16} />
            Shorten URL
          </button>
        </form>
        <p className="text-primary-foreground/70 text-xs">
          All the Shortened URL and their analytics are public...
        </p>
      </div>
    </section>
  );
}
