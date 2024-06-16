var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { Config } from '../config';
let URLHelper = class URLHelper {
    constructor(config) {
        this.config = config;
        this.origin = this.config.node.dev
            ? 'http://localhost:8080'
            : `${this.config.server.https ? 'https' : 'http'}://${this.config.server.host}${this.config.server.host === 'localhost' ||
                this.config.server.host === '0.0.0.0'
                ? `:${this.config.server.port}`
                : ''}`;
        this.baseUrl = `${this.origin}${this.config.server.path}`;
        this.home = this.baseUrl;
        this.redirectAllowHosts = [this.baseUrl];
    }
    stringify(query) {
        return new URLSearchParams(query).toString();
    }
    url(path, query = {}) {
        const url = new URL(path, this.origin);
        for (const key in query) {
            url.searchParams.set(key, query[key]);
        }
        return url;
    }
    link(path, query = {}) {
        return this.url(path, query).toString();
    }
    safeRedirect(res, to) {
        try {
            const finalTo = new URL(decodeURIComponent(to), this.baseUrl);
            for (const host of this.redirectAllowHosts) {
                const hostURL = new URL(host);
                if (hostURL.origin === finalTo.origin &&
                    finalTo.pathname.startsWith(hostURL.pathname)) {
                    return res.redirect(finalTo.toString().replace(/\/$/, ''));
                }
            }
        }
        catch {
            // just ignore invalid url
        }
        // redirect to home if the url is invalid
        return res.redirect(this.home);
    }
    verify(url) {
        try {
            if (typeof url === 'string') {
                url = new URL(url);
            }
            if (!['http:', 'https:'].includes(url.protocol))
                return false;
            if (!url.hostname)
                return false;
            return true;
        }
        catch (_) {
            return false;
        }
    }
};
URLHelper = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config])
], URLHelper);
export { URLHelper };
//# sourceMappingURL=url.js.map