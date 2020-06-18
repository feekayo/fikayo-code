let expect    = require("chai").expect;
let index = require("../app/index");
let chai = require("chai");
let app = require("../app").app;
let request = require("supertest")

describe("Test App",()=>{
  //let app = "http://localhost:2000"
  let saveMany = "/saveMany";
  let saveOne = "/saveOne";


  describe("Test saveOne with missing filename",()=>{
    it("returns status 400 and error filename missing",(done)=>{
      request(app.listen())
      .post(saveOne)
      .send({})
      .end((err,res)=>{
        console.log(res.statusCode);
        expect(res.statusCode).to.equal(400);

        expect((JSON.parse(res.error.text)).errors).to.equal("filename missing").and.to.be.a("string");

        done();
      });
    });
  });

  describe("Test saveMany with missing dirname",()=>{
    it("returns status 400 and error dirname missing",(done)=>{
      request(app.listen())
      .post(saveMany)
      .send({})
      .end((err,res)=>{
        expect(res.statusCode).to.equal(400);

        expect((JSON.parse(res.error.text)).errors).to.equal("dirname missing").and.to.be.a("string");

        done();
      });
    });

  });

  describe("Test saveOne with an entire directory path", ()=>{
    it("returns status 400 and error invalid file format",(done)=>{
      request(app.listen())
      .post(saveOne)
      .send({
        "filename" : "../rdf-files/cache/epub/9987/"
      })
      .end((err,res)=>{
        expect(res.statusCode).to.equal(400);

        expect((JSON.parse(res.error.text)).errors).to.equal("Invalid File Format").and.to.be.a("string");

        done();
      });
    });
  })

  describe("Test saveMany with a single rdf file",()=>{
    //specification to test file reader
    it("returns status 500 and error Unable to scan directory",(done)=>{
      request(app.listen())
      .post(saveMany)
      .send({
        "dirname" : "../rdf-files/cache/epub/9987/pg9987.rdf"
      })
      .end((err,res)=>{
        expect(res.statusCode).to.equal(500);

        expect((JSON.parse(res.error.text)).errors).to.equal("Unable to scan directory").and.to.be.a("string");

        done();
      });
    });
  });


  describe("Test saveMany with empty directory", ()=>{
    it("returns status 400 with error Empty Directory",(done)=>{
      request(app.listen())
      .post(saveMany)
      .send({
        "dirname" : "../emptyfolder"
      })
      .end((err,res)=>{
        expect(res.statusCode).to.equal(400);

        expect((JSON.parse(res.error.text)).errors).to.equal("Empty Directory").and.to.be.a("string");

        done();
      });
    });
  });

})
