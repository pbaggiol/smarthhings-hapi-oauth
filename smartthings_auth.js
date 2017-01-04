/*

	This is a standalone webserver listening on port 3999, which calls the smartthings OAuth workflow to give
	you all the details you need to make WebServices requests to your smartapp.  This example is based on prior
	work done by tbeseda/smartthings-auth-example, only I found that it no longer worked with the latest simple-oauth2
	module.  So I updated it to work with that module, and the Hapi framework.

*/

var Hapi = require('hapi');
var http = require('http');
var request = require('request');

// Application Configuration

var API_ROOT = 'https://graph.api.smartthings.com';
var SERVER_ADDRESS = 'http://localhost:3999';

var config = {

	client: {
		id: 'Your Client ID Here', //Update Accordingly
		secret: 'Your Secret Here' //Update Accordingly
	},
	auth: {
		tokenHost:'https://graph.api.smartthings.com'
	}
};

var oauth2  = require('simple-oauth2').create(config);


var server = new Hapi.Server();
var serveroptions = {port: 3999};
server.connection(serveroptions);


// create auth uri for SmartThings
var authorization_uri = oauth2.authorizationCode.authorizeURL({
	redirect_uri: SERVER_ADDRESS+'/callback',
	scope: 'app'
});


server.route({path: "/", method: "GET", handler: function(req, reply) {
	reply('<a href=/auth>Login to Authenticate with SmartThings</a>');
}});

server.route({path: "/auth", method: "GET", handler: function(req, reply) {
	return reply.redirect(authorization_uri);
}});

server.route({path: "/callback", method: "GET", handler: function(req, reply) {

	var code = req.query.code;

	oauth2.authorizationCode.getToken({code: code, redirect_uri: SERVER_ADDRESS + '/callback'}, function (err, result) {

		if (err) {
			console.log('Access Token Error', err);
			return reply('Access Token Error', err);
		}

		// extract auth token
		var token = oauth2.accessToken.create(result);

		// setup request options with uri to get this app's endpoints
		// and add retrieved oauth token to auth header
		var request_options = {
			uri: API_ROOT+'/api/smartapps/endpoints',
			headers: { Authorization: 'Bearer '+token.token.access_token }
		};

		// Get the endpoint.
		request(request_options, function(err2, response, body) {
			if (err2) {
				console.log('Endpoints Request Error', err2);
				return reply('Endpoints Request Error', err2);
			}

			return reply("Authorization: " + request_options.headers.Authorization + " Uri: " +JSON.parse(body)[0]['uri']);
		});
	});

}});


server.start(function() {});
