let readfile = require("./readfile");
let db = require("./dbmodel.js");
const {performance} = require('perf_hooks');
let ERR = require("./commons/errorResponse");
let SUCCESS = require("./commons/successResponse");
const path = require("path");
const fs = require("fs");
const Promise = require("bluebird");
const _ = require('lodash')


readFileAsync = Promise.promisify(readfile);

module.exports = {
  indexSearch: (req, res)=>{ // index search function
    let agg = [{
      $match: { $text: { $search: req.params.param } } // aggregate $text search fot parameter
    },{
      $skip: parseInt(req.params.page_size)*parseInt(req.params.page_num)
    },{
      $limit: parseInt(req.params.page_size)
    }]

    db.aggregate(agg,(error,data)=>{ // find data
      if(error){
        console.log((error)); // log error
        res.status(500).json(ERR("Internal Server Error")); //internal server error
      }else{
        res.status(200).json(SUCCESS(data)); // send data response
      }
    })
  },
  saveOne: (req,res)=>{

    if(req.body.filename){ // validate filename sent
      let url = path.join(__dirname,req.body.filename); ///set file path from root directory

      readfile(url,(data,err)=>{ //read and parse filepath
        if(data){

          console.log(data);
          //res.status(200).json(SUCCESS(Obj))
          db.create(data,(error)=>{ //save single file to database
            if(error){
              console.log(error) // log error
              res.status(500).json(ERR("Internal Server Error")); //send client error response
            }else{
              console.log("d");
              res.status(200).json(SUCCESS(data)); //send logged data to client as successs response
            }
          });

        }else{
          res.status(400).json(ERR(err)); //if readfile returned false, return failure reason in error response
        }
      })

    }else{
      res.status(400).json(ERR("filename missing"));  // if filename not sent; prompt client
    }
  },

  saveDirectory: (req,res)=>{ // saving an entire directory of files from the epub folder
    //joining path of directory
    if(req.body.dirname){
      const directoryPath = path.join(__dirname, req.body.dirname);// get epub path
      //passsing directoryPath and callback function
      let start = performance.now();
      let filePathsArray = []; //intialize index for all rdf files within directory;

      fs.readdir(directoryPath, (err, dirs) => { //read epub dir to fetch inner directories
          //handling error
          if (err) {
            res.status(500).json(ERR("Unable to scan directory"))
              //return console.log("Unable to scan directory: " + err);
          }else{
            if(dirs.length>0){//check if directory is empty
              //console.log(files);
              dirs.map((dir,index) => {
                  // Do whatever you want to do with the file
                  //console.log(file);
                  let dPath = directoryPath+"/"+dir;

                  fs.readdir((dPath),(err,fn) => {
                    if(fn){
                      let filePath = dPath+"/"+fn
                      //console.log(filePath);
                      let fileType = filePath.substr(filePath.length - 4);//check file extension

                      if(fileType === ".rdf"){
                        filePathsArray.push(filePath);//only add rdf files to filepaths array
                      }
                      //console.log(filePathsArray);
                      if(index===(dirs.length-1)){ //if all file paths have been collected
                        console.log("DONE FETCHING DATA ARRAY")

                        let chunks = _.chunk(filePathsArray,100); //break file paths into chunks of 100
                        console.log(chunks); // log chunks

                        let recursivelyUploadChunks = () =>{ // function for recursively reading and uploading chunks
                          if(chunks.length===0){ // if all chunks have been read
                            let end = performance.now();
                            console.log("Execution Time: "+(end-start)+" ms");//log execution time
                            res.status(200).json(SUCCESS("Files Uploaded")); // terminate, give response to client
                          }else{
                            let chunk = chunks.pop(); //get chunk and pop out data from memory

                            let array = []; //initialize array to fold refined data objects
                            counter = 0;
                            chunk.map((file_url,index)=>{//map initial chunk
                              //console.log(index);
                              readfile(file_url,(data,err)=>{ //fetch file data
                                if(data){
                                    console.log(data)
                                    array.push(data) //push refined Object into array

                                    console.log("counter: "+counter);
                                    counter ++ //increment counter
                                    if(counter===100 || counter === chunk.length){ //if 100th chunk has been read from file
                                      console.log(array)
                                      db.insertMany(array,(error)=>{ //insert 100 arrays
                                        if(error){
                                          console.log(error);
                                          console.log("Something went wrong");
                                        }else{
                                          console.log("RECURSION");
                                          recursivelyUploadChunks()
                                        }
                                      })
                                    }
                                }

                              });
                            });
                          }
                        }

                        recursivelyUploadChunks();
                      }

                    }
                  });
              });

            }else{
              res.status(400).json(ERR("Empty Directory"));
            }
          }
      });

    }else{
      res.status(400).json(ERR("dirname missing"));
    }
  }
}
