const express = require('express');
require('colors');
const path = require('path');
const session = require('express-session');

/* env config */
require('dotenv').config({path: `${__dirname}/.env`});


/* app config */
const app = express();
const config = require('./config');
app.set('port', config.port);


/* view engine config */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './views/public')));


/* mongodb connection */
require('./database/mongodb');


/* body parser */
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* session */
app.use(session({
    secret: process.env.APP_SECRET_AUTH_SESSION,
    resave: true,
    saveUninitialized: true,
    name: "authentication_sess"
}));

/* main router */
app.use('/', require('./routes/router'));


/* server */
const httpWebServer = app.listen(app.get('port') || config.port, async () => {
    console.log(`\u2714 process is running on port: ${httpWebServer.address().port}`.bgGreen);
});
