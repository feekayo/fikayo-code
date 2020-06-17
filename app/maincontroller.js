let urlzipreader = require('./urlzipreader');
let ERR = require('./commons/errorResponse');
let SUCCESS = require('./commons/successResponse');

module.exports = {
  save: (req,res)=>{
    let url = req.body.URL;

    urlzipreader(url,(zip,err)=>{
      if(zip){
        console.log(zip.file);
        res.status(200).json(SUCCESS(zip))
      }else{
        res.status(400).json(ERR(err))
      }
    })
  }
}
