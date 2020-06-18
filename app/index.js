"use strict";


require("dotenv").config();

let express = require("express"), //require express
  config = require("./server/configure"), //configure serverr
  app = express(), //invoke express
  mongoose = require("mongoose"), //require mongoose
  errorResponse = require("./commons/errorResponse");

  app.set("port", process.env.PORT || 2000), //set port to environment port or 3000
  app.set("views", __dirname + "/views"), //ser views directory
  (app = config(app)), //invoke app config
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    //res.locals.message = err.message;
    //res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(
      "ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROOOOOOOOOOOOOOOOOOOOOOOOOOOOORRRRRRRRRRRRRRRRRRR"
    );
    console.error(err);
    // render the error page

    res.status(err.status || 500);
    res.json(errorResponse(err.message));
  });

//mongoose.connect('mongodb://localhost/wsf'); //offline test database

mongoose.connect(process.env.DB_HOST);
//mongoose.connect('mongodb+srv://<username>:<password>@cluster0-rxqbo.mongodb.net/test?retryWrites=true&w=majority');

mongoose.connection.on("open", function() {
  //connect to mongoose
  console.log("Mongoose Connected."); //log connection message
});

let server = app.listen(app.get("port"), () => {
  //listen to port
  console.log(app.get("port")); //log port being listened to
});

module.exports = {
  server: server,
  app: app
}
