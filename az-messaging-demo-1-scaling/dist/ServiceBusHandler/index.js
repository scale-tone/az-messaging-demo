"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// AppInsights for sending custom events
const appInsights = __importStar(require("applicationinsights"));
const shared_1 = require("../shared");
// Sending a bunch of events at every Function startup
function SendSomeEventsAtStartup(numOfEvents) {
    const client = new service_bus_1.ServiceBusClient(process.env['ServiceBusConnection']);
    const sender = client.createSender('input');
    sender.createMessageBatch().then(batch => {
        for (var i = 0; i < 1000; i++) {
            const body = `${new Date().toJSON()}: event${i}`;
            batch.tryAddMessage({ body });
        }
        sender.sendMessages(batch);
    });
    /*
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
    */
}
SendSomeEventsAtStartup(shared_1.NumOfEventsToSend);
// Actual processing function
function default_1(context, message) {
    return __awaiter(this, void 0, void 0, function* () {
        // emulating a 100 ms processing delay
        yield new Promise(resolve => setTimeout(resolve, 100));
        context.log(`ServiceBusHandler got ${message}`);
        appInsights.defaultClient.trackMetric({ name: 'ServiceBusEventProcessed', value: 1 });
    });
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map