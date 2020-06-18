let expect = require("chai").expect;
let assert = require("chai").assert;
let readfile = require("../app/readfile");


describe("Test App",()=>{

  describe("Test File reader for nonexistent file", ()=>{
    it("accepts non existent url and returns callback with false",(done)=>{
      readfile("/home/fikayomi/Documents/projects/TestProject/rdf-files/cache/epub/9987/pg9977.rdf",(truth,err)=>{
        expect(truth)
        .to.be.a("Boolean")
        .and.equal(false);

        expect(err)
        .to.be.a("string")
        .and.equal("File does not exist")

        done();
      });

    });
  });

  describe("Test File Reader for invalid file types",()=>{
    //specification to test file reader
    it("accepts invalid file url and returns callback with false",(done)=>{
      readfile("/home/fikayomi/Documents/projects/TestProject/test.pdf",(truth,err)=>{
        expect(truth)
        .to.be.a("Boolean")
        .and.equal(false);

        expect(err)
        .to.be.a("string")
        .and.equal("Invalid File Format")

        done();
      });
    });
  });


  describe("Test File Reader for empty rdf data", ()=>{
      //specification
      it("accepts empty rdf file and returns callback with false",(done)=>{
        readfile("/home/fikayomi/Documents/projects/TestProject/test.rdf",(truth,err)=>{
          expect(truth)
          .to.be.a("Boolean")
          .and.equal(false);

          expect(err)
          .to.be.a("string")
          .and.equal("Empty file")

          done();
        });
      });
  });

  describe("Test File Reader for invalid data file",()=>{
    it("accepts rdf without acceptable data and returns callbac with false",(done)=>{
      readfile("/home/fikayomi/Documents/projects/TestProject/random.rdf",(truth,err)=>{
        expect(truth)
        .to.be.a("Boolean")
        .and.equal(false);

        expect(err)
        .to.be.a("string")
        .and.equal("Invalid Content");

        done();
      });
    });
  });

  describe("Test File Reader for valid rdf ",()=>{
    it("accepts rdf without acceptable data and returns callbac with false",(done)=>{
      readfile("/home/fikayomi/Documents/projects/TestProject/rdf-files/cache/epub/9987/pg9987.rdf",(truth,err)=>{
        console.log(err);

        expect(truth)
        .to.be.a("Object")

        expect(err)
        .to.equal(null)

        done();
      });
    })
  });

});
