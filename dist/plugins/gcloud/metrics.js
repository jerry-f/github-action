var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { GcpDetectorSync } from '@google-cloud/opentelemetry-resource-util';
import { Global } from '@nestjs/common';
import { PeriodicExportingMetricReader, } from '@opentelemetry/sdk-metrics';
import { OptionalModule } from '../../fundamentals';
import { OpentelemetryFactory } from '../../fundamentals/metrics';
export class GCloudOpentelemetryFactory extends OpentelemetryFactory {
    getResource() {
        return super.getResource().merge(new GcpDetectorSync().detect());
    }
    getMetricReader() {
        return new PeriodicExportingMetricReader({
            exportIntervalMillis: 30000,
            exportTimeoutMillis: 10000,
            exporter: new MetricExporter({
                prefix: 'custom.googleapis.com',
            }),
            metricProducers: this.getMetricsProducers(),
        });
    }
    getSpanExporter() {
        return new TraceExporter();
    }
}
const factorProvider = {
    provide: OpentelemetryFactory,
    useFactory: () => new GCloudOpentelemetryFactory(),
};
let GCloudMetrics = class GCloudMetrics {
};
GCloudMetrics = __decorate([
    Global(),
    OptionalModule({
        if: config => config.metrics.enabled,
        overrides: [factorProvider],
    })
], GCloudMetrics);
export { GCloudMetrics };
//# sourceMappingURL=metrics.js.map