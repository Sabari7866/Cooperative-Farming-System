// Weather utilities using free APIs
// - Temperature and 7-day forecast: OpenWeatherMap One Call API 3.0 (free tier)
// - Soil moisture: Open-Meteo (free, no key)
// Ensure you set VITE_OWM_API_KEY in your environment for OpenWeatherMap

export interface DailyForecastSummary {
  date: string;
  tempMinC: number;
  tempMaxC: number;
  rainfallMm: number;
  pop: number; // probability of precipitation 0..1
}

export interface LiveWeather {
  temperatureC: number;
  humidity: number;
  windKph: number;
  soilMoistureVolumetric: number | null; // 0..1 if available
  daily: DailyForecastSummary[];
}

const OWM_BASE = 'https://api.openweathermap.org/data/2.5/onecall';

function kelvinToCelsius(k: number) {
  return Math.round((k - 273.15) * 10) / 10;
}

export async function fetchLiveWeather(lat: number, lon: number): Promise<LiveWeather> {
  const owmKey = import.meta.env.VITE_OWM_API_KEY as string | undefined;
  if (!owmKey) {
    console.warn('VITE_OWM_API_KEY is not set. Temperature/forecast will use fallback.');
  }

  // Fetch OpenWeatherMap forecast if key available
  let temperatureC = 0;
  let humidity = 0;
  let windKph = 0;
  let daily: DailyForecastSummary[] = [];

  if (owmKey) {
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        appid: owmKey,
        exclude: 'minutely,hourly,alerts',
      });
      const res = await fetch(`${OWM_BASE}?${params.toString()}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('OpenWeatherMap API Error:', res.status, errorText);
        throw new Error(`Weather API failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Weather API Response:', data); // Debug log

      temperatureC = kelvinToCelsius(data.current.temp);
      humidity = data.current.humidity;
      windKph = Math.round((data.current.wind_speed || 0) * 3.6 * 10) / 10; // m/s -> km/h
      daily = (data.daily || []).slice(0, 7).map((d: any) => ({
        date: new Date(d.dt * 1000).toISOString().slice(0, 10),
        tempMinC: kelvinToCelsius(d.temp.min),
        tempMaxC: kelvinToCelsius(d.temp.max),
        rainfallMm: Math.round(((d.rain || 0) + (d.snow || 0)) * 10) / 10,
        pop: Math.round(((d.pop || 0) as number) * 100) / 100,
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fall through to use fallback data
    }
  }

  // Fallback data if API key not set or API call failed
  if (!owmKey || temperatureC === 0) {
    // Fallback dummy data when no key
    temperatureC = 28;
    humidity = 60;
    windKph = 8;
    const today = new Date();
    daily = Array.from({ length: 7 }).map((_, i) => {
      const dt = new Date(today.getTime() + i * 86400000);
      return {
        date: dt.toISOString().slice(0, 10),
        tempMinC: 22 + (i % 2),
        tempMaxC: 31 + (i % 3),
        rainfallMm: i % 3 === 0 ? 5 : 0,
        pop: i % 3 === 0 ? 0.6 : 0.2,
      };
    });
  }

  // Soil moisture from Open-Meteo
  // Docs: https://open-meteo.com/en/docs/soil
  let soilMoistureVolumetric: number | null = null;
  try {
    const soilParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      daily: 'soil_moisture_0_to_7cm_mean',
      timezone: 'auto',
    });
    const soilRes = await fetch(`https://api.open-meteo.com/v1/soil?${soilParams.toString()}`);
    if (soilRes.ok) {
      const soilJson = await soilRes.json();
      const series = soilJson?.daily?.soil_moisture_0_to_7cm_mean as number[] | undefined;
      if (series && series.length > 0) {
        // Open-Meteo returns m³/m³; we can take first day as current-ish
        soilMoistureVolumetric = Math.round(series[0] * 1000) / 1000;
      }
    }
  } catch (e) {
    console.warn('Soil moisture fetch failed', e);
  }

  return { temperatureC, humidity, windKph, soilMoistureVolumetric, daily };
}

export function deriveIrrigationAdvice(live: LiveWeather, cropType: string) {
  // Simple heuristic:
  // - If soil moisture < 0.25 m³/m³ and next 2 days rainfall < 5mm total => irrigate tomorrow
  // - If POP > 0.6 on any of next 2 days or rainfall >= 5mm => defer irrigation
  const nextTwo = live.daily.slice(0, 2);
  const totalRain = nextTwo.reduce((s, d) => s + (d.rainfallMm || 0), 0);
  const highPop = nextTwo.some((d) => d.pop >= 0.6);
  const lowMoisture = live.soilMoistureVolumetric !== null && live.soilMoistureVolumetric < 0.25;

  if ((highPop || totalRain >= 5) && !lowMoisture) {
    return {
      action: 'Defer irrigation',
      reason: 'High chance of rainfall in next 48 hours',
      recommendation: 'Monitor rainfall and soil moisture. Reassess after rain event.',
    };
  }
  if (lowMoisture && totalRain < 5) {
    return {
      action: 'Irrigate within 24 hours',
      reason: 'Low soil moisture and low rainfall expected',
      recommendation:
        cropType === 'rice'
          ? 'Maintain 2-3 cm standing water. Apply 20-30 mm irrigation.'
          : 'Apply 25-35 mm irrigation depending on soil type.',
    };
  }
  return {
    action: 'No immediate irrigation needed',
    reason: 'Moisture adequate or moderate rainfall expected',
    recommendation: 'Recheck in 2 days or after field inspection.',
  };
}
