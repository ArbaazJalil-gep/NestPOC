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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(db, userService) {
        this.db = db;
        this.userService = userService;
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
            database: "person",
            projections: [
                {
                    CollectionsWithProperties: [
                        {
                            "persons": [
                                "name.first",
                                "gender",
                                "phone"
                            ]
                        }
                    ]
                }
            ],
            Pipes: [{
                    type: "match",
                    query: [
                        "or",
                        {
                            "Collection": "persons",
                            "Property": "phone",
                            "operator": "$eq",
                            "operatorValue": "23138213"
                        },
                        [
                            "and",
                            {
                                "Collection": "persons",
                                "Property": "gender",
                                "operator": "$eq",
                                "operatorValue": "female"
                            },
                            {
                                "Collection": "persons",
                                "Property": "location.city",
                                "operator": "$eq",
                                "operatorValue": "jasper"
                            }
                        ]
                    ]
                },
                {
                    type: "project",
                    query: [{ collection: "persons", key: "_id" }, { collection: "persons", key: "gender" }, { collection: "persons", key: "phone", alias: "mobile" },
                        { collection: "persons", key: "location.coordinates.longitude" }, { collection: "persons", key: "location.coordinates.latitude" },
                        { collection: "persons", key: "name.first", alias: "VeryFirstName" }, { collection: "persons", key: "name.last" },
                        { collection: "persons", key: ["name.first", "name.last"], SpecialOps: "ObjectToArray", alias: "flatNameArray" },
                        { collection: "persons", key: "name.last", alias: "thelastName" }
                    ]
                },
                {
                    type: "sort",
                    query: [{ key: "name.first", value: -1 }]
                },
            ],
        };
        if (schema.type === 'get') {
            var projections = schema.Pipes.find(element => element.type === 'project');
            var match = schema.Pipes.find(element => element.type === 'match');
            var sort = schema.Pipes.find(element => element.type === 'sort');
            var collection = projections.query[0]["collection"];
            var projectionsMql = this.userService.projectionBuilder(projections);
            var matchMql = this.userService.matchBuilder(match);
            var sortMql = this.userService.sortBuilder(sort);
            console.log(JSON.stringify(projectionsMql));
            const result = await this.db.collection(collection).aggregate([
                matchMql,
                projectionsMql,
                sortMql
            ]).toArray();
            return result;
        }
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
UserController = __decorate([
    common_1.Controller('user'),
    __param(0, common_1.Inject(constants_1.MONGODB_PROVIDER)),
    __metadata("design:paramtypes", [Object, user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map