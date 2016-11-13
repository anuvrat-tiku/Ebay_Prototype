var ejs = require('ejs');
var mysql = require('./mysql.js');

var encrypt_pwd = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'anuvrut';

function encrypt(text){
    var cipher = encrypt_pwd.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = encrypt_pwd.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

var jsonRes;

exports.afterSignIn = function(req, res) {

    var user = req.param("uid");
    var pwd = req.param("password");
    var u = "'" + user + "'";
    var p = "'" + encrypt(pwd) + "'";
    console.log(u);
    console.log(p);
    var getUser = "SELECT * FROM USER_TABLE WHERE USERID = " + u + " AND PASSWORD=" +
        p ;
    console.log("Query is : " + getUser);

    mysql.getData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("valid login");

                console.log(results[0].EMAIL);
                var rows = results;
                console.log("Variable rows is : "+rows);

                //INITIALISE SESSION WITH USERNAME AND EMAIL ID
                req.session.email = results[0].EMAIL;
                req.session.username = results[0].USERID;
                req.session.fname = results[0].FIRSTNAME;
                jsonRes = {
                    statusCode: 200
                };
                res.send(jsonRes);

            } else {
                res.statusCode = 404
                console.log("Invalid login");

            }
        }
    }, getUser);
}

exports.postSignUp = function(req, res) {

    //Get firstname and last name to generate random user ID
    var id1 = req.param("fname");
    var id2 = req.param("phone");
    var id3 = req.param("lname");

    var e = "'" + req.param("email") + "'";
    var pw = req.param("password");
    var p = "'" + encrypt(pw) + "'";
    var fn = "'" + req.param("fname") + "'";
    var ph = "'" + req.param("phone") + "'";
    var ln = "'" + req.param("lname") + "'";

    //This name without the quotations will be sent back to the angular file.
    var name = id1.substring(0, 5) + id2.substring(0, 2) + id3.substring(0, 3);

    var userid = "'" + id1.substring(0, 5) + id2.substring(0, 2) + id3.substring(0, 3) + "'";

    var checkUser = "SELECT * FROM USER_TABLE WHERE USERID = " + userid ;
    var addUser =
        "INSERT INTO USER_TABLE VALUES (" + e + "," + p + "," + fn + "," + ln + "," + userid + "," + ph + "," + "100000 )";
    console.log("Query is : " + addUser);

    mysql.getData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                console.log("User already exists" + "\n");
                console.log("To do : redirect user to the home page");
                res.redirect('/');
            } else {
                mysql.getData(function(err, results) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(results);
                        var temp = JSON.stringify(results);
                        var temp2 = JSON.parse(temp);
                        req.session.email = temp2[0].EMAIL;
                        req.session.username = temp2[0].USERID;
                        req.session.fname = temp2[0].FIRSTNAME;
                        console.log("User added to the database.");
                        console.log("Successfully signed up : " + req.param("fname") + " " + req.param("lname"));
                        jsonRes = {
                            "statusCode" : 200
                        }
                        res.send(jsonRes);
                    }
                }, addUser);
            }
        }
    }, checkUser);
};


function getAllUsers(req, res) {
    var getAllUsers = "SELECT * FROM USER_TABLE";
    console.log("Query is : " + getAllUsers);

    mysql.getData(function(err, results) {
        if (err) {
            throw err;
        } else {
            if (results.length > 0) {
                var rows = results;
                var jsonString = JSON.stringify(results);
                var jsonParse = JSON.parse(jsonString);

                console.log("Results Type : " + (typeof results));
                console.log("Result Element Type:" + (typeof rows[0].emailid));
                console.log("Results Stringify Type:" + (typeof jsonString));
                console.log("Results Parse Type:" + (typeof jsString));

                console.log("Results: " + (results));
                console.log("Result Element:" + (rows[0].emailid));
                console.log("Results Stringify:" + (jsonString));
                console.log("Results Parse:" + (jsonParse));

                ejs.renderFile('./views/successLogin.ejs', { data: jsonParse }, function(err, result) {
                    if (!err) {
                        res.end(result);
                    } else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });
            } else {
                console.log("No users found in database");
                ejs.renderFile('./views/failLogin.ejs', function(err, result) {
                    if (!err) {
                        res.end(result);
                    } else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });
            }
        }
    }, getAllUsers);
}

exports.homepage = function(req, res) {

    console.log("HELLO WORLD FORM MAIN.JS");
    console.log("Session owner redirected to homepage");

    if(req.session.username)
    {

        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/homepage.ejs',{fname: req.session.fname});
    }
    else
    {
        res.redirect('/');
    }
};

exports.usernameOnSignUp = function (req, res) {
    console.log("A new user has just signed up");

    if (req.session.username && req.session.fname) {
        console.log("Uniquely generated username : "+req.session.username);
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/usernameOnSignUp.ejs',{username:req.session.username, fname: req.session.fname});

    }
};

exports.sell =function (req, res) {
    console.log("Hello from seller page");

    if (req.session.fname && req.session.username) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/sell.ejs',{username:req.session.username, fname: req.session.fname});
    } else {
        res.redirect('/');
    }
}

exports.enterItemToSell = function (req, res) {
    var title = req.param("sell_item_text");
    console.log("Product title is : ", title);

    var jsonResponse = {
        code : 200
    };

    res.send(jsonResponse);
}

exports.SellItemDescription = function(req, res) {


    if (req.session.fname && req.session.username) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/enterItemToSell.ejs',{username:req.session.username, fname: req.session.fname});
    } else {
        res.redirect('/');
    }
}

exports.addNewProduct = function (req, res) {
    if (req.session.fname && req.session.username && req.session.email) {
        console.log("Hello from /addNewProduct");
        /*
         var data = {
         title : $scope.product_title,
         con : condition,
         description : $scope.item_description,
         value : value,
         category : $scope.category,
         quantity : $scope.quantity
         sell_type : $scope.sells,
         }
         */

        /*
         ITEM_CATEGORY, PRICE, SELLER, QUANTITY, IMAGES, ITEM_CONDITION, TITLE, SELL_TYPE
         */
        var category = "'" + req.param("category") + "'";
        var price = "'" + req.param("value") + "'";
        var seller = "'" + req.session.email + "'";
        var quantity = "'" + req.param("quantity") + "'";
        var images = "'" + "" + "'";
        var condition = "'" + req.param("con") + "'";
        var title = "'" + req.param("title") + "'";
        var sell = "'" + req.param("bora") + "'";
        var description = "'" + req.param("description") + "'";

        var query =
            "INSERT INTO PRODUCTS (ITEM_CATEGORY, PRICE, SELLER, QUANTITY, IMAGES, ITEM_CONDITION, TITLE, SELL_TYPE, ITEM_DESCRIPTION) VALUES (" +
                category + "," + price + "," + seller + "," + quantity + "," + images + "," + condition + "," + title +
            "," + sell + "," + description + ")";

        console.log(query);
        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                console.log("Product added to the database.");

                jsonRes = {
                    statusCode: 200,
                    };
                res.send(jsonRes);
            }
        }, query);
    };
}

exports.confirmAddition = function (req, res) {
    if(req.session.username && req.session.fname && req.session.email) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/confirmAddition.ejs',{username:req.session.username, fname: req.session.fname});
    } else {
        res.redirect('/');
    }
};

exports.display_products = function (req, res) {
    if(req.session.username && req.session.fname && req.session.email) {

        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        var email = "'" + req.session.email + "'";
        var values;

        var query = "SELECT * FROM PRODUCTS WHERE SELLER NOT LIKE " + email;
        console.log(query);

        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                values = JSON.parse(temp);

                ejs.renderFile('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/display_products.ejs',
                    {username : req.session.username, fname : req.session.fname, email : req.session.email, values : values},
                    function(err, result) {
                        if (!err) {

                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });
            }

        }, query);

    } else {
        res.redirect('/');
    }
};

exports.product = function (req, res) {
    if (req.session.username && req.session.fname && req.session.email) {
        var product_info;

        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        var temp_id = req.param("item_num");
        req.session.p_id = temp_id;
        var id = "'" + req.param("item_num") + "'";
        console.log("Item to be sold is : "+id);
        var query = "SELECT * FROM products WHERE ITEM_NUM = "+id;

        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                product_info = JSON.parse(temp);
                req.session.item_info = product_info;

            }
        }, query);

        jsonRes = {
            statusCode: 200,
        };
        res.send(jsonRes);

    } else {
        console.log("Error in redirecting to display products page");
    }
};

exports.product_description = function(req, res) {

    var product_info;

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if (req.session.fname && req.session.username && req.session.p_id) {

        var id = "'" + req.session.p_id + "'";
        var query = "SELECT * FROM products WHERE ITEM_NUM = "+id;

        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                product_info = JSON.parse(temp);
                //The below session variable will be used on the cart page.
                req.session.item_info = product_info;

                ejs.renderFile('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/product_description.ejs',
                    {username : req.session.username, fname : req.session.fname, email : req.session.email, values : product_info},
                    function(err, result) {
                        if (!err) {

                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    });

            }
        }, query);
    } else {
        console.log("Some bloody error");
    }
};

exports.addToCart = function (req, res) {
    if (req.session.email && req.session.fname) {
        console.log("i am here");
        var quantity = "'" + req.param("quantity") + "'";
        var item = req.session.item_info;

        var buyer = "'" +req.session.email + "'";
        var item_num = "'" + item[0].ITEM_NUM + "'";
        var total = "'" + item[0].PRICE * req.param("quantity") + "'";

        var query = "INSERT INTO CART(ITEM_NUMBER, BUYER, QUANTITY, TOTAL_PRICE) VALUES ("
        + item_num + "," + buyer + "," + quantity + "," + total + ")";

        console.log(query);

        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                temp = JSON.parse(temp);

            }
        }, query);

        jsonRes = {
            statusCode: 200,
        };
        res.send(jsonRes);

    } else {
        console.log("Error in adding to cart!")
    }
};


exports.successfullyAddedToCart = function(req, res) {
    if (req.session.email && req.session.fname) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/successfullyAddedToCart.ejs',{username:req.session.username, fname: req.session.fname});
    }
     else {
        res.redirect('/');
    }
};

exports.cart = function (req, res) {
    if (req.session.fname && req.session.username) {

        var email = "'" + req.session.email + "'";
        var query = "Select cart.total_price, cart.buyer, cart.cart_id, products.item_num, products.price, products.quantity as 'available', cart.quantity, products.item_description, products.seller, products.images from cart inner join products on cart.item_number = products.item_num where cart.buyer =" + email + "GROUP BY item_num";

        console.log(email);
        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                var temp2 = JSON.parse(temp);

                var sum = 0;
                for (var i in temp2) {
                    sum = sum+ temp2[i].total_price ;
                }

                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                ejs.renderFile(
                    'C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/cart.ejs',
                    {username : req.session.username, fname : req.session.fname, email : req.session.email, values : temp2, cart_total : sum},
                    function(err, result) {
                        if (!err) {

                            res.end(result);
                        }
                        else {
                            res.end('An error occurred');
                            console.log(err);
                        }
                    }
                );


            }
        }, query);

    } else {
        console.log("Cart Error");
    }
};

exports.summary = function (req, res) {
    if (req.session.email && req.session.fname) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        var id = "'" + req.session.email + "'";
        var query = "SELECT * FROM USER_INFO WHERE USER = " + id;

        console.log(query);

        mysql.getData(function (err, results) {
            if (err) {
                throw err;
            } else {
                console.log(results);
                var temp = JSON.stringify(results);
                var temp2 = JSON.parse(temp);
                ejs.renderFile('C:/Users/Anuvrat Tiku/nodeworkspace/Lab1_Ebay/views/summary.ejs',{username:req.session.username, fname: req.session.fname, values : temp2}, function(err, result) {
                    if (!err) {

                        res.end(result);
                    }
                    else {
                        res.end('An error occurred');
                        console.log(err);
                    }
                });

            }
        }, query);

    } else {
        res.redirect('/');
    }
};

exports.logout = function (req, res) {
    if (req.session.fname) {
        req.session.destroy();
        res.redirect('/');
    } else {
        console.log("Redirect Error");
    }
};

//exports.afterSignIn = afterSignIn;
//exports.postSignUp = postSignUp;
exports.getAllUsers = getAllUsers;