"use client";

import React, { useState, useCallback } from "react";
import WorldMap from "react-svg-worldmap";
import { Card, CardContent } from "@/components/ui/card";
import NewsSection from "@/components/NewsSection";

interface NewsItem {
  title: string;
  snippet: string;
  link: string;
}

interface CountryData {
  country: string;
  value: number;
}

interface MoodAnalysis {
  mood: string;
  explanation: string;
}

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function MoodMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [mood, setMood] = useState<string | null>(null);
  const [moodExplanation, setMoodExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<string[]>(countries);

  const getMoodColor = (currentMood: string | null): string => {
    switch (currentMood) {
      case "positive":
        return "#4ade80";
      case "negative":
        return "#ef4444";
      case "neutral":
      default:
        return "#fbbf24";
    }
  };

  const analyzeMoodFromNews = async (newsItems: string[]): Promise<MoodAnalysis> => {
    try {
      const headlines = newsItems.join("\n");
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4",
          messages: [
            {
              role: "user",
              content: `You are an expert sentiment analyst. Analyze the sentiment and infer the general mood of the country. Format your response as:
MOOD: [positive/neutral/negative]
REASON: [A concise explanation].\nHeadlines:\n${headlines}`,
            },
          ],
        }),
      });
      const data = await response.json();
      const analysis = data.choices[0]?.message.content || "";
      const moodMatch = analysis.match(/MOOD:\s*(positive|neutral|negative)/i);
      const reasonMatch = analysis.match(/REASON:\s*(.+)/i);
      const mood = moodMatch ? moodMatch[1].toLowerCase() : "neutral";
      const explanation = reasonMatch ? reasonMatch[1] : "No explanation provided.";
      return { mood, explanation };
    } catch (error) {
      console.error("Error analyzing mood:", error);
      return {
        mood: "neutral",
        explanation: "Unable to analyze mood due to technical issues.",
      };
    }
  };

  const fetchCountryNews = useCallback(async (countryName: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: countryName }),
      });
      const data = await response.json();
      const newsItems: NewsItem[] = data.news_results || [];
      setNews(newsItems);
      const headlines = newsItems.map((item: NewsItem) => item.title);
      const moodAnalysis = await analyzeMoodFromNews(headlines);
      setMood(moodAnalysis.mood);
      setMoodExplanation(moodAnalysis.explanation);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setMood("neutral");
      setMoodExplanation("Unable to analyze mood due to technical issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCountryClick = useCallback(
    (countryCode: string, countryName: string) => {
      setSelectedCountry(countryName);
      fetchCountryNews(countryName);
    },
    [fetchCountryNews]
  );

  const handleWorldMapClick = useCallback(
    (context: { countryCode: string; countryName: string }) => {
      const { countryCode, countryName } = context;
      handleCountryClick(countryCode, countryName);
    },
    [handleCountryClick]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredCountries(
      countries.filter((country) =>
        country.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
    fetchCountryNews(countryName);
    setSearchTerm("");
    setFilteredCountries(countries);
  };

  const mapData: CountryData[] = selectedCountry
    ? [
        {
          country: selectedCountry,
          value: 1,
        },
      ]
    : [];

  return (
    <main className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">🌍 World Mood-O-Meter</h1>
      <div className="w-full max-w-lg mx-auto mb-6">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        {searchTerm && (
          <ul className="mt-2 bg-white shadow-md rounded-md overflow-hidden">
            {filteredCountries.map((country) => (
              <li
                key={country}
                onClick={() => handleCountrySelect(country)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col justify-center items-center space-y-8">
        <Card className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
          <CardContent className="p-8">
            <div className="w-full">
              <WorldMap
                color={getMoodColor(mood)}
                valueSuffix="points"
                size="responsive"
                data={mapData}
                onClickFunction={handleWorldMapClick}
                tooltipTextFunction={(context) => {
                  const countryName = context.countryName;
                  return selectedCountry === countryName
                    ? `${countryName}: Mood - ${mood || "unknown"}`
                    : `Click to analyze ${countryName}`;
                }}
              />
            </div>
          </CardContent>
        </Card>
        <NewsSection
          selectedCountry={selectedCountry}
          loading={loading}
          mood={mood}
          news={news}
          moodExplanation={moodExplanation}
        />
      </div>
    </main>
  );
}
