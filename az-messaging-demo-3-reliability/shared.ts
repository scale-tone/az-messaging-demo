// Initializing AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';
appInsights
    .setup(process.env['APPINSIGHTS_INSTRUMENTATIONKEY'])
    .setAutoCollectPerformance(false)
    .start();

// Noting the startup moment of time
export const StartupTime = new Date();

// How frequently our handlers are going to fail
export const ProbabilityOfFailure = 1000;