import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateNotificationInput } from '../model/create-notification.input';
import { UpdateNotificationInput } from '../model/update-notification.input';
import { NotificationService } from '../service/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() body: CreateNotificationInput) {
    return this.notificationService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateNotificationInput) {
    return this.notificationService.update({ id }, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne({ id });
  }

  @Get()
  find(@Query() query: { userId?: string; targetId?: string }) {
    if (query.userId) {
      return this.notificationService.findByUserId(query.userId);
    } else if (query.targetId) {
      return this.notificationService.findByTargetId(query.targetId);
    }
    throw new BadRequestException();
  }
}
