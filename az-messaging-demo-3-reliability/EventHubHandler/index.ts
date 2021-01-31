import { Context } from '@azure/functions'

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

import { StartupTime, ProbabilityOfFailure } from '../shared';

// Actual processing function
export default async function (context: Context, eventHubMessages: any[]): Promise<void> {

    for (var msg of eventHubMessages) {

        context.log(`EventHubHandler got event: ${JSON.stringify(msg)}`);

        // Failing intermittently
        if (Math.floor((Math.random() * ProbabilityOfFailure)) === 0) {
//            throw 'EventHubHandler got an intermittent failure';
        }

        const timeSinceStartupInSec = Math.floor((new Date(msg).getTime() - StartupTime.getTime()) / 1000);

        appInsights.defaultClient.trackMetric({ name: 'EventHubTimeSinceStartup', value: timeSinceStartupInSec });
    }
};
