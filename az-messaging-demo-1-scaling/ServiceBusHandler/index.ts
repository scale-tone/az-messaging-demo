import { Context } from '@azure/functions'
import { ServiceBusClient } from '@azure/service-bus';

// AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';

import { NumOfEventsToSend } from '../shared';

// Actual processing function
export default async function (context: Context, message: any): Promise<void> {

    // emulating a 100 ms processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    context.log(`ServiceBusHandler got ${message}`);
    appInsights.defaultClient.trackMetric({ name: 'ServiceBusEventProcessed', value: 1 });
};

// Sending a bunch of events at every Function startup
async function SendSomeEventsAtStartup(numOfEvents: number) {

    const client = new ServiceBusClient(process.env['ServiceBusConnection']);
    const sender = client.createSender('input-queue');

    // Expecting all events to fit into one batch
    var batch = await sender.createMessageBatch();
    for (var i = 0; i < numOfEvents; i++) {

        const body = `${new Date().toJSON()}: event${i}`;
        if (!batch.tryAddMessage({ body })) {

            await sender.sendMessages(batch);

            batch = await sender.createMessageBatch();
            batch.tryAddMessage({ body });
        }
    }
    await sender.sendMessages(batch);

    await sender.close();
    await client.close();
}
SendSomeEventsAtStartup(NumOfEventsToSend);