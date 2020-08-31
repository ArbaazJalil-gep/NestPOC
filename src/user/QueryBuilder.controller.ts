import { Controller, Post, Req, Get, Res, Inject, Query } from '@nestjs/common';
import { Request, Response, json } from "express";
import { MONGODB_PROVIDER } from 'src/constants';
import { QueryBuilderService } from './QueryBuilderService';
import { agent } from 'supertest';
import { UpdateBuilderService } from './update-builder/update-builder.service';
var mongo = require('mongodb');
const BSON = require('bson');
const { EJSON } = require('bson');

@Controller('user')
export class QueryBuilderController {
  constructor(@Inject(MONGODB_PROVIDER) private readonly db: any,
    private readonly aggregationBuilderService: QueryBuilderService
    , private readonly updateBuilderService: UpdateBuilderService

  ) {

  }

  @Post("execute")
  async execute(@Req() request: Request, @Res() response: Response) {
    console.log(request.body)
    const result = await this.db.collection("persons").aggregate(EJSON.deserialize(request.body)).toArray();
    response.status(201);
    response.send(result);
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

    const schema = {
      type: 'get',
      isMultiple: false,
      database: "person",
      Pipes: [
        {
          type: "match",
          query: [
            "or",
            [
              "and",
              {
                "Collection": "persons",
                "Property": "gender",
                "operator": "$eq",
                "operatorValue": [
                  "female"
                ]
              },
              {
                "Collection": "persons",
                "Property": "dob.age",
                "operator": "$gt",
                "operatorValue": [
                  "$registered.age"
                ]
              }
            ],
            {
              "Collection": "persons",
              "Property": "_id",
              "operator": "$eq",
              "operatorValue": [
                "5f3258cfbaaccedaa5dd2d96"
              ]
            }
          ]
        },
        {
          type: "match",
          query: [
            "and",
            {
              "Collection": "persons",
              "Property": "dob.age",
              "operator": "$gte",
              "operatorValue": [
                60
              ]
            }
          ]
        },
        {
          type: "project",
          query: [
            {
              collection: "persons",
              key: "_id"
            },
            {
              collection: "persons",
              key: "name.first",
              alias: "fname"
            },
            {
              collection: "persons",
              key: "name.last",
              alias: "lname"
            },
            {
              collection: "persons",
              key: "gender",
              alias: "gender"
            },
            {
              collection: "persons",
              key: "dob.age",
              alias: "dobage"
            },
            {
              collection: "persons",
              key: "registered.age",
              alias: "registeredAge"
            },
            {
              collection: "persons",
              key: "location.coordinates.latitude",
              SpecialOps: {
                type: "Convert",
                args: {
                  operator: "toInt"
                }
              },
              alias: "lat"
            },
            {
              collection: "persons",
              key: "location.coordinates.longitude",
              SpecialOps: {
                type: "Convert",
                args: {
                  operator: "toInt"
                }
              },
              alias: "long"
            }
          ]
        },
        {
          type: "sort",
          query: [
            {
              key: "name.first",
              value: 1
            }
          ]
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
            from: "linedeatils",
            localField: "_id",
            foreignField: "personid",
            as: "persondetail"
          }
        },
        {
          type: "group",
          query: {
            "_id": [
              {
                collection: "persons",
                key: "dobage",
                alias: "dobAge"
              },
              {
                collection: "persons",
                key: "gender",
                alias: "Gender"
              }
            ],
            "accumulators": [
              {
                alias: "total",
                accumulator: "sum",
                accumulatorValue: 1
              }
            ],
            "$sum": 1
          }
        }

      ]

    };
    // const schema = {
    //   type: "update",
    //   isMultiple: true,
    //   database: "Person",
    //   collection: "persons",
    //   criteria: [
    //     { property: "phone", operator: "eq" }
    //     //,{ property: "city", operator: "eq", OperatorValue: "$p2" }
    //   ],
    //   propertiesToUpdate: ["nat", "info.publisher", "login.password"]
    // }

    if (schema.type === 'get') {
      var mquery = this.aggregationBuilderService.aggregationBuilder(schema);
      console.clear();
      console.log(JSON.stringify(mquery));
      var serialized = (EJSON.serialize(mquery));
      console.log('----', serialized)
      const result = await this.db.collection("persons").aggregate(mquery).toArray();
      return serialized;
    }


    if (schema.type === 'update' && !schema.isMultiple) {
      let payload = {
        criteria: { "phone": "23138213" },
        data: {
          "nat": "DK4",
          "info.publisher": "44",
          "login.password": "up1"
        }
      };

      var mquery = this.updateBuilderService.build(schema, payload);
      console.log(JSON.stringify(mquery));
      const result = await this.db.collection("persons").updateOne(...mquery);
      var serialized = (EJSON.serialize(mquery));
      return result;
    }

    if (schema.type === 'update' && schema.isMultiple) {
      let payload = {
        criteria: { "phone": "23138213" },
        data: [{
          "nat": "DK4",
          "info.publisher": "44",
          "login.password": "up1"
        }]
      };


      var mquery = this.updateBuilderService.build(schema, payload);
   
      const result = await this.db.collection("persons").find(mquery).toArray();
      // const result = await this.db.collection("persons").find(JSON.parse(qStr)).toArray();


      // const result = await this.db.collection("persons").bulkWrite([{ _id: new mongo.ObjectID("5f3258cfbaaccedaa5dd2d96"), phone: "666" }
      //   , { _id: new mongo.ObjectID("5f3258cfbaaccedaa5dd2da2")  , phone: "555" }].map(function (p) {
      //     return {
      //       updateOne: {
      //         filter: { _id: p._id },
      //         update: { $set: { phone: p.phone } }
      //       }
      //     }
      //   }))
      // console.log(JSON.stringify(mquery));
      // const result = await this.db.collection("persons").updateMany(...mquery);

      return serialized;
    }


  }

}
