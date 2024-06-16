import { OnModuleDestroy } from '@nestjs/common';
import { Instrumentation } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { MetricProducer, MetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SpanExporter } from '@opentelemetry/sdk-trace-node';
export declare abstract class OpentelemetryFactory {
    abstract getMetricReader(): MetricReader;
    abstract getSpanExporter(): SpanExporter;
    getInstractions(): Instrumentation[];
    getMetricsProducers(): MetricProducer[];
    getResource(): Resource;
    create(): NodeSDK;
}
export declare class LocalOpentelemetryFactory extends OpentelemetryFactory implements OnModuleDestroy {
    private readonly metricsExporter;
    onModuleDestroy(): Promise<void>;
    getMetricReader(): MetricReader;
    getSpanExporter(): SpanExporter;
}
export declare function registerCustomMetrics(): void;
export declare function getMeter(name?: string): import("@opentelemetry/api").Meter;
//# sourceMappingURL=opentelemetry.d.ts.map