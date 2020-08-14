"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
let UserService = class UserService {
    matchBuilder(match) {
        var matchQueryObj = {};
        matchQueryObj["$match"] = {};
        matchQueryObj["$match"] = this.builder(match.query, matchQueryObj["$match"]);
        return matchQueryObj;
    }
    builder(query, matchObj) {
        var self = this;
        var pos = 0;
        var operandObj;
        query.forEach(function (item, index) {
            if (index == 0) {
                operandObj = matchObj["$" + item] = [];
                pos++;
                return;
            }
            if (Array.isArray(item)) {
                var childQuery = item;
                operandObj.push(self.builder(childQuery, {}));
            }
            else {
                var cond = {};
                cond[item.Property] = {};
                cond[item.Property][item.operator] = item.operatorValue;
                operandObj.push(cond);
                pos++;
            }
        });
        return matchObj;
    }
    ;
    quotes(value) {
        return `"${value}"`;
    }
    projectionBuilder(projections) {
        var self = this;
        var projectionsStr = "";
        projections.query.forEach(function (item, index) {
            var _a, _b;
            var comma = self.getSeperator(index, projections.query);
            if (((_a = item.SpecialOps) === null || _a === void 0 ? void 0 : _a.type) == "ObjectToArray") {
                projectionsStr = self.SplOpsObjectToArray(projectionsStr, item);
                projectionsStr += comma;
            }
            if (((_b = item.SpecialOps) === null || _b === void 0 ? void 0 : _b.type.toLowerCase()) == "convert") {
                projectionsStr = self.SplOpsConvert(projectionsStr, item);
                projectionsStr += comma;
            }
            else {
                projectionsStr = self.SplOpsNone(projectionsStr, item, comma);
            }
        });
        projectionsStr = `{ "$project":{${projectionsStr}} }`;
        var projectionsObj = JSON.parse(projectionsStr);
        return projectionsObj;
    }
    SplOpsNone(projectionsStr, item, comma) {
        if (item.alias) {
            projectionsStr += `"${item.alias}":"$${item.key}"${comma}`;
        }
        else {
            projectionsStr += `"${item.key}":"$${item.key}"${comma}`;
        }
        return projectionsStr;
    }
    SplOpsConvert(projectionsStr, item) {
        var self = this;
        projectionsStr += `"${item.alias}": {"$${item.SpecialOps.args.operator}":"$${item.key}"`;
        projectionsStr += `}`;
        return projectionsStr;
    }
    SplOpsObjectToArray(projectionsStr, item) {
        var self = this;
        projectionsStr += `"${item.alias}": [`;
        item.key.forEach(function (itm, ind) {
            var comma = self.getSeperator(ind, item.key);
            projectionsStr += `"$${itm}"${comma}`;
        });
        projectionsStr += `]`;
        return projectionsStr;
    }
    getSeperator(index, arr) {
        var comma = "";
        if (index < arr.length - 1) {
            comma = ",";
        }
        else {
            comma = "";
        }
        return comma;
    }
    sortBuilder(sort) {
        var sortStr = "";
        sort.query.forEach(function (item, index) {
            if (index < sort.query.length - 1) {
                sortStr += `"${item.key}": ${item.value},`;
            }
            else {
                sortStr += `"${item.key}": ${item.value}`;
            }
        });
        sortStr = `{ "$sort":{${sortStr}} }`;
        var sortObj = JSON.parse(sortStr);
        return sortObj;
    }
};
UserService = __decorate([
    common_1.Injectable()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map