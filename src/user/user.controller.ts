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
        query: [{ collection: "persons", key: "_id", value: 0 }, { collection: "persons", key: "gender", value: 1 }, { collection: "persons", key: "phone", value: 1 }, 
        //{ collection: "persons", key: "name.first", value: 1 }, { collection: "persons", key: "name.last", value: 1 }
        ,{ collection: "persons", SpecialOps:"ObjectToArray", alias:"name", key: ["name.first","name.last"], value: 1 }
      ]
      },
      {
        type: "sort",
        query: [{ key: "name.first", value: 1 }]
      },

      ],
    };

    if (schema.type === 'get') {
      var projections = schema.Pipes.find(element => element.type === 'project');
      var match = schema.Pipes.find(element => element.type === 'match');    
      var sort = schema.Pipes.find(element => element.type === 'sort');    
      var collection = projections.query[0]["collection"];      
      var projectionsMql = this.userService.projectionBuilder(projections)
      var matchMql =this.userService.matchBuilder(match);     
      var sortMql = this.userService.sortBuilder(sort);
      console.log(sortMql);
      const result = await this.db.collection(collection).aggregate([
        matchMql,
        projectionsMql,
        sortMql
      ]).toArray();
      return result;
    }
  }

}
