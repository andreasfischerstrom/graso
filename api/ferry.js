export default async function handler(req, res) {
    const API_KEY = "9588aecb-1460-48ef-8e51-7b5eaa3a3ba7"; // Replace with your actual API key
    const BASE_URL = "https://api.resrobot.se/v2.1/departureBoard";

    const stops = {
        oregrund: "740000470",
        graso: "740001122"
    };

    try {
        // Fetch departures from Öregrund → Gräsö
        const responseToGraso = await fetch(`${BASE_URL}?key=${API_KEY}&id=${stops.oregrund}&direction=${stops.graso}&format=json&maxJourneys=3`);
        const dataToGraso = await responseToGraso.json();

        // Fetch departures from Gräsö → Öregrund
        const responseToOregrund = await fetch(`${BASE_URL}?key=${API_KEY}&id=${stops.graso}&direction=${stops.oregrund}&format=json&maxJourneys=3`);
        const dataToOregrund = await responseToOregrund.json();

        res.status(200).json({
            toGraso: dataToGraso.Departure || [],
            toOregrund: dataToOregrund.Departure || []
        });
    } catch (error) {
        console.error("Error fetching ferry schedule:", error);
        res.status(500).json({ error: "Failed to fetch ferry schedule" });
    }
}
