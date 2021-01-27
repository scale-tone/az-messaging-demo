import { Context } from "@azure/functions"

import { ServiceBusClient } from '@azure/service-bus';
import { EventHubProducerClient } from '@azure/event-hubs';

export default async function (context: Context): Promise<void> {

    const eventBody = new Date().toJSON();

    await SendEventHubEvent(eventBody);
    await SendServiceBusEvent(eventBody);

    context.log(`Event ${eventBody} sent`);
};

async function SendServiceBusEvent(body: string) {

    const client = new ServiceBusClient(process.env['ServiceBusConnection']);
    const sender = client.createSender('input-topic');

    await sender.sendMessages({ body });

    await sender.close();
    await client.close();    
}

async function SendEventHubEvent(body: string) {
    
    const client = new EventHubProducerClient(process.env['EventHubsConnection'], 'input-hub');

    const batch = await client.createBatch();
    batch.tryAdd({ body });
    await client.sendBatch(batch);

    await client.close();
}