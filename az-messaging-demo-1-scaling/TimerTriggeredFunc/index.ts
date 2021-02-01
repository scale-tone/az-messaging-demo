import { Context } from "@azure/functions"

import { ServiceBusClient } from '@azure/service-bus';
import { EventHubProducerClient } from '@azure/event-hubs';
import { NumOfEventsToSend } from '../shared';

// Sends a bunch of events every second
export default async function (context: Context): Promise<void> {

    await Promise.all([
        SendSomeEventsToEventHub(),
        SendSomeEventsToServiceBus()
    ]);

    context.log(`${NumOfEventsToSend} events sent`);
};

async function SendSomeEventsToEventHub() {

    const client = new EventHubProducerClient(process.env['EventHubsConnection'], 'input-hub');

    var batch = await client.createBatch();
    for (var i = 0; i < NumOfEventsToSend; i++) {

        const body = new Date().toJSON();

        if (!batch.tryAdd({ body })) {

            await client.sendBatch(batch);

            batch = await client.createBatch();
            batch.tryAdd({ body });
        }
    }
    await client.sendBatch(batch);

    await client.close();
}

async function SendSomeEventsToServiceBus() {

    const client = new ServiceBusClient(process.env['ServiceBusConnection']);
    const sender = client.createSender('input-queue');

    // Expecting all events to fit into one batch
    var batch = await sender.createMessageBatch();
    for (var i = 0; i < NumOfEventsToSend; i++) {

        const body = new Date().toJSON();

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
