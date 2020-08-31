import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateBuilderService {

    build(schema, payload) {
        if(!schema.isMultiple){
            
        }
        return this.updateOne(schema, payload);
    }

    private updateMany(schema: any, payload: any) {
        const filter = {}; //"phone": "23138213"
        let pay = {};
        schema.criteria.forEach(elem => {
            filter[elem.property] = payload.criteria[elem.property];
        });

        schema.propertiesToUpdate.forEach(elem => {
            pay[elem] = payload.data[elem];
        });

        const updateDoc = {};

        updateDoc["$set"] = pay;
        let updateArr = [];
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: false };
        // create a document that sets the plot of the movie
        updateArr.push(filter, updateDoc, options);
        return updateArr;
    }


    private updateOne(schema: any, payload: any) {
        const filter = {}; //"phone": "23138213"
        let pay = {};
        schema.criteria.forEach(elem => {
            filter[elem.property] = payload.criteria[elem.property];
        });

        schema.propertiesToUpdate.forEach(elem => {
            pay[elem] = payload.data[elem];
        });

        const updateDoc = {};

        updateDoc["$set"] = pay;
        let updateArr = [];
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: false };
        // create a document that sets the plot of the movie
        updateArr.push(filter, updateDoc, options);
        return updateArr;
    }
}
