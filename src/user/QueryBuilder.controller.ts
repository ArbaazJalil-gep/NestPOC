import { Controller, Post, Req, Get, Res, Inject, Query } from '@nestjs/common';
import { Request, Response, json } from "express";
import { MONGODB_PROVIDER } from 'src/constants';
import { QueryBuilderService } from './QueryBuilderService';
import { agent } from 'supertest';
@Controller('user')
export class QueryBuilderController {
  constructor(@Inject(MONGODB_PROVIDER) private readonly db: any,
    private readonly userService: QueryBuilderService) {

  }

  @Post()
  async create(@Req() request: Request, @Res() response: Response) {
    this.db.collection('users').insertOne(request.body, (err, result) => {
      if (err) {
        response.status(500).json(err);
      } else {
        response.status(201);
        response.send(result);
      }
    });
  }

  @Get()
  async get(@Query() query) {


    //schema 1
    const schema = {
      type: 'get',
      database: "person",
      Pipes: [{
        type: "match",
        query: [
          "or",
          ["and", {
            "Collection": "persons",
            "Property": "gender",
            "operator": "$eq",
            "operatorValue": ["female"]
          },
            {
              "Collection": "persons",
              "Property": "dob.age",
              "operator": "$gt",
              "operatorValue": ["$registered.age"]
            }],
          {
            "Collection": "persons",
            "Property": "gender",
            "operator": "$eq",
            "operatorValue": ["male"]
          }
        ]
      }
        , {
        type: "match",
        query: [
          "and",
          {
            "Collection": "persons",
            "Property": "dob.age",
            "operator": "$gte",
            "operatorValue": [60]
          }
        ]
      },
      {
        type: "project",        
        query: [
            { collection: "persons", key: "_id" }
          , { collection: "persons", key: "name.first", alias: "fname" }
          , { collection: "persons", key: "name.last", alias: "lname" }
          , { collection: "persons", key: "gender", alias: "gender" }
          , { collection: "persons", key: "dob.age", alias: "dobage" }
          , { collection: "persons", key: "registered.age", alias: "registeredAge" }
          , { collection: "persons", key: "location.coordinates.latitude", SpecialOps: { type: "Convert", args: { operator: "toInt" } }, alias: "lat" }
          , { collection: "persons", key: "location.coordinates.longitude", SpecialOps: { type: "Convert", args: { operator: "toInt" } }, alias: "long" }
        ]
      }, {
        type: "sort",
        query: [{ key: "name.first", value: 1 }]
      },
      {
        type: "pagination",
        query: {
          pageSize: 5,
          page: 3
        }
      },
      {
        type: "join",
        query: {
          from: "persondetails",
          localField: "_id",
          foreignField: "personid",
          as: "persondetail"
        }
      } 
      ,
      {
        type:"group",
        query: {
          "_id": [{ collection: "persons", key: "dobage", alias: "dobAge" },{ collection: "persons", key: "gender", alias: "Gender" }] ,
          "accumulators":[{alias:"total",accumulator:"sum",accumulatorValue:1}]  /// "total": {"$sum": 1}
        }
      }
      ],

    };

    if (schema.type === 'get') {
      var mquery = this.userService.aggregationBuilder(schema);
      console.clear();
      console.log(JSON.stringify(mquery));
 
      const result = await this.db.collection("persons").aggregate(mquery).toArray();
      return result;
    }
  }

}
