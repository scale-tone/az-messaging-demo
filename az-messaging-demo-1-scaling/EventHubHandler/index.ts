import { Context } from '@azure/functions'

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

// Actual processing function
export default async function (context: Context, eventHubMessages: any[]): Promise<void> {

    for (var message of eventHubMessages) {

        // emulating a 100 ms processing delay
        await new Promise(resolve => setTimeout(resolve, 100));

        context.log(`EventHubHandler got ${message}`);
        appInsights.defaultClient.trackMetric({ name: 'EventHubEventProcessed', value: 1 });
    }
};