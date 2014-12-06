var express = require('express');
var mongojs = require('mongojs');
var sha1 = require('sha1');

var app = express();
var request = require("request");

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
//var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "ebaydp" || "ebaydb";

var dbUser = mongojs("dbms", ["user"]);
var dbComments = mongojs("dbms", ["comments"]);
var dbSavedProducts = mongojs("dbms", ["savedProducts"]);

app.get("/AuthenticateUser", function (req, res) {
  	//res.write("Hello")
  });

app.get("/username", function (req, res) {
  res.send(req.session.username);
    //res.write("Hello")
  });

app.post("/AuthenticateUser", function (req, res) {
 var uname = req.body.uname;
 var password = sha1(req.body.password);

 dbUser.user.findOne({username:uname},function(err, results){
  if (results !=null){
   json_password=results.password;
   if(password==json_password){
    req.session.username=uname
    res.send("success");
  }else{
    res.send("password is incorrect")
  }
}else{
  res.send("username not found");
}
});


});


app.get('/users', function(req,res){
  dbUser.user.find(function(er,data){
    res.json(data)
  });
});

app.post('/RegisterUser', function(req,res){

 var uname=req.body.uname
 var user={
  first:req.body.fname,
  last:req.body.lname,
  username:uname,
  password:sha1(req.body.password)
};

dbUser.user.findOne({username:uname},function(err, results){

  if(results !=null){
    res.send("username exists");
  }
  else{
    dbUser.user.insert(user,function(er,data){
      req.session.username=uname
      res.send("success");
    });
  }

});

});

app.get("/EbayFetchByItemId/:Itemid", function (req, res) {
  var iid = req.params.Itemid;

  var Itemid = "ItemID=";
  Itemid += iid;

  var ebayUrl = "http://open.api.ebay.com/shopping?";
  ebayUrl += "callname=GetSingleItem&";
  ebayUrl += "responseencoding=JSON&";
  ebayUrl += "appid=Northeas-38b6-48bd-bdd2-434822ab9fe8&";
  ebayUrl += "siteid=0&version=515&";
  ebayUrl += Itemid;
  request(ebayUrl, function(error, response, body) {
    res.json(body);
  });
});

app.get("/comments", function (req, res) {
dbComments.comments.find(function(err, docs){
      res.json(docs);
    });
});

app.get("/comments/:id", function(req, res){
  var id = req.params.id;
  dbComments.comments.findOne({_id : mongojs.ObjectId(id)}, function (err, doc){
    res.json(doc);
  });
});

app.put("/comments/:id", function(req, res){
  var id = req.params.id; 
  dbComments.comments.findAndModify({
    query: {_id : mongojs.ObjectId(id)}, 
    update: {$set : {comment : req.body.comment}}},
    function (err, doc, lastErrorObject) {
      dbComments.comments.find(function(err, data){
        res.json(doc);
      });
    });
});

app.delete("/comments/:id", function(req, res){
  var id = req.params.id;
  dbComments.comments.remove({_id : mongojs.ObjectId(id)}, 
    function (err, doc) {
      res.json(doc);
    });
});

app.get("/savedProducts", function (req, res) {
dbSavedProducts.savedProducts.find(function(err, docs){
      res.json(docs);
    });
});

app.delete("/savedProducts/:id", function(req, res){
  var id = req.params.id;
  dbSavedProducts.savedProducts.remove({_id : mongojs.ObjectId(id)}, 
    function (err, doc) {
      res.json(doc);
    });
});



var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);


