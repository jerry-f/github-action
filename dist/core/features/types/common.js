import { registerEnumType } from '@nestjs/graphql';
export var FeatureType;
(function (FeatureType) {
    // user feature
    FeatureType["Admin"] = "administrator";
    FeatureType["EarlyAccess"] = "early_access";
    FeatureType["AIEarlyAccess"] = "ai_early_access";
    FeatureType["UnlimitedCopilot"] = "unlimited_copilot";
    // workspace feature
    FeatureType["Copilot"] = "copilot";
    FeatureType["UnlimitedWorkspace"] = "unlimited_workspace";
})(FeatureType || (FeatureType = {}));
registerEnumType(FeatureType, {
    name: 'FeatureType',
    description: 'The type of workspace feature',
});
//# sourceMappingURL=common.js.map