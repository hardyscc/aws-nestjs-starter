import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

export const SENTRY_DSN_NAME = 'SENTRY_DSN';

@Injectable()
export class SentryService {
  constructor(private readonly configService: ConfigService) {
    if (process.env.NODE_ENV !== 'development') {
      const sentryDns = this.configService.get<string>(SENTRY_DSN_NAME);
      if (!sentryDns) {
        Logger.warn(
          `Missing ${SENTRY_DSN_NAME} environment. Sentry is disabled`,
          'SentryModule',
        );
      } else {
        Sentry.init({
          dsn: sentryDns,
          tracesSampleRate: 1.0,
        });
      }
    }
  }
}
