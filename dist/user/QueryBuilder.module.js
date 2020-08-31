"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderModule = void 0;
const common_1 = require("@nestjs/common");
const QueryBuilder_controller_1 = require("./QueryBuilder.controller");
const QueryBuilderService_1 = require("./QueryBuilderService");
const mongo_db_module_1 = require("../mongo-db/mongo-db.module");
const update_builder_service_1 = require("./update-builder/update-builder.service");
let QueryBuilderModule = class QueryBuilderModule {
};
QueryBuilderModule = __decorate([
    common_1.Module({
        imports: [mongo_db_module_1.MongoDbModule],
        controllers: [QueryBuilder_controller_1.QueryBuilderController],
        providers: [QueryBuilderService_1.QueryBuilderService, update_builder_service_1.UpdateBuilderService]
    })
], QueryBuilderModule);
exports.QueryBuilderModule = QueryBuilderModule;
//# sourceMappingURL=QueryBuilder.module.js.map