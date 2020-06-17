const path = require("path"),
    express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    methodOverride = require("method-override"),
    //errorHandler = require("errorHandler"),
    routes = require("./routes");

module.exports = (app) => {
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(allowCrossDomain);//allow cross domain access
    app.use("/public/",express.static(path.join(__dirname,"../public")));

    routes(app);
    return app;
};


var allowCrossDomain = (req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");

    next();
}
