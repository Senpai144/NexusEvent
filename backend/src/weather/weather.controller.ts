import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Météo')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtenir la météo d\'une ville' })
  @ApiQuery({ name: 'city', required: false, example: 'Dakar' })
  getWeather(@Query('city') city?: string) {
    return this.weatherService.getWeather(city || 'Dakar');
  }
}
