import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusAdministrationClient } from '@azure/service-bus';

// Initializing AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';
appInsights
    .setup(process.env['APPINSIGHTS_INSTRUMENTATIONKEY'])
    .setAutoCollectPerformance(false)
    .start();

export default async function (context: Context, warmupContext: any): Promise<void> {

    const client = new ServiceBusAdministrationClient(process.env['ServiceBusConnection']);

    try {
        await client.deleteSubscription('input-topic', 'input-subscription');
    } catch (err) {
        context.log(`>>> Failed to delete subscription: ${err}`);
    }

    try {
        await client.createSubscription('input-topic', 'input-subscription');
    } catch (err) {
        context.log(`>>> Failed to create subscription: ${err}`);
    }

    context.log(`>>> Subscription recreated`);
};