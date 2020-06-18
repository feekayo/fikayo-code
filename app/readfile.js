const http = require("http");
const url = require("url");
const JSZip = require("jszip");
const fs = require("fs");
const xml2js = require("xml2js");

let readFile = (fileURL, callback) =>{
  //check file type
  let fileType = fileURL.substr(fileURL.length - 4);//check file extension
  //console.log(fileURL.match(new RegExp("pg" + "(.*)" + fileType)));

  if(fileType!==".rdf"){//if file is rdf file
    callback(false,"Invalid File Format");//callback false with error message
  }else{//if file is rdf file
      let parser = new xml2js.Parser({tagNameProcessors: [(name) => { //construct a parser
        return name.replace(":", "") //replace : in tag names with ""
      }]});
      fs.exists(fileURL,(exists)=>{
        if(exists){
          fs.readFile(fileURL,(error,data)=>{//redfile URL
            if(data.length!==0){//if file is not empty
              try{
                let id = fileURL.match(new RegExp("pg" + "(.*)" + fileType));

                if(id) id = id[1]

                parser.parseString(data,(err,result)=>{
                  if(!err && result.rdfRDF.pgtermsebook){//if not error and valid data

                    let subjects; //would hold refined array of subjects

                    let subjectArray = result.rdfRDF.pgtermsebook[0].dctermssubject //raw subjects array;
                    if(subjectArray){//if not empty or undefined

                      subjects = subjectArray.map((desc,index)=>{ //map subject array to get subjetcs
                        return desc.rdfDescription[0].rdfvalue[0]
                      })
                    }else{
                      subjects = [];
                    }

                    console.log(fileURL);

                    //initialize Object values
                    //let author = "", language = "", title = "", publisher = "Guternberg", date = "", license = "";

                    let Obj = {
                      id:id || "",
                      title: "",
                      author: "",
                      publisher: "",
                      publication_date: "",
                      language: "",
                      subject: subjects,
                      license: ""
                    }

                    // author availability checker;
                    if(result.rdfRDF.pgtermsebook[0].dctermscreator!==undefined && result.rdfRDF.pgtermsebook[0].dctermscreator[0].pgtermsagent!==undefined)
                      Obj.author =result.rdfRDF.pgtermsebook[0].dctermscreator[0].pgtermsagent[0].pgtermsname[0];// set author value

                    // language availability checker
                    if(result.rdfRDF.pgtermsebook[0].dctermslanguage[0].rdfDescription !==undefined)
                      Obj.language = result.rdfRDF.pgtermsebook[0].dctermslanguage[0].rdfDescription[0].rdfvalue[0]._; //set language value

                    // title availability checker
                    if(result.rdfRDF.pgtermsebook[0].dctermstitle !==undefined)
                      Obj.title = result.rdfRDF.pgtermsebook[0].dctermstitle[0] //set title value

                    // publication_date availability checker
                    if(result.rdfRDF.pgtermsebook[0].dctermsissued !==undefined)
                      Obj.publication_date = result.rdfRDF.pgtermsebook[0].dctermsissued[0]._ //set crated date value

                    // license availability checker
                    if(result.rdfRDF.pgtermsebook[0].dctermsrights !== undefined)
                      Obj.license = result.rdfRDF.pgtermsebook[0].dctermsrights[0] // set license value



                    callback(Obj,null); // return Object

                  }else{
                    if(error){
                      console.log(err);
                      callback(false,err); //return error
                    }else{
                      callback(false, "Invalid Content")
                    }
                  }
                })
              }catch(e){
                console.log(e);
                callback(false, e); //return error
              }
            }else{ //if unable to parse file
              let err;
              if(error){
                console.log(error);
                if(error.err===-2) err = "File does not exist"
                callback(false, err || error.code);//r
              }else{

                if(data.length === 0) err = "Empty file"
                callback(false, err || "Something unexpected happened")
              }
            }
          });

        }else{
          callback(false, "File does not exist")
        }
      });
  }


}

module.exports = readFile;
