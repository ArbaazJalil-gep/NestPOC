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
    aggregationBuilder(schema) {
        var projections = schema.Pipes.find(element => element.type === 'project');
        var match = schema.Pipes.find(element => element.type === 'match');
    }
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
        var projectionObj = { "$project": {} };
        var self = this;
        projections.query.forEach(function (item, index) {
            if ('SpecialOps' in item) {
                if (item.SpecialOps.type == "ObjectToArray") {
                    self.SplOpsObjectToArray(projectionObj["$project"], item);
                }
                if (item.SpecialOps.type.toLowerCase() == "convert") {
                    self.SplOpsConvert(projectionObj.$project, item);
                }
            }
            else {
                self.SplOpsNone(projectionObj.$project, item);
            }
        });
        return projectionObj;
    }
    SplOpsNone(projectionObj, item) {
        if (item.alias) {
            projectionObj[item.alias] = '$' + item.key;
        }
        else {
            projectionObj[item.key] = '$' + item.key;
        }
        return projectionObj;
    }
    SplOpsConvert(projectionObj, item) {
        projectionObj[item.alias] = {};
        projectionObj[item.alias][item.SpecialOps.args.operator] = "$" + item.key;
        return projectionObj;
    }
    SplOpsObjectToArray(projectionObj, item) {
        projectionObj[item.alias] = [];
        item.key.forEach(function (itm, ind) {
            projectionObj[item.alias].push(itm);
        });
        return projectionObj;
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
        var sortObj = { "$sort": {} };
        var self = this;
        sort.query.forEach(function (item, index) {
            sortObj["$sort"][`${item.key}`] = item.value;
        });
        return sortObj;
    }
};
UserService = __decorate([
    common_1.Injectable()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map