import { MongoClient } from "mongodb";
import { MONGODB_PROVIDER } from "../constants";

export const mongoDbProviders = [
  {
    provide: MONGODB_PROVIDER,
    useFactory: async () => new Promise((resolve, reject) => {
      MongoClient.connect('mongodb://localhost:27017',
      { useUnifiedTopology: true },
      (error, client) => {
        if (error) {
          reject(error);
        } else {
          resolve(client.db('restaurant'));
        }
      });
    })
  },
];

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class MongoDbService {
//     getDb(): string {
//         return 'This is Mongo!';
//       }

      
// }
