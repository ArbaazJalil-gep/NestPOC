"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbProviders = void 0;
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.mongoDbProviders = [
    {
        provide: constants_1.MONGODB_PROVIDER,
        useFactory: async () => new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (error, client) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(client.db('Person'));
                }
            });
        })
    },
];
//# sourceMappingURL=mongodb.provider.js.map