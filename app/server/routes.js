const express = require("express"),
    router = express.Router(),
    maincontroller = require("../maincontroller");

module.exports = (app)=>{
  app.use(router);
  router.get("/",(req,res)=>{res.end("TEST API");});

  router.get("/search/:param/:page_size/:page_num", maincontroller.indexSearch);
  router.post("/saveOne", maincontroller.saveOne);
  router.post("/saveMany", maincontroller.saveDirectory);
}
