import { Context } from '@azure/functions'
import { ServiceBusClient } from '@azure/service-bus';
import { EventHubProducerClient } from '@azure/event-hubs';

import { NumOfEventsToSend } from '../shared';

async function SendToServiceBus(numOfEvents: number) {

    const client = new ServiceBusClient(process.env['ServiceBusConnection']);
    const sender = client.createSender('input');

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

async function SendToEventHub(numOfEvents: number) {

    const client = new EventHubProducerClient(process.env['EventHubsConnection'], 'input');

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

// This will be executed on Function app's startup
export default async function (context: Context, warmupContext: any): Promise<void> {

    await Promise.all([SendToServiceBus(NumOfEventsToSend), SendToEventHub(NumOfEventsToSend)]);
};