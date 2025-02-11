"use client";

import React, { useState, useCallback } from "react";
import WorldMap from "react-svg-worldmap";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Globe, ChevronsUpDown } from "lucide-react";
import NewsSection from "@/components/NewsSection";
import Footer from "./Footer";
interface NewsItem {
	title: string;
	snippet: string;
	link: string;
}

interface CountryData {
	country: string;
	value: number;
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

const MoodMap = () => {
	const [filteredCountries, setFilteredCountries] =
		useState<string[]>(countries);
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
	const [news, setNews] = useState<NewsItem[]>([]);
	const [mood, setMood] = useState<string | null>(null);
	const [moodExplanation, setMoodExplanation] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const getMoodColor = (currentMood: string | null): string => {
		switch (currentMood) {
			case "positive":
				return "#22c55e";
			case "negative":
				return "#ef4444";
			case "neutral":
			default:
				return "#f59e0b";
		}
	};

	const analyzeMoodFromNews = async (newsItems: string[]) => {
		try {
			const headlines = newsItems.join("\n");
			const response = await fetch(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${
							process.env.NEXT_PUBLIC_OPENROUTER_KEY || ""
						}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "openai/gpt-4",
						messages: [
							{
								role: "user",
								content: `You are an expert sentiment analyst. Analyze the sentiment and infer the general mood of the country. Format your response as below.
											Please focus on:
											- If majority bublic sentiment is postive, then give positive only.
											- Overall public sentiment
											- Economic indicators
											- Social/political stability
											- Major events' impact
											- simple language, not too many jargons

											
											Required format:
											MOOD: [positive/neutral/negative]
											REASON: [A concise explanation]
											HEADLINES: ${headlines}

											
											`,
							},
						],
					}),
				}
			);
			const data = await response.json();
			const analysis = data.choices[0]?.message.content || "";
			const moodMatch = analysis.match(
				/MOOD:\s*(positive|neutral|negative)/i
			);
			const reasonMatch = analysis.match(/REASON:\s*(.+)/i);
			return {
				mood: moodMatch ? moodMatch[1].toLowerCase() : "neutral",
				explanation: reasonMatch
					? reasonMatch[1]
					: "No explanation provided.",
			};
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
				headers: { "Content-Type": "application/json" },
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
			setMoodExplanation(
				"Unable to analyze mood due to technical issues."
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleCountrySelect = useCallback(
		(countryName: string) => {
			setSelectedCountry(countryName);
			fetchCountryNews(countryName);
			setOpen(false);
		},
		[fetchCountryNews]
	);

	const handleWorldMapClick = useCallback(
		(context: { countryCode: string; countryName: string }) => {
			const { countryName } = context;
			handleCountrySelect(countryName);
		},
		[handleCountrySelect]
	);

	const mapData: CountryData[] = selectedCountry
		? [{ country: selectedCountry, value: 1 }]
		: [];

	return (
		<div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
			<main className='container mx-auto px-4 py-6 flex flex-col gap-8'>
				<div className='text-center'>
					<h1 className='text-2xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400'>
						World Mood-O-Meter
					</h1>
					<p className='text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-lg mx-auto mt-2'>
						Explore the mood of the world!
					</p>
				</div>

				<div className='w-full max-w-md mx-auto'>
					<div className='relative'>
						<div
							onClick={() => setOpen(!open)}
							className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer'>
							<span className='text-gray-700 dark:text-gray-200'>
								{selectedCountry ?? "Select a country..."}
							</span>
							<ChevronsUpDown className='h-4 w-4 text-gray-500' />
						</div>

						{open && (
							<div className='absolute mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50'>
								<input
									type='text'
									placeholder='Search country...'
									className='w-full px-4 py-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none'
									onChange={(e) => {
										const searchTerm =
											e.target.value.toLowerCase();
										const filtered = countries.filter(
											(country) =>
												country
													.toLowerCase()
													.includes(searchTerm)
										);
										setFilteredCountries(filtered);
									}}
								/>
								<div className='max-h-64 overflow-y-auto'>
									{filteredCountries.map((country) => (
										<div
											key={country}
											onClick={() =>
												handleCountrySelect(country)
											}
											className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
											<Globe className='h-4 w-4 text-gray-500 inline mr-2' />
											<span className='text-gray-700 dark:text-gray-200'>
												{country}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className='grid gap-8 lg:grid-cols-2'>
					<Card className='backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg overflow-x-auto'>
						<CardHeader>
							<CardTitle>Interactive World Map</CardTitle>
							<CardDescription>
								Click on any country to analyze its mood.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='aspect-video'>
								<WorldMap
									color={getMoodColor(mood)}
									valueSuffix='points'
									size='responsive'
									data={mapData}
									onClickFunction={handleWorldMapClick}
									backgroundColor='transparent'
									borderColor='#374151'
									tooltipTextFunction={(context) => {
										const countryName = context.countryName;
										return selectedCountry === countryName
											? `${countryName}: ${
													mood || "unknown"
											  } mood`
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
			<Footer />
		</div>
	);
};

export default MoodMap;
