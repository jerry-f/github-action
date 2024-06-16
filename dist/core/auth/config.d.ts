import { ModuleConfig } from '../../fundamentals/config';
export interface AuthStartupConfigurations {
    /**
     * auth session config
     */
    session: {
        /**
         * Application auth expiration time in seconds
         */
        ttl: number;
        /**
         * Application auth time to refresh in seconds
         */
        ttr: number;
    };
    /**
     * Application access token config
     */
    accessToken: {
        /**
         * Application access token expiration time in seconds
         */
        ttl: number;
        /**
         * Application refresh token expiration time in seconds
         */
        refreshTokenTtl: number;
    };
}
export interface AuthRuntimeConfigurations {
    /**
     * Whether allow anonymous users to sign up
     */
    allowSignup: boolean;
    /**
     * Whether require email verification before access restricted resources
     */
    requireEmailVerification: boolean;
    /**
     * The minimum and maximum length of the password when registering new users
     */
    password: {
        min: number;
        max: number;
    };
}
declare module '../../fundamentals/config' {
    interface AppConfig {
        auth: ModuleConfig<AuthStartupConfigurations, AuthRuntimeConfigurations>;
    }
}
//# sourceMappingURL=config.d.ts.map