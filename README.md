# fikayo-code
For Bibliu

# Created By 

Sanni Oluwafikayo; 2020-6-18

## Achivements
- Save a single file
- Save a directory of files
- Uploaded all data
- Created a working index to search by Title,Author Name & Publication Date
- Uploaded all Files Smoothly

## How To Use

This NodeJS application was designed to interact with http clients such as Postman

### The following assumptions were made

1. The files to be uploaded seats in the root directory of the application
2. The directory structure in the epub directory would always be maintained

###
To Run the application;

- Run 
```
  git clone https://github.com/feekayo/fikayo-code.git
```
- Run 
  ```
  npm install 
  ```
  
  to install all dependencies

- Run 
  ```
  npm start
  ```
  
  To Run the application on port 2000


#### The application would be running on port 2000

- To parse and Upload a single File

	http://localhost:2000/saveOne
	method: POST	
	headers:
  ```
	{
		Content-Type:'application/json'	
	}
  ```
	
	Request Sample:
  ```
	{
	    "filename" : "../rdf-files/cache/epub/9987/pg9987.rdf"
	}
  ```

- To  parse and upload all the files in an epub directory

	http://localhost:2000/saveMany
	method: POST
	headers:
	
  ```
	{
		Content-Type:'application/json'	
	}
  ```
	
	Request Sample:
```
  	{
	    "filename" : "../rdf-files/cache/epub"
	}
  ```
  
- To search for an index
	localhost:2000/search/:param Request Sample: localhost:2000/search/Edgar


## Optimizations Done
- Multiple file reads and uploads Done in Chunks of 100 to avoid RAM over use
- File Existence Check
- File Format Check
- File Emptiness Check
- File Data Compatibility
- Unit tests all passed for the above checks
- All Files Uploaded in **1350443.8474849984** ms
- Index Search Created for Title Author Name and Publication Date    
