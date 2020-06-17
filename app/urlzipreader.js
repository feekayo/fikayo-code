const http = require("http");
const url = require("url");
const JSZip = require("jszip");
const fs = require("fs");


let readURL = (URL, callback) =>{

  let req = http.get(url.parse(URL), (res) => {
    if (res.statusCode !== 200) {
      console.log(res.statusCode);
      // handle error
      return;
    }
    var data = [], dataLen = 0;

    // don't set the encoding, it will break everything !
    // or, if you must, set it to null. In that case the chunk will be a string.
    console.log("READING FILE");
    res.on("data", (chunk) => {
      data.push(chunk);
      console.log("Adding Chunk Number "+dataLen);
      console.log(chunk);
      dataLen += chunk.length;
    });

    res.on("end", () => {
      var buf = Buffer.concat(data);

      // here we go !
      JSZip.loadAsync(buf).then((zip)=>{
        console.log("FILE READING COMPLETE");
        callback(zip,null);
      }).then((text) => {
        console.log(text);
      });
    });
  });

  req.on("error", (err) => {
    // handle error
    console.log(err)
    callback(false,err);
  });
}

module.exports = readURL;
