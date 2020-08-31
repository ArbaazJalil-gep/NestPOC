import { Request, Response } from "express";
import { QueryBuilderService } from './QueryBuilderService';
import { UpdateBuilderService } from './update-builder/update-builder.service';
export declare class QueryBuilderController {
    private readonly db;
    private readonly aggregationBuilderService;
    private readonly updateBuilderService;
    constructor(db: any, aggregationBuilderService: QueryBuilderService, updateBuilderService: UpdateBuilderService);
    execute(request: Request, response: Response): Promise<void>;
    create(request: Request, response: Response): Promise<void>;
    get(query: any): Promise<any>;
}
