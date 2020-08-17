import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

aggregationBuilder(schema){
    var projections = schema.Pipes.find(element => element.type === 'project');
    var match = schema.Pipes.find(element => element.type === 'match');
}

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
        var projectionObj={"$project":{}}
        var self = this;
      
        projections.query.forEach(function (item, index) {
           
            if('SpecialOps' in item){
            if (item.SpecialOps.type == "ObjectToArray") {
                self.SplOpsObjectToArray(projectionObj["$project"],item);
               
            }
            if (item.SpecialOps.type.toLowerCase() == "convert") {
                self.SplOpsConvert( projectionObj.$project,item);
            }
            }
            else {
                 self.SplOpsNone( projectionObj.$project,item);
            }
        });
        
        return projectionObj;
    }

    private SplOpsNone(projectionObj: {}, item: any) {
        if (item.alias) {
          projectionObj[item.alias]= '$'+item.key;
            
        } else {
          projectionObj[item.key]= '$'+item.key;
        }
        return projectionObj;
    }


    private SplOpsConvert(projectionObj: {}, item: any) {
        projectionObj[item.alias]={};
        projectionObj[item.alias][item.SpecialOps.args.operator]= "$"+item.key;
        return projectionObj;
    }


    private SplOpsObjectToArray(projectionObj: {}, item: any) {
        projectionObj[item.alias]=[];
        item.key.forEach(function (itm, ind) {
           projectionObj[item.alias].push(itm);
        });
        return projectionObj;
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
        var sortObj={"$sort":{}}
        var self = this;
      
        sort.query.forEach(function (item, index) {
            sortObj["$sort"][`${item.key}`]=  item.value;
        });
        
        return sortObj;
    }

}
