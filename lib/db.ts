//execute db connection in order to connect to the mongodb database
// mongoose → The official MongoDB ODM (Object Data Modeling) library for Node

import mongoose from 'mongoose';

const MongoDB_URI = process.env.MONGODB_URI;

//connect to the database
const connect = async () => {
    //check if the connection is already established
    const connectionState = mongoose.connection.readyState;

    //if the connection is already established, return
    if (connectionState === 1) {
        console.log('Database connection already established');
        return;
    }

    //if the connection is not established, connect to the database
    if (connectionState === 2) {
        console.log('Database connection is connecting');
        return;
    }

    //if the connection is not established, connect to the database
    try {
        mongoose.connect(MongoDB_URI!, {
            dbName: "backend-dev",
            bufferCommands: true,
        });
        console.log('Database connection established');
    } catch (error:any) {
        console.error('Database connection error', error);
        throw new Error('Database connection error', error);
    }
};

export default connect;

