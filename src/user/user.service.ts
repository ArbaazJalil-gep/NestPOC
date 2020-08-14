import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {


    matchBuilder(match) {
        var matchQueryObj = {}
        matchQueryObj["$match"] = {};
        matchQueryObj["$match"] = this.builder(match.query, matchQueryObj["$match"])
        return matchQueryObj;
    }

    builder(query, matchObj) {
        var self = this;
        var pos = 0;
        var operandObj;
        query.forEach(function (item, index) {
            if (index == 0) {
                operandObj = matchObj["$" + item] = [];
                pos++
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
                operandObj.push(cond)
                pos++;
            }
        });
        return matchObj;
    };
    quotes(value): string {
        return `"${value}"`;
    }

    projectionBuilder(projections) {
        var self = this;
        var projectionsStr = ""
        projections.query.forEach(function (item, index) {
            var comma = self.getSeperator(index, projections.query);
            
            if (item.SpecialOps?.type == "ObjectToArray") {
                projectionsStr = self.SplOpsObjectToArray(projectionsStr, item);
                projectionsStr += comma;
            }
            if (item.SpecialOps?.type.toLowerCase() == "convert") {
                projectionsStr = self.SplOpsConvert(projectionsStr, item);
                projectionsStr += comma;
            }
            else {
                projectionsStr = self.SplOpsNone(projectionsStr, item, comma);
            }

        });
        projectionsStr = `{ "$project":{${projectionsStr}} }`;

        var projectionsObj = JSON.parse(projectionsStr)
        return projectionsObj;
    }

    private SplOpsNone(projectionsStr: string, item: any, comma: string) {
        if (item.alias) {
            projectionsStr += `"${item.alias}":"$${item.key}"${comma}`;
        } else {
            projectionsStr += `"${item.key}":"$${item.key}"${comma}`;
        }
        return projectionsStr;
    }

    private SplOpsConvert(projectionsStr: string, item: any) {
        /*
          alias: {
              "$toDecimal": "$location.coordinates.latitude"
          }
          */
        var self = this;

        // var obj = {};
        // obj[item.alias] ={};
        // obj[item.alias]["$"+item.SpecialOps.args.operator]="$"+item.key;
        // console.log(projectionsStr)
        // projectionsStr +=JSON.stringify(obj)
        // console.log(';;;;;')
        // console.log(obj)

        projectionsStr += `"${item.alias}": {"$${item.SpecialOps.args.operator}":"$${item.key}"`;
        projectionsStr += `}`;
        return projectionsStr;
    }


    private SplOpsObjectToArray(projectionsStr: string, item: any) {
        var self = this;
        projectionsStr += `"${item.alias}": [`;
        item.key.forEach(function (itm, ind) {
            var comma = self.getSeperator(ind, item.key);
            projectionsStr += `"$${itm}"${comma}`;
        });
        projectionsStr += `]`;
        return projectionsStr;
    }

    getSeperator(index: any, arr: []) {
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
        var sortStr = ""
        sort.query.forEach(function (item, index) {
            if (index < sort.query.length - 1) {
                sortStr += `"${item.key}": ${item.value},`;
            }
            else {
                sortStr += `"${item.key}": ${item.value}`;
            }
        });
        sortStr = `{ "$sort":{${sortStr}} }`;
        var sortObj = JSON.parse(sortStr)
        return sortObj;
    }

}
