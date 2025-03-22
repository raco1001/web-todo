import { Controller, Post, Patch, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ReadNameDto } from './dto/read-name.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  async join(@Body() createAuthDto: CreateAuthDto) {
    const result =  await this.authService.join(createAuthDto);
    return {message:'succeeded', userId: result.userId};
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    return await this.authService.login(createAuthDto);
 
  }

  @Get('check')
  async check(@Body() readNameDto: ReadNameDto) {
    return this.authService.check(readNameDto);
  }

  @Patch('reset')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }
}
