var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { BadRequestException, Injectable, NotAcceptableException, } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';
import { assign, omit } from 'lodash-es';
import { Config, CryptoHelper, MailService } from '../../fundamentals';
import { FeatureManagementService } from '../features/management';
import { QuotaService } from '../quota/service';
import { QuotaType } from '../quota/types';
import { UserService } from '../user/service';
export function parseAuthUserSeqNum(value) {
    let seq = 0;
    switch (typeof value) {
        case 'number': {
            seq = value;
            break;
        }
        case 'string': {
            const result = value.match(/^([\d{0, 10}])$/);
            if (result?.[1]) {
                seq = Number(result[1]);
            }
            break;
        }
        default: {
            seq = 0;
        }
    }
    return Math.max(0, seq);
}
export function sessionUser(user) {
    return assign(omit(user, 'password', 'registered', 'emailVerifiedAt', 'createdAt'), {
        hasPassword: user.password !== null,
        emailVerified: user.emailVerifiedAt !== null,
    });
}
let AuthService = class AuthService {
    static { AuthService_1 = this; }
    static { this.sessionCookieName = 'affine_session'; }
    static { this.authUserSeqHeaderName = 'x-auth-user'; }
    constructor(config, db, mailer, feature, quota, user, crypto) {
        this.config = config;
        this.db = db;
        this.mailer = mailer;
        this.feature = feature;
        this.quota = quota;
        this.user = user;
        this.crypto = crypto;
        this.cookieOptions = {
            sameSite: 'lax',
            httpOnly: true,
            path: '/',
            secure: this.config.server.https,
        };
    }
    async onApplicationBootstrap() {
        if (this.config.node.dev) {
            try {
                const [email, name, pwd] = ['dev@affine.pro', 'Dev User', 'dev'];
                let devUser = await this.user.findUserByEmail(email);
                if (!devUser) {
                    devUser = await this.user.createUser({
                        email,
                        name,
                        password: await this.crypto.encryptPassword(pwd),
                    });
                }
                await this.quota.switchUserQuota(devUser.id, QuotaType.ProPlanV1);
                await this.feature.addAdmin(devUser.id);
                await this.feature.addCopilot(devUser.id);
            }
            catch (e) {
                // ignore
            }
        }
    }
    canSignIn(email) {
        return this.feature.canEarlyAccess(email);
    }
    async signUp(name, email, password) {
        const user = await this.user.findUserByEmail(email);
        if (user) {
            throw new BadRequestException('Email was taken');
        }
        const hashedPassword = await this.crypto.encryptPassword(password);
        return this.user
            .createUser({
            name,
            email,
            password: hashedPassword,
        })
            .then(sessionUser);
    }
    async signIn(email, password) {
        const user = await this.user.findUserWithHashedPasswordByEmail(email);
        if (!user) {
            throw new NotAcceptableException('Invalid sign in credentials');
        }
        if (!user.password) {
            throw new NotAcceptableException('User Password is not set. Should login through email link.');
        }
        const passwordMatches = await this.crypto.verifyPassword(password, user.password);
        if (!passwordMatches) {
            throw new NotAcceptableException('Invalid sign in credentials');
        }
        return sessionUser(user);
    }
    async getUser(token, seq = 0) {
        const session = await this.getSession(token);
        // no such session
        if (!session) {
            return { user: null, expiresAt: null };
        }
        const userSession = session.userSessions.at(seq);
        // no such user session
        if (!userSession) {
            return { user: null, expiresAt: null };
        }
        // user session expired
        if (userSession.expiresAt && userSession.expiresAt <= new Date()) {
            return { user: null, expiresAt: null };
        }
        const user = await this.db.user.findUnique({
            where: { id: userSession.userId },
        });
        if (!user) {
            return { user: null, expiresAt: null };
        }
        return { user: sessionUser(user), expiresAt: userSession.expiresAt };
    }
    async getUserList(token) {
        const session = await this.getSession(token);
        if (!session || !session.userSessions.length) {
            return [];
        }
        const users = await this.db.user.findMany({
            where: {
                id: {
                    in: session.userSessions.map(({ userId }) => userId),
                },
            },
        });
        // TODO(@forehalo): need to separate expired session, same for [getUser]
        // Session
        //   | { user: LimitedUser { email, avatarUrl }, expired: true }
        //   | { user: User, expired: false }
        return session.userSessions
            .map(userSession => {
            // keep users in the same order as userSessions
            const user = users.find(({ id }) => id === userSession.userId);
            if (!user) {
                return null;
            }
            return sessionUser(user);
        })
            .filter(Boolean);
    }
    async signOut(token, seq = 0) {
        const session = await this.getSession(token);
        if (session) {
            // overflow the logged in user
            if (session.userSessions.length <= seq) {
                return session;
            }
            await this.db.userSession.deleteMany({
                where: { id: session.userSessions[seq].id },
            });
            // no more user session active, delete the whole session
            if (session.userSessions.length === 1) {
                await this.db.session.delete({ where: { id: session.id } });
                return null;
            }
            return session;
        }
        return null;
    }
    async getSession(token) {
        if (!token) {
            return null;
        }
        return this.db.$transaction(async (tx) => {
            const session = await tx.session.findUnique({
                where: {
                    id: token,
                },
                include: {
                    userSessions: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            });
            if (!session) {
                return null;
            }
            if (session.expiresAt && session.expiresAt <= new Date()) {
                await tx.session.delete({
                    where: {
                        id: session.id,
                    },
                });
                return null;
            }
            return session;
        });
    }
    async refreshUserSessionIfNeeded(_req, res, sessionId, userId, expiresAt, ttr = this.config.auth.session.ttr) {
        if (expiresAt && expiresAt.getTime() - Date.now() > ttr * 1000) {
            // no need to refresh
            return false;
        }
        const newExpiresAt = new Date(Date.now() + this.config.auth.session.ttl * 1000);
        await this.db.userSession.update({
            where: {
                sessionId_userId: {
                    sessionId,
                    userId,
                },
            },
            data: {
                expiresAt: newExpiresAt,
            },
        });
        res.cookie(AuthService_1.sessionCookieName, sessionId, {
            expires: newExpiresAt,
            ...this.cookieOptions,
        });
        return true;
    }
    async createUserSession(user, existingSession, ttl = this.config.auth.session.ttl) {
        const session = existingSession
            ? await this.getSession(existingSession)
            : null;
        const expiresAt = new Date(Date.now() + ttl * 1000);
        if (session) {
            return this.db.userSession.upsert({
                where: {
                    sessionId_userId: {
                        sessionId: session.id,
                        userId: user.id,
                    },
                },
                update: {
                    expiresAt,
                },
                create: {
                    sessionId: session.id,
                    userId: user.id,
                    expiresAt,
                },
            });
        }
        else {
            return this.db.userSession.create({
                data: {
                    expiresAt,
                    session: {
                        create: {},
                    },
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        }
    }
    async revokeUserSessions(userId, sessionId) {
        return this.db.userSession.deleteMany({
            where: {
                userId,
                sessionId,
            },
        });
    }
    async setCookie(_req, res, user) {
        const session = await this.createUserSession(user
        // TODO(@forehalo): enable multi user session
        // req.cookies[AuthService.sessionCookieName]
        );
        res.cookie(AuthService_1.sessionCookieName, session.sessionId, {
            expires: session.expiresAt ?? void 0,
            ...this.cookieOptions,
        });
    }
    async changePassword(id, newPassword) {
        const user = await this.user.findUserById(id);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        const hashedPassword = await this.crypto.encryptPassword(newPassword);
        return this.user.updateUser(user.id, { password: hashedPassword });
    }
    async changeEmail(id, newEmail) {
        const user = await this.user.findUserById(id);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }
        return this.user.updateUser(id, {
            email: newEmail,
            emailVerifiedAt: new Date(),
        });
    }
    async setEmailVerified(id) {
        return await this.user.updateUser(id, { emailVerifiedAt: new Date() }, { emailVerifiedAt: true });
    }
    async sendChangePasswordEmail(email, callbackUrl) {
        return this.mailer.sendChangePasswordEmail(email, callbackUrl);
    }
    async sendSetPasswordEmail(email, callbackUrl) {
        return this.mailer.sendSetPasswordEmail(email, callbackUrl);
    }
    async sendChangeEmail(email, callbackUrl) {
        return this.mailer.sendChangeEmail(email, callbackUrl);
    }
    async sendVerifyChangeEmail(email, callbackUrl) {
        return this.mailer.sendVerifyChangeEmail(email, callbackUrl);
    }
    async sendVerifyEmail(email, callbackUrl) {
        return this.mailer.sendVerifyEmail(email, callbackUrl);
    }
    async sendNotificationChangeEmail(email) {
        return this.mailer.sendNotificationChangeEmail(email);
    }
    async sendSignInEmail(email, link, signUp) {
        return signUp
            ? await this.mailer.sendSignUpMail(link.toString(), {
                to: email,
            })
            : await this.mailer.sendSignInMail(link.toString(), {
                to: email,
            });
    }
    async cleanExpiredSessions() {
        await this.db.session.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date(),
                },
            },
        });
        await this.db.userSession.deleteMany({
            where: {
                expiresAt: {
                    lte: new Date(),
                },
            },
        });
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "cleanExpiredSessions", null);
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Config,
        PrismaClient,
        MailService,
        FeatureManagementService,
        QuotaService,
        UserService,
        CryptoHelper])
], AuthService);
export { AuthService };
//# sourceMappingURL=service.js.map