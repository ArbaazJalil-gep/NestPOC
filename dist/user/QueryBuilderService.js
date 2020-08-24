"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderService = void 0;
const common_1 = require("@nestjs/common");
let ObjectId = require('mongodb').ObjectID;
let QueryBuilderService = class QueryBuilderService {
    aggregationBuilder(schema) {
        let self = this;
        let aggregationObj = [];
        aggregationObj.push(self.matchBuilder(schema.Pipes.find(element => element.type === 'match')));
        let facetObj = {
            "$facet": {
                "totalCount": [
                    {
                        "$count": "value"
                    }
                ], "data": []
            }
        };
        aggregationObj.push(facetObj);
        schema.Pipes.forEach((item, index) => {
            switch (item.type) {
                case "project":
                    aggregationObj[1]["$facet"]["data"].push(self.projectionBuilder(item));
                    break;
                case "join":
                    aggregationObj[1]["$facet"]["data"].push(self.lookupBuilder(item));
                    break;
                case "sort":
                    aggregationObj[1]["$facet"]["data"].push(self.sortBuilder(item));
                    break;
                case "pagination":
                    aggregationObj[1]["$facet"]["data"].push(...self.paginationBuilder(item));
                    break;
                case "group":
                    aggregationObj[1]["$facet"]["data"].push(self.groupBuilder(item));
                    break;
            }
        });
        return aggregationObj;
    }
    matchBuilder(match) {
        let matchQueryObj = {};
        matchQueryObj["$match"] = this.builder(match.query, {});
        return matchQueryObj;
    }
    builder(query, matchObj) {
        let self = this;
        let pos = 0;
        let operandObj;
        query.forEach(function (item, index) {
            if (index == 0) {
                operandObj = matchObj["$" + item] = [];
                pos++;
                return;
            }
            if (Array.isArray(item)) {
                let childQuery = item;
                operandObj.push(self.builder(childQuery, {}));
            }
            else {
                let cond = {};
                cond["$expr"] = {};
                cond["$expr"][item.operator] = [];
                cond["$expr"][item.operator].push("$" + item.Property);
                if (item.Property.startsWith("_")) {
                    cond["$expr"][item.operator].push({ "$toObjectId": item.operatorValue });
                }
                else {
                    cond["$expr"][item.operator].push(...item.operatorValue);
                }
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
        let projectionObj = { "$project": {} };
        let self = this;
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
        let comma = "";
        if (index < arr.length - 1) {
            comma = ",";
        }
        else {
            comma = "";
        }
        return comma;
    }
    sortBuilder(sort) {
        let sortObj = { "$sort": {} };
        let self = this;
        sort.query.forEach(function (item, index) {
            sortObj["$sort"][`${item.key}`] = item.value;
        });
        return sortObj;
    }
    paginationBuilder(pagination) {
        let skipObj = {};
        let limitObj = {};
        skipObj["$skip"] = (pagination.query.pageSize * (pagination.query.page - 1));
        limitObj["$limit"] = pagination.query.pageSize;
        let pageObj = [skipObj, limitObj];
        return pageObj;
    }
    lookupBuilder(lookup) {
        let lookupObj = {};
        lookupObj["$lookup"] = lookup.query;
        return lookupObj;
    }
    groupBuilder(group) {
        let groupObj = {};
        let obj = {};
        group.query._id.forEach(element => {
            obj[element.alias] = "$" + element.key;
        });
        let x = {};
        x["_id"] = obj;
        groupObj["$group"] = x;
        group.query.accumulators.forEach(element => {
            let obj1 = {};
            obj1["$" + element.accumulator] = element.accumulatorValue;
            groupObj["$group"][element.alias] = obj1;
        });
        return groupObj;
    }
};
QueryBuilderService = __decorate([
    common_1.Injectable()
], QueryBuilderService);
exports.QueryBuilderService = QueryBuilderService;
//# sourceMappingURL=QueryBuilderService.js.map