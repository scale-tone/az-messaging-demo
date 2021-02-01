"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_bus_1 = require("@azure/service-bus");
const event_hubs_1 = require("@azure/event-hubs");
const shared_1 = require("../shared");
// Sends a bunch of events every second
function default_1(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            SendSomeEventsToEventHub(),
            SendSomeEventsToServiceBus()
        ]);
        context.log(`${shared_1.NumOfEventsToSend} events sent`);
    });
}
exports.default = default_1;
;
function SendSomeEventsToEventHub() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new event_hubs_1.EventHubProducerClient(process.env['EventHubsConnection'], 'input-hub');
        var batch = yield client.createBatch();
        for (var i = 0; i < shared_1.NumOfEventsToSend; i++) {
            // Some rare event is expected to be green, others should be red.
            const eventType = Math.floor((Math.random() * shared_1.ProbabilityOfGreenEvent)) === 0 ? 'green' : 'red';
            const body = {
                timestamp: new Date().toJSON(),
                eventType
            };
            if (!batch.tryAdd({ body })) {
                yield client.sendBatch(batch);
                batch = yield client.createBatch();
                batch.tryAdd({ body });
            }
        }
        yield client.sendBatch(batch);
        yield client.close();
    });
}
function SendSomeEventsToServiceBus() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new service_bus_1.ServiceBusClient(process.env['ServiceBusConnection']);
        const sender = client.createSender('input-topic');
        // Expecting all events to fit into one batch
        var batch = yield sender.createMessageBatch();
        for (var i = 0; i < shared_1.NumOfEventsToSend; i++) {
            // Some rare event is expected to be green, others should be red.
            const eventType = Math.floor((Math.random() * shared_1.ProbabilityOfGreenEvent)) === 0 ? 'green' : 'red';
            const msg = {
                body: {
                    timestamp: new Date().toJSON()
                },
                subject: eventType
            };
            if (!batch.tryAddMessage(msg)) {
                yield sender.sendMessages(batch);
                batch = yield sender.createMessageBatch();
                batch.tryAddMessage(msg);
            }
        }
        yield sender.sendMessages(batch);
        yield sender.close();
        yield client.close();
    });
}
//# sourceMappingURL=index.js.map