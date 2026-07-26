import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getWeather(city: string = 'Dakar') {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');

    if (!apiKey) {
      this.logger.warn('OPENWEATHER_API_KEY not configured');
      return this.fallback(city);
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/weather`, {
          params: {
            q: city,
            appid: apiKey,
            units: 'metric',
            lang: 'fr',
          },
        }),
      );
      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        wind: data.wind.speed,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${city}: ${error.message}`);
      return this.fallback(city);
    }
  }

  private fallback(city: string) {
    return {
      city,
      temperature: 30,
      feelsLike: 32,
      humidity: 65,
      description: 'Ensoleillé',
      icon: 'https://openweathermap.org/img/wn/01d@2x.png',
      wind: 10,
      note: 'Données de démonstration - Configurez votre clé API OpenWeather dans le fichier .env',
    };
  }
}
