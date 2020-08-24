import { Request, Response } from "express";
import { QueryBuilderService } from './QueryBuilderService';
export declare class QueryBuilderController {
    private readonly db;
    private readonly userService;
    constructor(db: any, userService: QueryBuilderService);
    create(request: Request, response: Response): Promise<void>;
    get(query: any): Promise<any>;
}
