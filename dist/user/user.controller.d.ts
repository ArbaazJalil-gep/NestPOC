import { Request, Response } from "express";
import { UserService } from './user.service';
export declare class UserController {
    private readonly db;
    private readonly userService;
    constructor(db: any, userService: UserService);
    create(request: Request, response: Response): Promise<void>;
    get(query: any): Promise<any>;
}
