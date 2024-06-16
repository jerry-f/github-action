import { set } from 'lodash-es';
/**
 * parse number value from environment variables
 */
function int(value) {
    const n = parseInt(value);
    return Number.isNaN(n) ? undefined : n;
}
function float(value) {
    const n = parseFloat(value);
    return Number.isNaN(n) ? undefined : n;
}
function boolean(value) {
    return value === '1' || value.toLowerCase() === 'true';
}
const envParsers = {
    int,
    float,
    boolean,
    string: value => value,
};
export function parseEnvValue(value, type) {
    if (value === undefined) {
        return;
    }
    return envParsers[type](value);
}
export function applyEnvToConfig(rawConfig) {
    for (const env in rawConfig.ENV_MAP) {
        const config = rawConfig.ENV_MAP[env];
        const [path, value] = typeof config === 'string'
            ? [config, parseEnvValue(process.env[env], 'string')]
            : [config[0], parseEnvValue(process.env[env], config[1] ?? 'string')];
        if (value !== undefined) {
            set(rawConfig, path, value);
        }
    }
}
export function readEnv(env, defaultValue, availableValues) {
    const value = process.env[env];
    if (value === undefined) {
        return defaultValue;
    }
    if (availableValues && !availableValues.includes(value)) {
        throw new Error(`Invalid value '${value}' for environment variable ${env}, expected one of [${availableValues.join(', ')}]`);
    }
    return value;
}
//# sourceMappingURL=env.js.map