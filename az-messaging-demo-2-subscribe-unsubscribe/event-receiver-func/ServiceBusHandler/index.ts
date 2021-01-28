import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusAdministrationClient } from '@azure/service-bus';

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

export default async function (context: Context, msg: string): Promise<void> {

    const eventAgeInSec = Math.floor((new Date().getTime() - new Date(msg).getTime()) / 1000);
    
    appInsights.defaultClient.trackMetric({ name: 'ServiceBusEventAgeInSec', value: eventAgeInSec });
};

// Re-subscribes to the Service Bus Topic at every startup
async function RecreateSubscriptionAtStartup() {

    const client = new ServiceBusAdministrationClient(process.env['ServiceBusConnection']);

    try {
        
        await client.deleteSubscription('input-topic', 'input-subscription');
        await client.createSubscription('input-topic', 'input-subscription');

    } catch (err) {
        
        console.log(err);
    }


}
// RecreateSubscriptionAtStartup();