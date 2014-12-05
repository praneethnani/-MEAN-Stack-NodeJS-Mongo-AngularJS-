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
    if(null == item.productId)
    {
    	continue;
    }
    var productId = item.productId[0].__value__;
    var idType = item.productId[0];
        
    if (null != title && null != viewitem) {
      html.push('<tr><td>' + '<img class="icon" src="' + pic + '" border="0">' + '</td>' + 
      '<td><td><a href="/#productDetail?id='+ productId+'" target="_blank">' + title + '</a></td>'+
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


