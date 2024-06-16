import { ApolloDriverConfig } from '@nestjs/apollo';
import { ModuleConfig } from '../../fundamentals/config';
declare module '../../fundamentals/config' {
    interface AppConfig {
        graphql: ModuleConfig<ApolloDriverConfig>;
    }
}
//# sourceMappingURL=config.d.ts.map