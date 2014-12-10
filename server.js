var express = require('express');
var mongojs = require('mongojs');
var sha1 = require('sha1');
var app = express();
var request = require("request");
var MJ = require("mongo-fast-join");
mongoJoin = new MJ();

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));


app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
//var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "ebaydp" || "ebaydb";

var dbUser = mongojs("dbms", ["user"]);
var dbComments = mongojs("dbms", ["comments"]);
var dbSavedProducts = mongojs("dbms", ["savedProducts"]);
var dbCart = mongojs("dbms", ["cart"]);
var dbAddress = mongojs("dbms", ["address"]);
var dbCard = mongojs("dbms", ["cards"]);
var dbPurchases = mongojs("dbms", ["purchases"]);
var dbItems = mongojs("dbms", ["items"]);

app.get("/isAdmin", function(req, res){
  dbUser.user.find({username : req.session.username}, function (err, doc){
    res.json(doc);
  });
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
    req.session.username=uname;
    console.log(req.session.username);
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

app.post("/forgotPassword", function(req,res){
  var uname = req.body.uname;
  dbUser.user.find({username : uname},function(er,data){
    res.json(data)
  });
});

app.post('/RegisterUser', function(req,res){

 var uname=req.body.uname
 var user={
  first:req.body.fname,
  last:req.body.lname,
  username:uname,
  password:sha1(req.body.password),
  secQues:req.body.secQues,
  answer:req.body.answer
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

app.get("/reviews/:ItemId", function(req, res){
  var id = req.params.ItemId;
  console.log(id);
  dbComments.comments.find({itemId : id}, function (err, doc){
    console.log(doc);
    res.json(doc);
  });
});

app.post("/reviews", function (req, res) {
  console.log(req.body);
  dbComments.comments.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.get("/comments", function (req, res) {
  dbComments.comments.find({username : req.session.username}, function(err, docs){
    console.log(docs);
    res.json(docs);
  });
});

app.get("/comments/:id", function(req, res){
	console.log("called" + " " + req); 
	var id = req.params.id;
	if(id.length == 24){
		dbComments.comments.findOne({_id : mongojs.ObjectId(id)}, function (err, doc){
			   res.json(doc);
			  });
	}else
		{
		dbComments.comments.find({username : id}, function(err, docs){
		    console.log(docs);
		    res.json(docs);
		  });
	}
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
  dbSavedProducts.savedProducts.find({username : req.session.username}, function(err, docs){
    res.json(docs);
  });
});

app.get("/savedProducts/:id", function(req, res){
	var id = req.params.id;
	  dbSavedProducts.savedProducts.find({username : id}, 
	    function (err, doc) {
	      res.json(doc);
	    })
	
});

app.delete("/savedProducts/:id", function(req, res){
  var id = req.params.id;
  dbSavedProducts.savedProducts.remove({_id : mongojs.ObjectId(id)}, 
    function (err, doc) {
      res.json(doc);
    });
});

app.post("/savedProducts", function (req, res) {
  console.log(req.body);
  dbSavedProducts.savedProducts.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.post("/saveItems", function (req, res) {
  console.log(req.body);
  dbItems.items.insert({_id : req.body.itemId, productTitle : req.body.productTitle, 
    username: req.body.username, price: req.body.price}, function(err, doc) {
    res.json(doc);
  });
});

app.post("/cart", function (req, res) {
  console.log(req.body);
  dbCart.cart.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.get("/shoppingcart", function (req, res) {
    console.log(req.session.username);
    var username=req.session.username;
    dbCart.cart.find({username : req.session.username}, function(err, docs){
      console.log("server response:"+docs);
      res.json(docs);
    });
});

app.delete("/shoppingcart/:id", function(req, res){
    var id = req.params.id;
    dbCart.cart.remove({_id : mongojs.ObjectId(id)}, 
      function (err, doc) {
        res.json(doc);
     });
});

app.delete("/removeCart", function(req, res){
      console.log("inside");
      dbCart.cart.remove({username : req.session.username}, 
        function (err, doc) {
        console.log(doc);
          res.json(doc);
        });
});

app.put("/updatePassword/:id", function(req, res){
  var newPwd = req.body.newPasswordAdded; 
  var id = req.params.id; 
  console.log("server update pwd called")
  
  dbUser.user.findAndModify({
    query: {_id : mongojs.ObjectId(id)}, 
    update: {$set : {password : sha1(newPwd)}}},
    function (err, doc, lastErrorObject) {
      dbUser.user.find(function(err, data){
        res.json(doc);
      });
    });
});

app.get("/address", function (req, res) {
  dbAddress.address.find({username : req.session.username}, function(err, docs){
    //console.log("server response:"+docs);
    res.json(docs);
  });
});

app.post("/address/:u", function (req, res) {
  req.body.username = req.params.u;
  console.log(req.body);
  dbAddress.address.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete("/address/:id", function(req, res){
  var id = req.params.id;
  dbAddress.address.remove({_id : mongojs.ObjectId(id)}, 
    function (err, doc) {
      res.json(doc);
    });
});

app.get("/cards", function (req, res) {
  dbCard.cards.find({username : req.session.username}, function(err, docs){
    console.log("server response:"+docs);
    res.json(docs);
  });
});

app.get("/cards/:id", function(req, res){
  var id = req.params.id;
  dbCard.cards.findOne({_id : mongojs.ObjectId(id)}, function (err, doc){
    res.json(doc);
  });
});

app.post("/cards/:u", function (req, res) {
  req.body.username = req.params.u;
  console.log(req.body);
  dbCard.cards.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete("/cards/:id", function(req, res){
  var id = req.params.id;
  dbCard.cards.remove({_id : mongojs.ObjectId(id)}, 
    function (err, doc) {
      res.json(doc);
    });
});

app.get("/purchases", function (req, res) {
  //console.log(req.session.username);
  mongoJoin
    .query(
      //say we have sales records and we store all the products for sale in a different collection
      dbPurchases.collection("purchases"),
        {}, //query statement
        {} //fields
    )
    .join({
        joinCollection: dbItems.collection("items"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["itemId"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "itemId"
    })
    //Call exec to run the compiled query and catch any errors and results, in the callback
    .exec(function (err, items) {
      var resultItem;
      var i;
      console.log(items);
      console.log(items[0]);
     console.log(items.length);
        for (i = 0; i < items.length ; i++){
          var item = items[i];
          if (item.username == req.session.username)
          {
            console.log("success");
            console.log(item);
            resultItem = item;
            break;

          }
        }
        console.log(resultItem + " Let's see");
        res.json(resultItem);
       
    });
});

app.post("/purchases", function (req, res) {
    dbPurchases.purchases.insert(req.body, function(err, doc) {
      res.json(doc);
    });
});
app.post("/userReport", function (req, res) {
  var query = {};
  if (req.body.searchKey != undefined){
    var user = req.body.searchKey;
    query.username = user.toString();
  }
  mongoJoin
    .query(
      //say we have sales records and we store all the products for sale in a different collection
      dbUser.collection("user"),
        query, //query statement
        {} //fields
    )
    .join({
        joinCollection: dbPurchases.collection("purchases"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["username"],
        //This is the key of the document in the right hand document
        rightKeys: ["username"],
        //This is the new subdocument that will be added to the result document
        newKey: "joinUsername"
    })
    .join({
        joinCollection: dbItems.collection("items"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["joinUsername.itemId"],
        //This is the key of the document in the right hand document
        rightKeys: ["_id"],
        //This is the new subdocument that will be added to the result document
        newKey: "joinItemId"
    })
    //Call exec to run the compiled query and catch any errors and results, in the callback
    .exec(function (err, items) {
          res.json(items);
      
    });
});

app.post("/productReport", function (req, res) {
  var query = {};
  if (req.body.searchKey != undefined){
    var id = req.body.searchKey;
    query._id = id.toString();
  }
  mongoJoin
    .query(
      //say we have sales records and we store all the products for sale in a different collection
      dbItems.collection("items"),
        query, //query statement
        {} //fields
    )
    .join({
        joinCollection: dbPurchases.collection("purchases"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["_id"],
        //This is the key of the document in the right hand document
        rightKeys: ["itemId"],
        //This is the new subdocument that will be added to the result document
        newKey: "joinItemId"
    })
    .join({
        joinCollection: dbUser.collection("user"),
        //respects the dot notation, multiple keys can be specified in this array
        leftKeys: ["joinItemId.username"],
        //This is the key of the document in the right hand document
        rightKeys: ["username"],
        //This is the new subdocument that will be added to the result document
        newKey: "joinUsername"
    })
    //Call exec to run the compiled query and catch any errors and results, in the callback
    .exec(function (err, items) {
      console.log(items);
          res.json(items);
      
    });
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ipaddress);


