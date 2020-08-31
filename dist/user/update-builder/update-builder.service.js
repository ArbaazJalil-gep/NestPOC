"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBuilderService = void 0;
const common_1 = require("@nestjs/common");
let UpdateBuilderService = class UpdateBuilderService {
    build(schema, payload) {
        if (!schema.isMultiple) {
        }
        return this.updateOne(schema, payload);
    }
    updateMany(schema, payload) {
        const filter = {};
        let pay = {};
        schema.criteria.forEach(elem => {
            filter[elem.property] = payload.criteria[elem.property];
        });
        schema.propertiesToUpdate.forEach(elem => {
            pay[elem] = payload.data[elem];
        });
        const updateDoc = {};
        updateDoc["$set"] = pay;
        let updateArr = [];
        const options = { upsert: false };
        updateArr.push(filter, updateDoc, options);
        return updateArr;
    }
    updateOne(schema, payload) {
        const filter = {};
        let pay = {};
        schema.criteria.forEach(elem => {
            filter[elem.property] = payload.criteria[elem.property];
        });
        schema.propertiesToUpdate.forEach(elem => {
            pay[elem] = payload.data[elem];
        });
        const updateDoc = {};
        updateDoc["$set"] = pay;
        let updateArr = [];
        const options = { upsert: false };
        updateArr.push(filter, updateDoc, options);
        return updateArr;
    }
};
UpdateBuilderService = __decorate([
    common_1.Injectable()
], UpdateBuilderService);
exports.UpdateBuilderService = UpdateBuilderService;
//# sourceMappingURL=update-builder.service.js.map