import { Controller, Post, Req, Get, Res, Inject, Query } from '@nestjs/common';
import { Request, Response, json } from "express";
import { MONGODB_PROVIDER } from 'src/constants';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(@Inject(MONGODB_PROVIDER) private readonly db: any,
    private readonly userService: UserService) {

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
      database: "person",
      projections: [
        {
          CollectionsWithProperties: [
            {
              "persons": [
                "name.first",
                "gender",
                "phone"
              ]
            }
          ]
        }
      ],
      Pipes: [{
        type: "match",
        query: [
          "or",
          {
            "Collection": "persons",
            "Property": "phone",
            "operator": "$eq",
            "operatorValue": "23138213"
          },
          [
            "and",
            {
              "Collection": "persons",
              "Property": "gender",
              "operator": "$eq",
              "operatorValue": "female"
            },
            {
              "Collection": "persons",
              "Property": "location.city",
              "operator": "$eq",
              "operatorValue": "jasper"
            }
          ]
        ]

      },
      {
        type: "project",
        query: [
          { collection: "persons", key: "_id" }
          , { collection: "persons", key: "gender" }
          , { collection: "persons", key: "phone", alias: "mobile" }
          , { collection: "persons", key: "location.coordinates.longitude" }, { collection: "persons", key: "location.coordinates.latitude" }
          , { collection: "persons", key: "name.first", alias: "VeryFirstName" }, { collection: "persons", key: "name.last" }
          , { collection: "persons", key: "cell", alias: 'phoneNumber', SpecialOps: { type: "Convert", args: { operator: "toString" } } },
        ]
      },
      {
        type: "sort",
        query: [{ key: "VeryFirstName", value: 1 }]
      },
      
      ],
    };

    if (schema.type === 'get') {
      var mquery=this.userService.aggregationBuilder(schema);
      var projections = schema.Pipes.find(element => element.type === 'project');
      var match = schema.Pipes.find(element => element.type === 'match');
      var sort = schema.Pipes.find(element => element.type === 'sort');
      var collection = projections.query[0]["collection"];

      var projectionsMql = this.userService.projectionBuilder(projections);
      var matchMql = this.userService.matchBuilder(match);
      var sortMql = this.userService.sortBuilder(sort);

      var mongoQuery=[];
      mongoQuery.push(matchMql);
      mongoQuery.push(projectionsMql);
      mongoQuery.push(sortMql);

 
      const result = await this.db.collection(collection).aggregate( mongoQuery ).toArray();
      return result;
    }
  }

}
