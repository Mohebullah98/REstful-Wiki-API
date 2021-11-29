const express =require("express");
const ejs = require("ejs");
const mongoose =require("mongoose");
const port=3000;
const app= express();
app.use(express.urlencoded({
  extended:true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({ //schema for documents
  title:String,
  content:String
});
const Article = mongoose.model("Article",articleSchema); //create articles collection
//Requests targeting all articles //
app.route("/articles")
.get(function(req,res){ //fetch all articles
  Article.find({},function(err,docs){
    if(!err){
      res.send(docs);//send all articles
    }
    else res.send(err);
  });
})
.post(function(req,res){ //create a new document
  const article = new Article({
    title:req.body.title,
    content:req.body.content
  });
  article.save(function(err){
    if(!err) res.send("Successfully added new article.");
    else res.send(err);
  }); //save document
})
.delete(function(req,res){ //delete all documents
  Article.deleteMany({},function(err){
    if (!err) res.send("All items successfully deleted");
    else res.send(err);
  });
});

//Requests Targeting specific articles //
app.route("/articles/:article")
.get(function(req,res){
const articleTitle=req.params.article; //the article title is a url parameter following articles/
Article.findOne({title:articleTitle},function(err,doc){ //find the specific article named in the params
  if(doc) res.send(doc);
  else res.send(`The article named '${articleTitle}' was not found`);
});
})
.put(function(req,res){ //replace an article with an entirely new one
  Article.replaceOne({title:req.params.article},{title:req.body.title,content:req.body.content},function(err,results){
    if(!err) res.send("Successfully updated the article");
    else res.send(err);
  });
})
.patch(function(req,res){ //update an existing articles values
  Article.updateOne({title:req.params.article},{title:req.body.title,content:req.body.content},function(err,results){
    if(!err) res.send("Successfully patched the artice.");
    else res.send(err);
  });
})
.delete(function(req,res){ //delete a specific article
  Article.deleteOne({title:req.params.article},function(err,result){
    if(!err) res.send(`Successfully deleted the article with title '${req.params.article}'.`);
    else res.send(err);
  });
});
app.listen(port,function(req,res){
  console.log("Server has started on port 3000");
});
