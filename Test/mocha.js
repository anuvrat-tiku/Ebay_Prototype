var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");
var it = require("mocha").it;
var describe = require("mocha").describe;

describe('http tests', function(){

    it('Login page API tested', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('Logged in successfully with uid : avtrulzz@yahoo.co.in. Login API tested', function(done) {
        request.post(
            'http://localhost:3000/afterSignIn',
            { form: { operation: "afterSignIn", uid:"avtrulzz@yahoo.co.in", password:"rootuser" } },
            function (error, res, body) {
                assert.equal(200, res.statusCode);
                done();
            }
        );
    });

    it('Should display cart details', function(done) {
        http.get('http://localhost:3000/cart', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('Sign Up user REST API call tested', function(done) {
        request.post(
            'http://localhost:3000/afterSignUp',
            { form: { operation: "afterSignIn", email:"ashish.verma@sjsu.edu", email:"ashish.verma@sjsu.edu",  password:"testuser", fname : "Ashish", lname: "Verma", phone: "9819904333" } },
            function (error, res, body) {
                assert.equal(200, res.statusCode);
                done();
            }
        );
    });

    it('Homepage successfully displayed API testing for homepage', function(done) {
        http.get('http://localhost:3000/homepage', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });
});0