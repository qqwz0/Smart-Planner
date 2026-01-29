import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analytics;
    constructor(analytics: AnalyticsService);
    summary(user: {
        sub: string;
    }): Promise<{
        total: number;
        done: number;
        byStatus: {
            [k: string]: number;
        };
    }>;
}
