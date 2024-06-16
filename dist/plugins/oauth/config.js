import { defineStartupConfig } from '../../fundamentals/config';
export var OAuthProviderName;
(function (OAuthProviderName) {
    OAuthProviderName["Google"] = "google";
    OAuthProviderName["GitHub"] = "github";
    OAuthProviderName["OIDC"] = "oidc";
})(OAuthProviderName || (OAuthProviderName = {}));
defineStartupConfig('plugins.oauth', {
    providers: {},
});
//# sourceMappingURL=config.js.map