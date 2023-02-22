const mongoose = require('mongoose');


mongoose.set('strictQuery', false);

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    .then(connection => {
        global.__db__ = connection;
    })
    .catch(error => console.log('can not connect to mongodb: '.bgRed, error));

mongoose.connection.on('connected', () => {
    console.log(`\u2714 mongoose connected, mongodb url => mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`.bgGreen.bold);
});

mongoose.connection.on('error', error => {
    console.log('\u2715 mongoose connection failed => '.bgRed, error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected'.bgYellow);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
