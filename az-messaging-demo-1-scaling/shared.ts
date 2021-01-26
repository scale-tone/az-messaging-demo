
// Initializing AppInsights for sending custom events
import * as appInsights from 'applicationinsights';
appInsights
    .setup(process.env['APPINSIGHTS_INSTRUMENTATIONKEY'])
    .setAutoCollectPerformance(false)
    .start();

export const NumOfEventsToSend = 50000;