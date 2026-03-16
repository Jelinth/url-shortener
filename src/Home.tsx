import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import UrlForm from "@/components/UrlForm";
import UrlTable from "@/components/UrlTable";
import Pagination from "@/components/Pagination";
import Statistics from "@/components/Statistics";
import { ShortenedURL } from "@/types/url";
import { createShortUrl, getUrls, getStatisticsData } from "@/services/api";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUrls = useCallback(async () => {
    const data = await getUrls();
    setUrls(data);
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleShorten = async (url: string) => {
    setIsLoading(true);
    try {
      await createShortUrl(url);
      await fetchUrls();
      setCurrentPage(1);
      toast.success("URL shortened successfully!");
    } catch {
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(urls.length / ITEMS_PER_PAGE);
  const paginatedUrls = urls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statsData = getStatisticsData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <UrlForm onSubmit={handleShorten} isLoading={isLoading} />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent URLs</h2>
          <UrlTable urls={paginatedUrls} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>

        <Statistics data={statsData} />
      </main>
    </div>
  );
}
