import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Get('summary')
  summary(@CurrentUser() user: { sub: string }) {
    return this.analytics.summary(user.sub);
  }
}
