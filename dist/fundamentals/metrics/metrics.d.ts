import { Counter, Histogram, MetricOptions } from '@opentelemetry/api';
type MetricType = 'counter' | 'gauge' | 'histogram';
type Metric<T extends MetricType> = T extends 'counter' ? Counter : T extends 'gauge' ? Histogram : T extends 'histogram' ? Histogram : never;
export type ScopedMetrics = {
    [T in MetricType]: (name: string, opts?: MetricOptions) => Metric<T>;
};
export type KnownMetricScopes = 'socketio' | 'gql' | 'jwst' | 'auth' | 'controllers' | 'doc';
/**
 * @example
 *
 * ```
 * metrics.scope.counter('example_count').add(1, {
 *   attr1: 'example-event'
 * })
 * ```
 */
export declare const metrics: Record<KnownMetricScopes, ScopedMetrics>;
export declare function stopMetrics(): void;
export {};
//# sourceMappingURL=metrics.d.ts.map