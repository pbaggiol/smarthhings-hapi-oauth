# smartthings-hapi-oauth

This is a standalone webserver (example) listening on port 3999, which calls the smartthings OAuth workflow to give
you all the details you need to make Web Services requests to your smartapp.  This example is based on prior
work done by tbeseda/smartthings-auth-example, only I found that it no longer worked with the latest simple-oauth2
module.  So I updated it to work with that module, and the Hapi framework.

At the end of this example, the user is presented with the Token and the endpoint URL needed to call their Web Services smart app.

In my experimentation, the token doesn't ever really expire for your smartapp, so you can run this code 'once' to get the token, however I would recommend you take the snippet that retreives the endpoint, and refesh that endpoint URL when your own node app starts. The endpioint seems to change everytime you save your 'smartapp' code.

- smartthings_auth.js and package.json include the code for the webserver.
- smartthings_api.js is seperate, but incluides an example of how to use.


