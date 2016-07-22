/* A users module that presents a signup flow and saves the organisations, users and bots for the app */
'use strict';

const routes = require('routes'),
      express = require('express'),
      app = express(),
      router = express.Router(),
      request = require('request');

// Routes
router.get('/installed', function(req, res, next) {
  let code = req.query.code,
      client_id = process.env.client_id,
      client_secret = process.env.client_secret;
  let url = 'https://slack.com/api/oauth.access?code=' + code + '&client_id=' + client_id + "&client_secret=" + client_secret;
  request(url, function (err, res, body) {
    if (err) {
      console.log('Error: ', err);
    }
    let response = JSON.stringify(body);
    // Response
    if (response.ok) {
      // Set up the user locally
      console.log('Response: ', response);
      // Redirect to a confirmation page
    } else {
      // Redirect to error page
    }
  });

});

module.exports = router;
