import { Context } from '@azure/functions'

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

// Actual processing function
export default async function (context: Context, eventHubMessages: any[]): Promise<void> {

    for (var msg of eventHubMessages) {

        appInsights.defaultClient.trackMetric({ name: 'EventHubEventProcessed', value: 1 });

        // Filtering out events other than green
        if (msg.eventType !== 'green') {
            continue;
        }

        context.log(`EventHubHandler got green event: ${JSON.stringify(msg)}`);

        // emulating a 100 ms processing delay
        await new Promise(resolve => setTimeout(resolve, 100));

        const eventAgeInSec = Math.floor((new Date().getTime() - new Date(msg.timestamp).getTime()) / 1000);

        appInsights.defaultClient.trackMetric({ name: 'EventHubGreenEventAgeInSec', value: eventAgeInSec });
    }
};
