/**
 * Created by Anuvrat Tiku on 10/8/2016.
 */
var app = angular.module('HomePageApp', []);

app.controller('Row2Controller', function ($scope) {

    //Redirect to home page on ebay icon click
    $scope.ToHomePage = function () {
        window.location.assign('/homepage');
    }

});

app.controller('Row1Controller', function ($scope) {

    //Direct user to Ebay Seller page
    $scope.ToSellerPage = function () {
        window.location.assign('/sell');
    }
});

app.controller('SellController', function ($scope, $http) {
    $scope.addToSellItems = function () {
        var data = {
            sell_item_text : $scope.sell_item_text
        }
        console.log("Item title entered in the selling input field : ", data);

        $http({
            method : "POST",
            url : '/enterItemToSell',
            data : data
        }).success(function (response) {
            if (response.code == 200) {
                console.log("Redirecting to the page where product");
                window.location.assign('/SellItemDescription');
            } else {
                console.log("Some error in redirecting");
            }
        });
    };
});

app.controller('AddProductController', function ($scope, $http) {

    $scope.user_information = true;
    $scope.sell_model = false;
    $scope.auction_model = false;

    $scope.sell_type = function () {
        if ($scope.sells === '1') {
            $scope.sell_model = false;
            $scope.auction_model = true;
        } else if ($scope.sells === '2') {
            $scope.sell_model = true;
            $scope.auction_model = false;
        } else {
            console.log("Nothing");
        }
    };

    $scope.addProduct = function () {
        console.log($scope.sells);
        console.log($scope.condition);

        var value;
        var condition;
        var bora;

        if ($scope.sells === '1') {
            value = $scope.auction_amount;
        } else if ($scope.sells === '2') {
            value = $scope.sell_amount;
        } else {
            console.log("Nothing");
        }

        if ($scope.condition === '1') {
            condition = "New";
        } else {
            condition = "Used";
        }

        if ($scope.sells === '1') {
            bora = 1;
        } else {
            bora = 0;
        }

        var data = {
            title : $scope.product_title,
            con : condition,
            description : $scope.item_description,
            value : value,
            category : $scope.category,
            quantity : $scope.quantity,
            bora : bora,
        }
        console.log(data);
        //Call the function in home.js and add the product to the list
        $http ({
            method : "POST",
            url : '/addNewProduct',
            data  : data,
        }).success(function (response) {
            if (response.statusCode == 200) {
                console.log("Redirecting to the page where product");
                window.location.assign('/confirmAddition');
            } else {
                console.log("Some error in redirecting");
            }
        });
    };
});

app.controller('AllProducts', function ($scope) {
    $scope.ShowAllProducts = function () {
        window.location.assign('/display_products');
    }
});

app.controller('ProductDetailsController', function ($scope, $http) {
    $scope.viewItem = function (data) {
        var data = {
            item_num : data
        }

        $http ({
            method : "POST",
            url : '/product',
            data : data

        }).success(function (response) {
            if (response.statusCode == 200) {
                console.log("Redirecting to the page where product");
                window.location.assign('/product_description');
            } else {
                console.log("Some error in redirecting");
            }
        });
    }
});

app.controller('AddToCartController', function ($scope, $http) {

    $scope.AddToCart = function() {
        var data =
        {
            quantity : $scope.order_quantity
        }

        $http({
            method : "POST",
            url : '/addToCart',
            data : data
        }).success(function (response) {
            if (response.statusCode == 200) {
                console.log("Redirect to successfully added to cart");
                window.location.assign('/successfullyAddedToCart');
            } else {
                console.log("Some error in redirecting");
            }
        });
    };
});

