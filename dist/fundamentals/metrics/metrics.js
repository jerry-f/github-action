import { getMeter } from './opentelemetry';
const metricCreators = {
    counter(meter, name, opts) {
        return meter.createCounter(name, opts);
    },
    gauge(meter, name, opts) {
        let value;
        let attrs;
        const ob$ = meter.createObservableGauge(name, opts);
        ob$.addCallback(result => {
            result.observe(value, attrs);
        });
        return {
            record: (newValue, newAttrs) => {
                value = newValue;
                attrs = newAttrs;
            },
        };
    },
    histogram(meter, name, opts) {
        return meter.createHistogram(name, opts);
    },
};
const scopes = new Map();
function make(scope) {
    const meter = getMeter();
    const metrics = new Map();
    const prefix = scope + '/';
    function getOrCreate(type, name, opts) {
        name = prefix + name;
        const metric = metrics.get(name);
        if (metric) {
            if (type !== metric.type) {
                throw new Error(`Metric ${name} has already been registered as ${metric.type} mode, but get as ${type} again.`);
            }
            return metric.metric;
        }
        else {
            const metric = metricCreators[type](meter, name, opts);
            metrics.set(name, { type, metric });
            return metric;
        }
    }
    return {
        counter(name, opts) {
            return getOrCreate('counter', name, opts);
        },
        gauge(name, opts) {
            return getOrCreate('gauge', name, opts);
        },
        histogram(name, opts) {
            return getOrCreate('histogram', name, opts);
        },
    };
}
/**
 * @example
 *
 * ```
 * metrics.scope.counter('example_count').add(1, {
 *   attr1: 'example-event'
 * })
 * ```
 */
export const metrics = new Proxy(
// @ts-expect-error proxied
{}, {
    get(_, scopeName) {
        let scope = scopes.get(scopeName);
        if (!scope) {
            scope = make(scopeName);
            scopes.set(scopeName, scope);
        }
        return scope;
    },
});
export function stopMetrics() { }
//# sourceMappingURL=metrics.js.map