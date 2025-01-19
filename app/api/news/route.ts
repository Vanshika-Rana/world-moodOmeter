import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { country } = await request.json();

		if (!country) {
			return NextResponse.json(
				{ error: "Country is required" },
				{ status: 400 }
			);
		}

		const params: Record<string, string> = {
			engine: "google_news",
			q: `${country} news`,
			gl: "us",
			hl: "en",
			api_key: process.env.SERPAPI_KEY || "",
		};

		console.log("API Key available:", !!process.env.SERPAPI_KEY);

		const searchParams = new URLSearchParams(params);
		const url = `https://serpapi.com/search?${searchParams.toString()}`;

		const debugUrl = url.replace(
			process.env.SERPAPI_KEY || "",
			"[API_KEY]"
		);
		console.log("Calling URL:", debugUrl);

		const response = await fetch(url);
		console.log("SerpAPI Response Status:", response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("SerpAPI Error:", errorText);
			throw new Error(
				`SerpAPI returned ${response.status}: ${errorText}`
			);
		}

		const data = await response.json();

		if (!data.news_results) {
			console.log("Response data structure:", Object.keys(data));
			throw new Error("No news results in response");
		}

		return NextResponse.json({
			news_results: data.news_results,
		});
	} catch (error) {
		console.error("Detailed error:", error);
		return NextResponse.json(
			{
				error: "Error fetching news",
			},
			{ status: 500 }
		);
	}
}
