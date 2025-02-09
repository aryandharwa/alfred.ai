import { z } from "zod";
import { ActionProvider } from "../../types";

const weatherResponseSchema = z.object({
  location: z.object({
    name: z.string(),
    region: z.string(),
    country: z.string(),
    localtime: z.string(),
  }),
  current: z.object({
    temp_c: z.number(),
    temp_f: z.number(),
    condition: z.object({
      text: z.string(),
      icon: z.string(),
    }),
    wind_kph: z.number(),
    wind_dir: z.string(),
    humidity: z.number(),
    feelslike_c: z.number(),
    feelslike_f: z.number(),
    vis_km: z.number(),
  }),
});

type WeatherResponse = z.infer<typeof weatherResponseSchema>;

export interface WeatherActionProviderConfig {
  apiKey: string;
}

export const weatherActionProvider = (
  config: WeatherActionProviderConfig
): ActionProvider => {
  const getCurrentWeather = async (location: string): Promise<WeatherResponse> => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${config.apiKey}&q=${encodeURIComponent(location)}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      return weatherResponseSchema.parse(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      throw error;
    }
  };

  return {
    name: "weather",
    description: "Get current weather information for a location",
    actions: [
      {
        name: "getCurrentWeather",
        description: "Get the current weather for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The location to get weather for (city name, coordinates, etc.)",
            },
          },
          required: ["location"],
        },
        handler: async ({ location }) => {
          try {
            const weather = await getCurrentWeather(location);
            return {
              success: true,
              data: {
                location: `${weather.location.name}, ${weather.location.country}`,
                temperature: {
                  celsius: weather.current.temp_c,
                  fahrenheit: weather.current.temp_f,
                },
                condition: weather.current.condition.text,
                feelsLike: {
                  celsius: weather.current.feelslike_c,
                  fahrenheit: weather.current.feelslike_f,
                },
                wind: {
                  speed: weather.current.wind_kph,
                  direction: weather.current.wind_dir,
                },
                humidity: weather.current.humidity,
                visibility: weather.current.vis_km,
                localTime: weather.location.localtime,
              },
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : "Failed to fetch weather data",
            };
          }
        },
      },
    ],
  };
}; 