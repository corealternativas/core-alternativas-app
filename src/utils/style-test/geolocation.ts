const REVERSE_GEOCODE_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const getCurrentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation API not available"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 60_000,
    });
  });

export async function getLocationLabel(): Promise<string> {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: "es",
    });

    const response = await fetch(`${REVERSE_GEOCODE_URL}?${params}`);
    if (!response.ok) return "-";

    const data = (await response.json()) as {
      city?: string;
      locality?: string;
      countryName?: string;
    };

    const city = data.city || data.locality || "";
    const country = data.countryName || "";
    const label = [city, country].filter(Boolean).join(", ");
    return label || "-";
  } catch {
    return "-";
  }
}
