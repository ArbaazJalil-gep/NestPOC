import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    matchBuilder(match): any {
        return JSON.parse(this.builder(match.query, []).join('') + "}");
    }

    builder(query, stringArr): any {
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
                pos++
                return;
            }
            if (Array.isArray(item)) {
                var childQuery = item;
                self.builder(childQuery, stringArr);
            } else {
                stringArr.push("{");
                stringArr.push(self.quotes(item.Property));
                stringArr.push(":");
                //---Operator Object---
                stringArr.push("{");
                stringArr.push(self.quotes(item.operator));
                stringArr.push(":");
                stringArr.push(self.quotes(item.operatorValue));
                stringArr.push("}");
                //----------------------
                stringArr.push("}");

                if (index < query.length - 1) {
                    stringArr.push(",");
                }
                pos++;
            }

        });
        stringArr.push("]}");
        return stringArr;
    };

    quotes(value): string {
        return `"${value}"`;
    }

    projectionBuilder(projections) {
        var self = this;
        var projectionsStr = ""
        projections.query.forEach(function (item, index) {
            var comma = self.getSeperator(index, projections.query);

//            self["SplOps"+item.SpecialOps](projectionsStr, item, self);
            if (item.SpecialOps == "ObjectToArray") {
                projectionsStr = self.SplOpsObjectToArray(projectionsStr, item);
                projectionsStr+=comma;
            }
            else {
                projectionsStr = self.SplOpsNone(projectionsStr, item, comma);
            }

        });
        projectionsStr = `{ "$project":{${projectionsStr}} }`;
        console.log('===>',projectionsStr)
        console.log('=========')
        var projectionsObj = JSON.parse(projectionsStr)
        return projectionsObj;
    }

    private SplOpsNone(projectionsStr: string, item: any, comma: string) {
        if(item.alias){
            projectionsStr += `"${item.alias}":"$${item.key}"${comma}`;
        }else{
            projectionsStr += `"${item.key}":"$${item.key}"${comma}`;
            
        }        
        return projectionsStr;
    }

    private SplOpsObjectToArray(projectionsStr: string, item: any) {
        var self = this;
        // "name.last": "$name.last",
        // "nameArray":["$name.last","$name.first"]	
          
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
