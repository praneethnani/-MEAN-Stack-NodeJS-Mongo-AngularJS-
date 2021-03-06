

var ngIdpControllers = angular.module('ngIdpControllers', []);

function showTopNavBar($scope, DataFactory, $cookieStore) {
	var uname = $cookieStore.get('username');
	if(uname != ""){
		var a = document.getElementById('tnavBar');
		a.style.visibility = "visible";
	} else {
		var a = document.getElementById('tnavBar');
		a.style.visibility = "hidden";
	}
	
};

ngIdpControllers.controller('SignInCtrl', ['$scope','DataFactory', '$cookieStore', function ($scope, DataFactory, $cookieStore) {
	console.log("Hello from SignInCtrl");
	$cookieStore.put('username', '');
	showTopNavBar($scope, DataFactory, $cookieStore);
	$scope.validate = function () {
		DataFactory.checkPost("/AuthenticateUser", $scope.login)
		.success(function(json){
			if (json!="success"){
				alert("Error In Login");
			}else{
				var uname = $scope.login.uname;
				$cookieStore.put('username', uname);
				location.replace("http://localhost:3000/" + "#homePage");
				var anchorInnerHtml = document.getElementById('profileID').innerHTML;
				var innerHtmlValues = anchorInnerHtml.split("?");
				var newHtml = innerHtmlValues[0] + "?id=" + uname +innerHtmlValues[1]; 
				document.getElementById('profileID').innerHTML = newHtml;
			}
		});
	}
}]);

ngIdpControllers.controller('HomepageCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from HomepageCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.username = u;
	$scope.homepage = {
		report: false
	};

	$http.get("/isAdmin", $scope.homepage)
	.success(function(response){
		console.log(response);
		console.log(response[0].username);
		if (response[0].username == "admin"){
			$scope.homepage = {
				report: true
			};
		}
	});

	function _cb_findItemsByKeywords(root) {
		var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
		var html = [];
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="10" class="table table-hover"><tbody>');
		for (var i = 0; i < items.length; ++i) {
			var item     = items[i];
			var title    = item.title;
			var pic      = item.galleryURL;
			var viewitem = item.viewItemURL;
			var price = item.sellingStatus[0].convertedCurrentPrice[0].__value__;
			if(null == item.itemId)
			{
				continue;
			}
			var itemId = item.itemId;

			if (null != title && null != viewitem) {
				html.push('<tr><td>' + '<img class="icon" src="' + pic + '" border="0">' + '</td>' + 
					'<td><td><a href="/#productDetail?id='+ itemId+'" >' + title + '</a></td>'+
					'<td>' + price + ' USD</td></tr>');
			}
		}
		html.push('</tbody></table>');
		document.getElementById("results").innerHTML = html.join("");
}  // End _cb_findItemsByKeywords() function

$scope.searchFromEbay = function () {
	
	var keyword = "&keywords=";
	keyword += $scope.keyword;
	keyword += "+";
	keyword += $scope.category;
	
	var ebayUrl = "http://svcs.ebay.com/services/search/FindingService/v1";
	ebayUrl += "?OPERATION-NAME=findItemsByKeywords";
	ebayUrl += "&SECURITY-APPNAME=Northeas-38b6-48bd-bdd2-434822ab9fe8";
	ebayUrl += "&RESPONSE-DATA-FORMAT=JSONP";
	ebayUrl += "&REST-PAYLOAD&";
	ebayUrl += keyword;
	ebayUrl += "&paginationInput.entriesPerPage=20";
	console.log(ebayUrl);

	$.ajax({
		type:     "GET",
		url:      ebayUrl,
		dataType: "jsonp",
		crossDomain: true,
		success: function(data){
			console.log(data);
			_cb_findItemsByKeywords(data);
		}
	});
}

}]);

ngIdpControllers.controller('registrationCtrl', ['$scope','DataFactory', '$cookieStore', function ($scope, DataFactory, $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	$scope.registerUser = function () {
		DataFactory.checkPost("/RegisterUser", $scope.register)
		.success(function(json){
			if (json!="success"){
				alert(json);
			}else{
				location.replace("http://localhost:3000/" + "#");  
			}
		});
	}
}]);


ngIdpControllers.controller('productDetailCtrl', ['$scope','DataFactory', '$cookieStore', function ($scope, DataFactory, $cookieStore) {
	$scope.product = [{}];
	console.log("Hello from productDetailCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	var url = document.URL;
	var urlContents = url.split("=");
	var ItemID = urlContents[1];
	console.log(ItemID);
	DataFactory.fetchByItemId("/EbayFetchByItemId/"+ ItemID)
	.success(function(json){
		$scope.product=JSON.parse(json);
      //location.replace("http://localhost:3000/" + "#homePage");
  });

	$scope.saveProduct = function (response) {
		if ( u == '') {
			alert("Please Login to save product.");
			return;
		}
		$scope.add = {};
		$scope.add.productTitle = $scope.product.Item.Title;
		$scope.add.itemId = ItemID;
		$scope.add.username = u;
		$scope.add.price = $scope.product.Item.ConvertedCurrentPrice.Value;
		console.log($scope.add);
		DataFactory.postData("/savedProducts", $scope.add)
		.success(function(response){
			alert('Product saved for later.');
		});
		DataFactory.postData("/saveItems", $scope.add)
		.success(function(response){
			console.log("Item saved in items");
		});
	}

	$scope.saveToCart = function (response) {
		if ( u == '') {
			alert("Please Login to add to cart.");
			return;
		}
		$scope.addToCart = {};
		$scope.addToCart.productTitle = $scope.product.Item.Title;
		$scope.addToCart.itemId = ItemID;
		$scope.addToCart.username = u;
		$scope.addToCart.price = $scope.product.Item.ConvertedCurrentPrice.Value;
		console.log($scope.addToCart);
		DataFactory.postData("/cart", $scope.addToCart)
		.success(function(response){
			alert('Product added to the cart.');
		});
		DataFactory.postData("/saveItems", $scope.addToCart)
		.success(function(response){
			console.log("Item saved in items");
		});
	}



}]);


ngIdpControllers.controller('ReviewController', ['$scope','DataFactory', '$cookieStore','$http', function ($scope, DataFactory, $cookieStore, $http) {
	console.log("Hello from ReviewController");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	var url = document.URL;
	var urlContents = url.split("=");
	var ItemID = urlContents[1];
	console.log(ItemID);
	this.reviews = [{}];
	//Database connection to post the reviews
	
	$scope.all = function (response) {
		$http.get("/reviews/" + ItemID)
		.success(function(response){
			console.log(response);
			$scope.reviews = response;	
			console.log($scope.reviews);
		});
	}

	$scope.all();

	this.addReview = function() {
		if ( u == '') {
			alert("Please Login to give review.");
			return;
		}
		$scope.add = {};
		$scope.add.comment = $scope.reviewCtrl.review.body;
		$scope.add.productTitle = $scope.product.Item.Title;
		$scope.add.itemId = ItemID;
		$scope.add.username = u;
		$http.post("/reviews", $scope.add)
		.success(function(response){
			$scope.all();
		});
	};

}]);

ngIdpControllers.controller('commentCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from commentCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.activeUsername = u;
	var url = document.URL;
	var params = url.split("?");
	console.log(params[1].split("=")[1]);
	$scope.username = params[1].split("=")[1];

	$scope.renderComments = function (response) {
		console.log(response);
		$scope.comments = response;	
	};

	$scope.remove = function (id) {
		DataFactory.deleteData("/comments/" + id)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.update = function (id) {
		console.log($scope.comments);
		DataFactory.putData("/comments/" + $scope.comment._id, $scope.comment)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.select = function (id) {
		console.log(id);
		DataFactory.selectData("/comments/" + id)
		.success(function (response){
			console.log(response);
			$scope.comment = response;
		});
	};

	$scope.all = function (response) {
		var url = document.URL;
		var params = url.split("?");
		console.log(params[1].split("=")[1] + "from all");
		var selectedUser = params[1].split("=")[1];
		console.log($scope.user)
		$http.get("/comments/" +  selectedUser)
		.success($scope.renderComments);
	}
	
	$scope.isActiveUser = function(){
		return u != $scope.username;
	}

	$scope.all();
}]);

ngIdpControllers.controller('savedProductsCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from savedProductsCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.activeUsername = u;
	var url = document.URL;
	var params = url.split("?");
	$scope.username = params[1].split("=")[1];
	
	$scope.renderSavedProducts = function (response) {
		console.log(response);
		$scope.savedProducts = response;	
	};

	$scope.remove = function (id) {
		DataFactory.deleteData("/savedProducts/" + id)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.all = function (response) {
		var url = document.URL;
		var params = url.split("?");
		var user = params[1].split("=")[1];
		$http.get("/savedProducts/"+user)
		.success($scope.renderSavedProducts);
	}
	
	$scope.isActiveUser = function(){
		return u != $scope.username;
	}
	
	$scope.all();

}]);


ngIdpControllers.controller('forgotPasswordCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from forgotPasswordCtrl");
	// var a = document.getElementById('tnavBar');
	// a.style.visibility = "hidden";
	showTopNavBar($scope, DataFactory,$cookieStore);
	$scope.forgotPassword = {
		answer: false,
		unameshow: true,
		submit: true,
		userNameText: true,
		quesText: false,
		btncontinue: false,
		newPwd: false
	};
	$scope.getQuestion = function () {
		DataFactory.getQuestion("/forgotPassword", $scope.forgotPassword)
		.success(function(json){
			console.log(json);
			if(json[0]){
				$scope.question = json[0].secQues;
				$scope.dbanswer = json[0].answer;
				$scope.dbId = json[0]._id;
				$scope.forgotPassword = {
					answer: true,
					unameshow: false,
					submit: false,
					userNameText: false,
					quesText: true,
					btncontinue: true,
					ques: true
				}
			}
			else {
				alert('Username doesnot exist');
			}
			
		});

		$scope.validateAnswer = function() {
			console.log("Validate Answer");
			var inputAnswer = $scope.answer;
			var dbanswer = $scope.dbanswer;
			console.log(inputAnswer+ " " + dbanswer);
			if (dbanswer == inputAnswer) {
				$scope.forgotPassword = {
					answer: false,
					quesText: false,
					btncontinue: false,
					ques: false,
					updatePwdText: true,
					newPwd: true,
					btnupdate: true
				}
			}
			else {
				alert("Incorrect Answer");
			}
		}

		$scope.updatePassword = function() {
			console.log("updatePassword");
			var inputAnswer = $scope.answer;
			var dbanswer = $scope.dbanswer;
			console.log(inputAnswer+ " " + dbanswer);
			if (dbanswer == inputAnswer) {
				$scope.forgotPassword = {
					answer: false,
					quesText: false,
					btncontinue: false,
					ques: false,
					updatePwdText: true,
					newPwd: true,
					btnupdate: true,
					newPasswordAdded: $scope.newPassword
				}

				console.log($scope.forgotPassword);
				DataFactory.putNewPwd("/updatePassword/" + $scope.dbId, $scope.forgotPassword)
				.success(function(response){
					location.replace("http://localhost:3000/" + "#passwordChange");
				});

			}
			else {
				alert("Incorrect Answer");
			}
		}
	}
}]);

ngIdpControllers.controller('reportCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
	console.log("Hello from reportCtrl");
	
	$scope.generateReport = function() {

		if ($scope.report == undefined)
			alert('Please select which kind of report you want to generate.');
		else {
			if ($scope.report.selection == undefined)
				alert('Please select which kind of report you want to generate.');
			else {
				if ($scope.report.selection == "product" && (!($scope.report.searchKey == undefined) &&
					isNaN($scope.report.searchKey))){
					alert('Please enter numeric product Id');
			}
			else if ($scope.report.selection == "user" && !isNaN($scope.report.searchKey))
				alert('Please enter valid username');
			else if ($scope.report.selection == "user" && isNaN($scope.report.searchKey)) {
				var a = document.getElementById('userTable');
				a.style.visibility = "visible";
				var b = document.getElementById('productTable');
				b.style.visibility = "hidden";
				
				var mop = $scope.report.searchKey;
				$http.post("/userReport", $scope.report)
				.success(function(response){
					console.log(response[0]);
					if (response.length != 0)
						$scope.entries = response;
					else
						alert("Username not valid.");
				});
			}
			else {
				var a = document.getElementById('userTable');
				a.style.visibility = "hidden";
				var b = document.getElementById('productTable');
				b.style.visibility = "visible";
				$http.post("/productReport", $scope.report)
				.success(function(response){
					if (response.length != 0)
						$scope.entries = response;
					else
						alert("ItemID not valid.");
				});
			}
		}
	}

};
}]);

ngIdpControllers.controller('ProfileCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from profileCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.activeUsername = u;
	var url = document.URL;
	var params = url.split("?");
	$scope.username = params[1].split("=")[1];
	
	$scope.isActiveUser = function(){
		return u != $scope.username;
	}
	
}]);

ngIdpControllers.controller('addressCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.username = u;
	$scope.renderAddresses = function (response) {
		$scope.addresses = response;	
	};

	$scope.remove = function (id) {
		DataFactory.deleteData("/address/" + id)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.all = function (response) {
		console.log("all called");
		$http.get("/address")
		.success($scope.renderAddresses);
	};

	$scope.redirectNewAddress = function() {
		location.replace("http://localhost:3000/" + "#addAddress");
	};

	$scope.all();
}]);

ngIdpControllers.controller('addAddressCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.add = function() {
		console.log($scope.newAddress);
		$http.post("/address/" + u, $scope.newAddress)
		.success(function(response){
			//console.log(response);
		});
		location.replace("http://localhost:3000/" + "#address");
	};

}]);

ngIdpControllers.controller('paymentCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.username = u;

	$scope.renderCards = function (response) {
		$scope.cards = response;
		console.log(response);	
	};

	$scope.remove = function (id) {
		DataFactory.deleteData("/cards/" + id)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.all = function (response) {
		console.log("all called");
		$http.get("/cards")
		.success($scope.renderCards);
	};

	$scope.redirectNewCard = function() {
		location.replace("http://localhost:3000/" + "#addCard");
	};

	$scope.all();

}]);

ngIdpControllers.controller('addCardCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.add = function() {
		console.log($scope.newCard);
		$http.post("/cards/" + u, $scope.newCard)
		.success(function(response){
			console.log(response);
		});
		location.replace("http://localhost:3000/" + "#payment");
	};

}]);

ngIdpControllers.controller('purchaseCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.username = u;
	$scope.activeUsername = u;

	$scope.renderPurchases = function (response) {
		console.log(response.itemId);
		$scope.purchases = response.itemId;	
	};

	$scope.all = function (response) {
		$http.get("/purchases")
		.success($scope.renderPurchases);
	}
	
	$scope.all();

}]);
ngIdpControllers.controller('shoppingCartCtrl', ['$scope', '$http', 'DataFactory','$cookieStore', function ($scope, $http, DataFactory,  $cookieStore) {
	console.log("Hello from shoppingCartCtrl");
	showTopNavBar($scope, DataFactory,$cookieStore);
	var u = $cookieStore.get('username');
	$scope.username = u;

	$scope.rendercartProducts = function (response) {
		console.log(response);
		$scope.cartproducts = response;	
	};

    $scope.total = function() {
        var total = 0;
   
        angular.forEach($scope.cartproducts, function(item) {
        	//console.log(total);
 
            total += item.price;
        });
        return total
    };

    $scope.item_count = function() {
        var item_count=0;
        angular.forEach($scope.cartproducts, function(item) {
  
        	item_count+=1;
            
        });
        return item_count
    };

	$scope.remove = function (id) {
		DataFactory.deleteData("/shoppingcart/" + id)
		.success(function(response){
			$scope.all();
		});
	};

	$scope.all = function () {
		$http.get("/shoppingcart")
		.success($scope.rendercartProducts);
        $scope.cards();
        $scope.shippingaddress();
	}

    $scope.cards=function () {
		$http.get("/cards")
		.success($scope.rendercards);

	};


	$scope.rendercards= function (response) {
		//console.log(response);
		$scope.rendercards = response;	
	};

	$scope.usethis = function (id) {
		$http.get("/cards/" + id)
		.success(function(response){
		});
	};

   $scope.shippingaddress=function () {
		$http.get("/address")
		.success($scope.renderaddress);

	};

	$scope.renderaddress= function (response) {
	
		$scope.rendershipaddress = response[0];	
	};

	$scope.payout = function () {
		
		var username=$cookieStore.get('username')
		angular.forEach($scope.cartproducts, function(item) {

			var item_json={
				"itemId":item.itemId,
				"username":username,
			};
			
			$http.post('/purchases',item_json)
			.success();
			
        });	
		alert("successfull transaction");
		DataFactory.deleteData("/removeCart")
		.success(function(response){
			console.log(response);
		});
	};
	$scope.all();
}]);