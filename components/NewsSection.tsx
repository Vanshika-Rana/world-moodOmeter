import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  snippet: string;
  link: string;
}

interface NewsSectionProps {
  selectedCountry: string | null;
  loading: boolean;
  mood: string | null;
  news: NewsItem[];
  moodExplanation: string;
}

const NewsSection = ({
  selectedCountry,
  loading,
  mood,
  news,
  moodExplanation,
}: NewsSectionProps) => {
  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case "positive":
        return "😊";
      case "negative":
        return "😔";
      case "neutral":
        return "😐";
      default:
        return "🤔";
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg border-0">
      <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          {selectedCountry ? (
            <>
              <span className="text-xl font-bold">{selectedCountry}&apos;s Mood</span>
              <span className="text-2xl">{getMoodEmoji(mood)}</span>
            </>
          ) : (
            "Select a Country"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-500 animate-pulse">Analyzing country mood...</p>
          </div>
        ) : selectedCountry ? (
          news.length > 0 ? (
            <div className="space-y-6">
              <Alert
                className={`${
                  mood === "positive"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : mood === "negative"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-yellow-50 border-yellow-200 text-yellow-800"
                } shadow-sm transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-semibold">
                    Current Mood:{" "}
                    {(mood ?? "Unknown").charAt(0).toUpperCase() +
                      (mood ?? "Unknown").slice(1)}
                  </AlertDescription>
                </div>
              </Alert>

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="italic leading-relaxed">{moodExplanation}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Newspaper className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Latest News</h3>
                </div>

                <div className="grid gap-4">
                  {news.map((item, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100"
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                          {item.snippet}
                        </p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium group"
                        >
                          Read full story
                          <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-150">
                            →
                          </span>
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No news found for this country.</p>
          )
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <p className="text-gray-800 font-medium mb-2">
              Select a country on the map
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Click any country to see its current mood analysis based on recent news headlines
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
