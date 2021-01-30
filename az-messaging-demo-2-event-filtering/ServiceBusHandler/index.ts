import { Context } from "@azure/functions"

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

export default async function (context: Context, msg: any): Promise<void> {

    context.log(`ServiceBusHandler got green event: ${JSON.stringify(msg)}`);

    // emulating a 100 ms processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const eventAgeInSec = Math.floor((new Date().getTime() - new Date(msg.timestamp).getTime()) / 1000);
    
    appInsights.defaultClient.trackMetric({ name: 'ServiceBusGreenEventAgeInSec', value: eventAgeInSec });
};