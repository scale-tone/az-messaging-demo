import { Context } from '@azure/functions'

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

// Actual processing function
export default async function (context: Context, message: any): Promise<void> {

    // emulating a 100 ms processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    context.log(`ServiceBusHandler got ${message}`);
    appInsights.defaultClient.trackMetric({ name: 'ServiceBusEventProcessed', value: 1 });
};