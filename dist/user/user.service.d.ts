export declare class UserService {
    aggregationBuilder(schema: any): void;
    matchBuilder(match: any): {};
    builder(query: any, matchObj: any): any;
    quotes(value: any): string;
    projectionBuilder(projections: any): {
        $project: {};
    };
    private SplOpsNone;
    private SplOpsConvert;
    private SplOpsObjectToArray;
    getSeperator(index: any, arr: []): string;
    sortBuilder(sort: any): {
        $sort: {};
    };
}
