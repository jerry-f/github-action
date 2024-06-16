import { Attributes } from '@opentelemetry/api';
import { KnownMetricScopes } from './metrics';
export declare const CallTimer: (scope: KnownMetricScopes, name: string, attrs?: Attributes) => MethodDecorator;
export declare const CallCounter: (scope: KnownMetricScopes, name: string, attrs?: Attributes) => MethodDecorator;
//# sourceMappingURL=utils.d.ts.map