'use strict';

var ngIdpControllers = angular.module('ngIdpControllers', []);

ngIdpControllers.controller('SignInCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {
	console.log("Hello from SignInCtrl");

	$scope.validate = function () {
		DataFactory.checkPost("/AuthenticateUser", $scope.login)
		.success(function(json){
			if (json!="success"){
				alert(json);
			}else{
				location.replace("http://localhost:3000/" + "#homePage");
			}
		});
	}
}]);

ngIdpControllers.controller('HomepageCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {
	 console.log("Hello from HomepageCtrl");
	
	DataFactory.getUserName("/username").success(function(json){
		$scope.username = json;
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
					'<td><td><a href="/#productDetail?id='+ itemId+'" target="_blank">' + title + '</a></td>'+
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
			_cb_findItemsByKeywords(data);
		}
	});
}

}]);

ngIdpControllers.controller('registrationCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {

	$scope.registerUser = function () {
		DataFactory.checkPost("/RegisterUser", $scope.register)
		.success(function(json){
			if (json!="success"){
				alert(json);
			}else{
				location.replace("http://localhost:3000/" + "#homePage");  
			}
		});
	}
}]);

ngIdpControllers.controller('productDetailCtrl', ['$scope','DataFactory', function ($scope, DataFactory) {
	console.log("Hello from productDetailCtrl");
	var url = document.URL;
	var urlContents = url.split("=");
	var ItemID = urlContents[1];
	console.log(ItemID);
	DataFactory.fetchByItemId("/EbayFetchByItemId/"+ ItemID)
	.success(function(json){
		console.log(json);
			//location.replace("http://localhost:3000/" + "#homePage");
		});

}]);

ngIdpControllers.controller('commentCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
	console.log("Hello from commentCtrl");

	DataFactory.getUserName("/username").success(function(json){
		console.log(json);
		$scope.username = json;
	});

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
			$scope.comment = response;
		});
	};

	$scope.all = function (response) {
		$http.get("/comments")
	.success($scope.renderComments);
	}
	
	$scope.all();
}]);

ngIdpControllers.controller('savedProductsCtrl', ['$scope', '$http', 'DataFactory', function ($scope, $http, DataFactory) {
	console.log("Hello from savedProductsCtrl");
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
		$http.get("/savedProducts")
	.success($scope.renderSavedProducts);
	}
	
	$scope.all();

}]);

