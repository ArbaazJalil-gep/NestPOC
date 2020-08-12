import { Request, Response } from "express";
export declare class UserController {
    private readonly db;
    constructor(db: any);
    create(request: Request, response: Response): Promise<void>;
    get(query: any): Promise<any>;
}
