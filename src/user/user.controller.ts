import { Controller, Post, Req, Get, Res, Inject, Query } from '@nestjs/common';
import { Request, Response, json } from "express";
import { MONGODB_PROVIDER } from 'src/constants';
@Controller('user')
export class UserController {
    constructor(@Inject(MONGODB_PROVIDER) private readonly db: any) {

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
      //  var condition={ "address.coord": { $lt: -95.754168 } };
      //  var projections={"restaurant_id" : 1,"name":1,"borough":1,"cuisine" :1,"_id":0}
      //  const result =  await  this.db.collection('restaurants').find(condition,projections).toArray();

            // const result =  await this.db.collection('persons').aggregate([
            //   { $match: {gender:'female'}},
            //   { $project: { _id: 0, gender: 1, fullName: {$concat:[{$toUpper:"$name.first"}," ",{$toUpper:"$name.last"}]} }}
            //   ]).toArray();


       const result =  await this.db.collection('persons').aggregate([
        { $match: { $or: [ { gender: "female" }, { "location.city": {$eq:"billum"}  } ],$and: [ { phone: "23138213" } ] } },
        { $group: { _id: {state: "$location.state" }, totalPersons:{$sum:1 }}},
        { $sort: {totalPersons: -1}}
        ]).toArray();

//projection: { _id: 0, gender: 1, "$name.first": {$concat:[{$toUpper:"$name.first"}," ",{$toUpper:"$name.last"}]} }
      
// const result =  await this.db.command(
      //     {
      //       find: "persons",
      //       filter: { gender:  "female" },
      //       projection: { _id: 0, gender: 1, "$name.first": {$concat:[{$toUpper:"$name.first"}," ",{$toUpper:"$name.last"}]} }
          
      //     }
      // );
       console.log(result)
       return  result;
    }
}
