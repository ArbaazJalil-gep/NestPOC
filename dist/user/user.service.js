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
        return JSON.parse(this.builder(match.query, []).join('') + "}");
    }
    builder(query, stringArr) {
        if (stringArr.length == 0)
            stringArr.push("{ \"$match\":  ");
        var self = this;
        var totalLength = query.length - 1;
        var pos = 0;
        if (pos === totalLength) {
            return;
        }
        query.forEach(function (item, index) {
            if (index == 0) {
                stringArr.push("{");
                stringArr.push(self.quotes("$" + item));
                stringArr.push(":");
                stringArr.push("[");
                pos++;
                return;
            }
            if (Array.isArray(item)) {
                var childQuery = item;
                self.builder(childQuery, stringArr);
            }
            else {
                stringArr.push("{");
                stringArr.push(self.quotes(item.Property));
                stringArr.push(":");
                stringArr.push("{");
                stringArr.push(self.quotes(item.operator));
                stringArr.push(":");
                stringArr.push(self.quotes(item.operatorValue));
                stringArr.push("}");
                stringArr.push("}");
                if (index < query.length - 1) {
                    stringArr.push(",");
                }
                pos++;
            }
        });
        stringArr.push("]}");
        return stringArr;
    }
    ;
    quotes(value) {
        return `"${value}"`;
    }
    projectionBuilder(projections) {
        var self = this;
        var projectionsStr = "";
        projections.query.forEach(function (item, index) {
            var comma = self.getSeperator(index, projections.query);
            if (item.SpecialOps == "ObjectToArray") {
                projectionsStr = self.SplOpsObjectToArray(projectionsStr, item);
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
        projectionsStr += `"${item.key}": ${item.value}${comma}`;
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