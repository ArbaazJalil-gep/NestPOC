"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const QueryBuilderService_1 = require("./QueryBuilderService");
const update_builder_service_1 = require("./update-builder/update-builder.service");
var mongo = require('mongodb');
const BSON = require('bson');
const { EJSON } = require('bson');
let QueryBuilderController = class QueryBuilderController {
    constructor(db, aggregationBuilderService, updateBuilderService) {
        this.db = db;
        this.aggregationBuilderService = aggregationBuilderService;
        this.updateBuilderService = updateBuilderService;
    }
    async execute(request, response) {
        console.log(request.body);
        const result = await this.db.collection("persons").aggregate(EJSON.deserialize(request.body)).toArray();
        response.status(201);
        response.send(result);
    }
    async create(request, response) {
        this.db.collection('users').insertOne(request.body, (err, result) => {
            if (err) {
                response.status(500).json(err);
            }
            else {
                response.status(201);
                response.send(result);
            }
        });
    }
    async get(query) {
        const schema = {
            type: 'get',
            isMultiple: false,
            database: "person",
            Pipes: [
                {
                    type: "match",
                    query: [
                        "or",
                        [
                            "and",
                            {
                                "Collection": "persons",
                                "Property": "gender",
                                "operator": "$eq",
                                "operatorValue": [
                                    "female"
                                ]
                            },
                            {
                                "Collection": "persons",
                                "Property": "dob.age",
                                "operator": "$gt",
                                "operatorValue": [
                                    "$registered.age"
                                ]
                            }
                        ],
                        {
                            "Collection": "persons",
                            "Property": "_id",
                            "operator": "$eq",
                            "operatorValue": [
                                "5f3258cfbaaccedaa5dd2d96"
                            ]
                        }
                    ]
                },
                {
                    type: "match",
                    query: [
                        "and",
                        {
                            "Collection": "persons",
                            "Property": "dob.age",
                            "operator": "$gte",
                            "operatorValue": [
                                60
                            ]
                        }
                    ]
                },
                {
                    type: "project",
                    query: [
                        {
                            collection: "persons",
                            key: "_id"
                        },
                        {
                            collection: "persons",
                            key: "name.first",
                            alias: "fname"
                        },
                        {
                            collection: "persons",
                            key: "name.last",
                            alias: "lname"
                        },
                        {
                            collection: "persons",
                            key: "gender",
                            alias: "gender"
                        },
                        {
                            collection: "persons",
                            key: "dob.age",
                            alias: "dobage"
                        },
                        {
                            collection: "persons",
                            key: "registered.age",
                            alias: "registeredAge"
                        },
                        {
                            collection: "persons",
                            key: "location.coordinates.latitude",
                            SpecialOps: {
                                type: "Convert",
                                args: {
                                    operator: "toInt"
                                }
                            },
                            alias: "lat"
                        },
                        {
                            collection: "persons",
                            key: "location.coordinates.longitude",
                            SpecialOps: {
                                type: "Convert",
                                args: {
                                    operator: "toInt"
                                }
                            },
                            alias: "long"
                        }
                    ]
                },
                {
                    type: "sort",
                    query: [
                        {
                            key: "name.first",
                            value: 1
                        }
                    ]
                },
                {
                    type: "pagination",
                    query: {
                        pageSize: 5,
                        page: 3
                    }
                },
                {
                    type: "join",
                    query: {
                        from: "linedeatils",
                        localField: "_id",
                        foreignField: "personid",
                        as: "persondetail"
                    }
                },
                {
                    type: "group",
                    query: {
                        "_id": [
                            {
                                collection: "persons",
                                key: "dobage",
                                alias: "dobAge"
                            },
                            {
                                collection: "persons",
                                key: "gender",
                                alias: "Gender"
                            }
                        ],
                        "accumulators": [
                            {
                                alias: "total",
                                accumulator: "sum",
                                accumulatorValue: 1
                            }
                        ],
                        "$sum": 1
                    }
                }
            ]
        };
        if (schema.type === 'get') {
            var mquery = this.aggregationBuilderService.aggregationBuilder(schema);
            console.clear();
            console.log(JSON.stringify(mquery));
            var serialized = (EJSON.serialize(mquery));
            console.log('----', serialized);
            const result = await this.db.collection("persons").aggregate(mquery).toArray();
            return serialized;
        }
        if (schema.type === 'update' && !schema.isMultiple) {
            let payload = {
                criteria: { "phone": "23138213" },
                data: {
                    "nat": "DK4",
                    "info.publisher": "44",
                    "login.password": "up1"
                }
            };
            var mquery = this.updateBuilderService.build(schema, payload);
            console.log(JSON.stringify(mquery));
            const result = await this.db.collection("persons").updateOne(...mquery);
            var serialized = (EJSON.serialize(mquery));
            return result;
        }
        if (schema.type === 'update' && schema.isMultiple) {
            let payload = {
                criteria: { "phone": "23138213" },
                data: [{
                        "nat": "DK4",
                        "info.publisher": "44",
                        "login.password": "up1"
                    }]
            };
            var mquery = this.updateBuilderService.build(schema, payload);
            const result = await this.db.collection("persons").find(mquery).toArray();
            return serialized;
        }
    }
};
__decorate([
    common_1.Post("execute"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QueryBuilderController.prototype, "execute", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QueryBuilderController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QueryBuilderController.prototype, "get", null);
QueryBuilderController = __decorate([
    common_1.Controller('user'),
    __param(0, common_1.Inject(constants_1.MONGODB_PROVIDER)),
    __metadata("design:paramtypes", [Object, QueryBuilderService_1.QueryBuilderService,
        update_builder_service_1.UpdateBuilderService])
], QueryBuilderController);
exports.QueryBuilderController = QueryBuilderController;
//# sourceMappingURL=QueryBuilder.controller.js.map