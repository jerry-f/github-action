import type { Response } from 'express';
import { AvatarStorage } from '../storage';
export declare class UserAvatarController {
    private readonly storage;
    constructor(storage: AvatarStorage);
    getAvatar(res: Response, id: string): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map