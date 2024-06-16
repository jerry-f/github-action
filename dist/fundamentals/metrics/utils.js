import { metrics } from './metrics';
export const CallTimer = (scope, name, attrs) => {
    // @ts-expect-error allow
    return (_target, _key, desc) => {
        const originalMethod = desc.value;
        if (!originalMethod) {
            return desc;
        }
        desc.value = async function (...args) {
            const timer = metrics[scope].histogram(name, {
                description: `function call time costs of ${name}`,
                unit: 'ms',
            });
            metrics[scope]
                .counter(`${name}_calls`, {
                description: `function call counts of ${name}`,
            })
                .add(1, attrs);
            const start = Date.now();
            const end = () => {
                timer.record(Date.now() - start, attrs);
            };
            try {
                return await originalMethod.apply(this, args);
            }
            finally {
                end();
            }
        };
        return desc;
    };
};
export const CallCounter = (scope, name, attrs) => {
    // @ts-expect-error allow
    return (_target, _key, desc) => {
        const originalMethod = desc.value;
        if (!originalMethod) {
            return desc;
        }
        desc.value = function (...args) {
            const count = metrics[scope].counter(name, {
                description: `function call counter of ${name}`,
            });
            count.add(1, attrs);
            return originalMethod.apply(this, args);
        };
        return desc;
    };
};
//# sourceMappingURL=utils.js.map