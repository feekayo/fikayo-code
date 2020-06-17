const express = require("express"),
    router = express.Router(),
    maincontroller = require("../maincontroller");

module.exports = (app)=>{
  app.use(router);
  router.get("/",(req,res)=>{res.end("TEST API");});

  router.post("/save", maincontroller.save);
}
