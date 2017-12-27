import * as data from '../data.files/postal-codes.json';

const obj = (<any>data);

const legal = {
    legalOptions: [
        { 
            id: 1, 
            label: 'Company' 
        }, 
        { 
            id: 2, 
            label: 'Individual' 
        }
    ],
}

export const Options = Object.assign(obj, legal);
