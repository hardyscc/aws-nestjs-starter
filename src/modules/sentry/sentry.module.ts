import { Module } from '@nestjs/common';

import { SentryService } from './service/sentry.service';

@Module({
  providers: [SentryService],
})
export class SentryModule {}
