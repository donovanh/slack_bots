'use strict';

const express = require('express'),
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
    /*
      {"ok":true,"access_token":"",
      "scope":"identify,bot,incoming-webhook","user_id":"1234","team_name":"donovanh",
      "team_id":"1234","incoming_webhook":{"channel":"#refurbs","channel_id":"1234",
      "configuration_url":"https:\/\/donovanh.slack.com\/services\/B1NFFA8JD",
      "url":"https:\/\/hooks.slack.com\/services\/T0FG61H0E\/B1NFFA8JD\/1234"},
      "bot":{"bot_user_id":"1234","bot_access_token":""}}
    */
    if (response.ok) {
      // Set up the user locally

      // Redirect to a confirmation page
    } else {
      // Redirect to error page
    }
  });

});

module.exports = router;
