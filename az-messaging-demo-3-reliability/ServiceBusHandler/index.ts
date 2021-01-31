import { Context } from "@azure/functions"

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

import { StartupTime, ProbabilityOfFailure } from '../TimerTriggeredFunc';

export default async function (context: Context, msg: any): Promise<void> {

    context.log(`ServiceBusHandler got event: ${JSON.stringify(msg)}`);

    // Failing intermittently
    if (Math.floor((Math.random() * ProbabilityOfFailure)) === 0) {
        throw 'ServiceBusHandler got an intermittent failure';
    }

    const timeSinceStartupInSec = Math.floor((new Date(msg).getTime() - StartupTime.getTime()) / 1000);
    
    appInsights.defaultClient.trackMetric({ name: 'ServiceBusTimeSinceStartup', value: timeSinceStartupInSec });
};