import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Accueil')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: "Message d'accueil de l'API" })
  getHello() {
    return this.appService.getHello();
  }
}
