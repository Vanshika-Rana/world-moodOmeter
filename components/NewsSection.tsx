import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, AlertCircle, Newspaper, ExternalLink } from "lucide-react";

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

const NewsSection = ({ selectedCountry, loading, mood, news, moodExplanation }: NewsSectionProps) => {
  const getMoodEmoji = (currentMood: string | null) => {
    const moods = {
      positive: "😊",
      negative: "😔",
      neutral: "😐"
    };
    return moods[currentMood as keyof typeof moods] || "🤔";
  };

  const getMoodColor = (currentMood: string | null) => {
    const colors = {
      positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      neutral: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    };
    return colors[currentMood as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  if (!selectedCountry) {
    return (
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-xl">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Select a Country</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              Choose a country from the map or use the search dropdown to analyze its current mood
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-xl">
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{selectedCountry}</span>
            <span className="text-2xl">{getMoodEmoji(mood)}</span>
          </CardTitle>
          <Badge variant="outline" className={getMoodColor(mood)}>
            {mood?.toUpperCase() || "UNKNOWN"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            <Alert className={`${getMoodColor(mood)} border-2`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 font-medium">{moodExplanation}</AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Latest Headlines</h3>
              </div>

              {news.length > 0 ? (
                <div className="grid gap-4">
                  {news.map((item, index) => (
                    <Card key={index} className="group hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.snippet}</p>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium group"
                        >
                          Read more
                          <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No news found for this country.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NewsSection;