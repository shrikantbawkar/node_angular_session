var uiRouterApp = angular.module("myapp", ["ui.router"]);
uiRouterApp.controller("TravController", function($scope, $http) {
	$scope.isLoggedIn = false;
	$scope.isTravSharable = false;
	$scope.isTravShareContent = "";
	$scope.isLoggedIn = false;
	$http.post('/setSessionManeger').success(function(dataRef) {
		//alert("Username and password set Successfully!! : "+dataRef);
		if (dataRef.status) {
			$scope.userNameRef = "Hi "+dataRef.name;
			$scope.isLoggedIn = true;
		}
		else
		{
			
		}	
    }).error(function(e){
    	
    }); 

});
uiRouterApp.config(function($stateProvider, $urlRouterProvider){
	$stateProvider	
	.state("init", {
		url: "/", 
		templateUrl: "view/share.html", 
		controller: function($scope, $stateParams, $http){
			$scope.shareData = "";
			$scope.shareImg = "";
			$scope.isShareChecking = false;
			$http.get('/getTravShareDetails').success(function(dataRef) {
				//alert(dataRef.share);
				if(dataRef.share)
				{
					$scope.shareData = unescape(dataRef.share); 
					$scope.shareImg = unescape(String(dataRef.shareImg).split(",")[0]);
				}
			});
		}
	})
	.state("travergerShare", {
		url: "/travergerShare", 
		templateUrl: "view/share.html", 
		controller: function($scope, $stateParams, $http){
			//console.log("dummy data set Successfully : "+window.location.href.split("?")[1].split("=")[1]); 
			$scope.$parent.isTravSharable = true;
			$scope.$parent.isTravShareContent = window.location.href.split("?")[1].split("&")[0].split("=")[1]; 
			$scope.$parent.isTravShareImg = window.location.href.split("?")[1].split("&")[1].split("=")[1]; 
			$scope.isShareChecking = true;
			$scope.shareData = unescape($scope.$parent.isTravShareContent); 
			$scope.shareImg = unescape(String($scope.$parent.isTravShareImg).split(",")[0]);
			
		    $scope.shareContent = function()
		    {
		    	$http.post('/setTravShareDetails', { name: $scope.$parent.isTravShareContent, img: $scope.$parent.isTravShareImg}).success(function(dataRef) {
					//alert("Username and password set Successfully!! : "+dataRef);
					if (dataRef.status) {
						window.close();
					}
					else
					{
						window.location.href = "#/login";
					}	
			    }).error(function(e){
			    	window.location.href = "#/login";
			    });
		    }
		    $scope.cancelShare = function()
		    {
		    	window.close();
		    }
			/*setTimeout(function(){
				window.close();
			}, 1500);*/ 
		}

	})
	.state("home", {
		url: "/home", 
		templateUrl: "view/home.html"
	})
	.state("list", {
		url: "/list", 
		templateUrl: "view/list.html", 
		controller: "listController"
	})
	.state("login", {
		url: "/login", 
		templateUrl: "view/login.html", 
		controller: "loginController"
	})
	.state("signup", {
		url: "/signup", 
		templateUrl: "view/signup.html", 
		controller: "signupController"
	})
	.state("logout", {
		url: "/", 
		controller: function($scope, $stateParams, $http){
			$http.post('/setLogoutDetails').success(function(dataRef) {
		      	if (dataRef.status) {
			      	$scope.$parent.isLoggedIn = false;
					$scope.$parent.userNameRef = "";
				}
		    }).error(function(e){
		    	alert("Error while logout!!");
		    });

		}
	})
	.state("list.item", {
		url: "/:item", 
		templateUrl: "view/list.item.html", 
		controller: function($scope, $stateParams, $http){
			$scope.itemName = $stateParams.item;
			$scope.ajaxData = "";
			$scope.queryData = "";
			$http.get('/dummyAjax').success(function(dataRef) {
		      //alert(dataRef);
		      $scope.ajaxData = dataRef; 
		    });

		    $scope.changeDBData = function()
		    {
		    	//alert($scope.txtRef);
		    	$http.post('/dummyAjax', { name: $scope.txtRef });		    	
		    }
		    $scope.deleteDBData = function()
		    {
		    	$http.delete('/dummyAjax');	    	
		    }
		    $scope.setDummyDBData = function()
		    {
		    	$http.post('/setDummyData'); 
		    }
		    $scope.findDummyDBData = function()
		    {
		    	$http.get('/queryAjax').success(function(dataRef) {
			      //alert(queryData);
			      $scope.queryData = dataRef; 
			    });
		    }
		    $scope.refreshDBData = function()
		    {
		    	$http.get('/dummyAjax').success(function(dataRef) {
			      $scope.ajaxData = dataRef; 
			    }).error(function(e){
			    	alert("Error while refreshing!!");
			    });
		    }
		}
	})

	$urlRouterProvider.otherwise("/");
});

uiRouterApp.controller("listController", function($scope){
	$scope.imgList = [
		{name: "Chrysanthemum"},
		{name: "Desert"},
		{name: "Hydrangeas"},
		{name: "Jellyfish"},
		{name: "Koala"}
	];

	$scope.itemClicked = function(selectedItem){

		for(item in $scope.imgList)
		{
			item.selected = false;
			
			if(selectedItem === $scope.imgList[item])
			{
				selectedItem.selected = true;
			}
		}

	}

});

uiRouterApp.controller("loginController", function($scope, $stateParams, $http){
	$scope.username = "";
	$scope.password = "";
	$scope.errorMsg = ""; 
	$scope.validateCredientials = function()
	{
		$http.post('/validateLoginDetails', { username: $scope.username, password:$scope.password }).success(function(dataRef) {
			//alert("Username and password set Successfully!! : "+dataRef);
			if (dataRef.status) {
				$scope.$parent.userNameRef = "Hi "+dataRef.name;
				$scope.$parent.isLoggedIn = true;
				$scope.username = "";
				$scope.password = ""; 

				if($scope.$parent.isTravSharable)
				{
					$scope.$parent.isTravSharable = false;
					$http.post('/setTravShareDetails', { name: $scope.$parent.isTravShareContent, img: $scope.$parent.isTravShareImg}).success(function(dataRef1) {
						//alert("Username and password set Successfully!! : "+dataRef);
						if (dataRef1.status) {
							window.close();
						}
						else
						{
							$scope.errorMsg = "Error occured while sharing data !!"; 
							window.location.href = "#/login";
						}	
				    }).error(function(e){
				    	$scope.errorMsg = "Error occured while sharing data !!"; 
				    	window.location.href = "#/login";
				    });

				}
				else
				{
					window.location.href = "#/";
				}
				
			}
			else
			{
				$scope.errorMsg = "Incorrect credintials !! Try again. "; 
			}	
	    }).error(function(e){
	    	$scope.errorMsg = "Incorrect credintials !! Try again. "; 
	    	alert("Error while setting username and password!!");
	    });	
	}

});
uiRouterApp.controller("signupController", function($scope, $stateParams, $http){
	$scope.name = "";
	$scope.username = "";
	$scope.password = "";
	$scope.setCredientials = function()
	{
		$http.post('/setLoginDetails', { name: $scope.name, username: $scope.username, password:$scope.password }).success(function(dataRef) {
			if(dataRef.status){
				window.location.href = "#/login";
			}	
	    }).error(function(e){
	    	alert("Error while setting username and password!!");
	    });;	
	}

});