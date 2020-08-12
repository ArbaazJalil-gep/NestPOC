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
let UserController = class UserController {
    constructor(db) {
        this.db = db;
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
        const result = await this.db.command({
            find: "persons",
            filter: { gender: "female" },
            projection: { _id: 0, gender: 1, "$name.first": { $concat: [{ $toUpper: "$name.first" }, " ", { $toUpper: "$name.last" }] } }
        });
        console.log(result);
        return result;
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
    __metadata("design:paramtypes", [Object])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map