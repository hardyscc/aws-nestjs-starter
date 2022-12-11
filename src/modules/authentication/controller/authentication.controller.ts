import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateAuthenticationInput } from '../model/create-authentication.input';
import { UpdateAuthenticationInput } from '../model/update-authentication.input';
import { AuthenticationService } from '../service/authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  create(@Body() body: CreateAuthenticationInput) {
    return this.authenticationService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateAuthenticationInput) {
    return this.authenticationService.update({ id }, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenticationService.findOne({ id });
  }

  @Get()
  find(@Query() { userId, targetId }: { userId?: string; targetId?: string }) {
    if (userId && !targetId) {
      return this.authenticationService.findByUserId(userId);
    }
    if (targetId && !userId) {
      return this.authenticationService.findByTargetId(targetId);
    }
    throw new BadRequestException();
  }
}
