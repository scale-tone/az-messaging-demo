import { Context } from '@azure/functions'
import { EventHubProducerClient } from '@azure/event-hubs';

// AppInsights for sending custom events
import * as appInsights from 'applicationinsights';

import { NumOfEventsToSend } from '../shared';

// Sending a bunch of events at every Function startup
async function SendSomeEventsAtStartup(numOfEvents: number) {

    const client = new EventHubProducerClient(process.env['EventHubsConnection'], 'input-hub');

    var batch = await client.createBatch();
    for (var i = 0; i < numOfEvents; i++) {

        const body = `${new Date().toJSON()}: event${i}`;
        if (!batch.tryAdd({ body })) {

            await client.sendBatch(batch);

            batch = await client.createBatch();
            batch.tryAdd({ body });
        }
    }
    await client.sendBatch(batch);

    await client.close();
}
SendSomeEventsAtStartup(NumOfEventsToSend);

// Actual processing function
export default async function (context: Context, eventHubMessages: any[]): Promise<void> {

    for (var message of eventHubMessages) {

        // emulating a 100 ms processing delay
        await new Promise(resolve => setTimeout(resolve, 100));

        context.log(`EventHubHandler got ${message}`);
        appInsights.defaultClient.trackMetric({ name: 'EventHubEventProcessed', value: 1 });
    }
};
