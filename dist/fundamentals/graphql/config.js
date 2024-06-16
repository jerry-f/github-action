import { defineStartupConfig } from '../../fundamentals/config';
defineStartupConfig('graphql', {
    buildSchemaOptions: {
        numberScalarMode: 'integer',
    },
    introspection: true,
    playground: true,
});
//# sourceMappingURL=config.js.map