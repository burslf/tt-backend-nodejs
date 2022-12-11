import * as dotenv from "dotenv";
dotenv.config();

import { MongoClient } from 'mongodb'

function getClient() {
    const uri = process.env['MONGO_URL'];
    if (!uri) {
        throw 'env variable not found'
    }
    const client = new MongoClient(uri);

    return client
}

export { getClient }