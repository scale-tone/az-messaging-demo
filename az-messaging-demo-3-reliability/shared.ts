// Initializing AppInsights for sending custom metrics
import * as appInsights from 'applicationinsights';
appInsights
    .setup(process.env['APPINSIGHTS_INSTRUMENTATIONKEY'])
    .setAutoCollectPerformance(false)
    .start();

// Noting the moment of time when application starts
export const StartupTime = new Date();

// How frequently our handlers are going to fail
export const ProbabilityOfFailure = 200;