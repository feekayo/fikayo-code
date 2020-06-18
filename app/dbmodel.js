"use strict"
let mongoose = require("mongoose");

let bookMetaSchema = new mongoose.Schema({
  id:{type: String, 'default':""},
  title: {type: String, 'default':""},
  author: {type: String, 'default':""},
  publisher: {type: String, 'default':""},
  publication_date: {type: String, 'default':""},
  language: {type: String, 'default':""},
  subject: {type: Array, 'default':[]},
  license: {type: String, 'default':""},
})

let bookMeta = mongoose.model("bookMeta",bookMetaSchema);
module.exports = bookMeta;
