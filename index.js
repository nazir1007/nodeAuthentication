const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;

const path = require("path");

// ------ creating partials and layout ------ //
const expressLayouts = require("express-ejs-layouts");

// ---------- DB config ---------- //
const db = require('./config/mongoose');


 // ----- restrict browser to go back after clicking on login & logout ----- //
 const nocache = require("nocache");

const session = require("express-session");
const passport = require("passport");
const passportLocal = require('./config/passport-local-strategy');
const googlePassport = require('./config/passport-google-oauth');
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const customMware = require('./config/middleware');

app.use(nocache());

// -------- EJS -------//
app.use(expressLayouts);

// -------- Bodyparser -------- //
app.use(express.urlencoded({extended : false}));

app.use(cookieParser());

// extract styles and scripts from sub-pages into parent page
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views',  './views');

 // ------- Express-Session -------- //
 app.use(session({
    name: 'node Authentication',
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/node_authentication',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
// ----- set current user as a locals ------ //
app.use(passport.setAuthenticatedUser); 

 // ------- Connect flash -------- //
 app.use(flash());
 app.use(customMware.setFlash);
 
// --------  Routes -------//
app.use('/', require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});