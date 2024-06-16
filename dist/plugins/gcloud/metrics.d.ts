import { Resource } from '@opentelemetry/resources';
import { MetricReader } from '@opentelemetry/sdk-metrics';
import { SpanExporter } from '@opentelemetry/sdk-trace-node';
import { OpentelemetryFactory } from '../../fundamentals/metrics';
export declare class GCloudOpentelemetryFactory extends OpentelemetryFactory {
    getResource(): Resource;
    getMetricReader(): MetricReader;
    getSpanExporter(): SpanExporter;
}
export declare class GCloudMetrics {
}
//# sourceMappingURL=metrics.d.ts.map