var express = require('express');

var app = express();


app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());


app.get("/AuthenticateUser", function (req, res) {
  	console.log("called get");
  	//console.log(req + "Request");
  	//res.write("Hello")
});



app.post("/AuthenticateUser", function (req, res) {
  	console.log("http post called");
  	var email = req.body.email;
  	var password = req.body.password;
  	// code to validate email and password 
  	res.json({name: " " + email});
	
});

app.listen(3000);