const mongoose = require("mongoose");

const connect = (url) => {
    try {
        const mongoUri = url;

        return mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
        console.log(`Error connecting to MongoDB: ${err}`);
        throw err;
    }
};

const getClient = () => {
    return mongoose.connection.getClient();
}

module.exports = {
    connect,
    getClient
};