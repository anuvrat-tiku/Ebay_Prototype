var app = angular.module('indexPage', []);

app.controller('LoginController', function($scope, $http) {


    $scope.login_User = function() {

        $scope.loginError = false;
        //This variable will be passed to the main home page
        var info = {
            session_owner : $scope.reg_firstname
        };

        var data = {
            "uid": $scope.user_email,
            "password": $scope.pwd
        }

        console.log(data);


        $http({
            method: "POST",
            url: '/afterSignIn',
            data: data

        }).success(function(response) {
            if (response.statusCode == 200) {
                $scope.loginError = false;
                console.log("Successful Login");
                //Redirect to app.js and look for /main
                window.location.assign('/homepage');
            } else {
                console.log("Login failed");
                $scope.loginError = true;
            }
        });
    };
});

app.controller('RegisterUserController', function($scope, $http) {


    $scope.register_User = function() {

        //Displaying an error message if the email id is not equal to the re enter email address.
        var email = $scope.reg_email;
        var reemail = $scope.reenter_email;
        $scope.email_error = false;
        if (email != reemail) {
            $scope.email_error = true;
        }
        var data = {
            email: $scope.reg_email,
            password: $scope.reg_password,
            fname: $scope.reg_firstname,
            lname: $scope.reg_lastname,
            phone: $scope.reg_mobile
        }
        console.log(data);

        //Handing the Register submit button on the index page.
        $http({
            method: "POST",
            url: '/postSignUp',
            data: data

        }).success(function(response) {
            if (response.statusCode == 200) {
                console.log("Successful Login");
                $scope.login = false;

                //Redirect to app.js and call /homepage
                window.location.assign('/usernameOnSignUp');
            } else {
                console.log("Login failed");
                $scope.login = true;
            }
        });
    }

});

app.controller('ToHomePageController', function($scope) {
    $scope.RouteToHomePage = function () {
        window.location.assign('/homepage');
    }
});

app.controller('CustomizeIdController', function($scope) {
    $scope.changeIDLink = true;
    $scope.changeID = false;
    $scope.CustomizeUsername = function() {
        $scope.changeIDLink = false;
        $scope.changeID = true;
    }

    $scope.updateID = function () {
        //Enter to do for updating user ID in database.
    }

});