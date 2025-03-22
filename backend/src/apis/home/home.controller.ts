import { Controller, Get, Body } from '@nestjs/common';
import { HomeService } from './home.service';
import { ReadPageDto } from './dto/read-page.dto';

@Controller('/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('')
  async getPage(@Body() readPageDto: ReadPageDto) {
    return this.homeService.findAll(readPageDto);
  }
}
