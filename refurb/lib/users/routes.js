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
      {"ok":true,"access_token":"xoxp-15550051014-15550051062-56509410246-fde319a3b1",
      "scope":"identify,bot,incoming-webhook","user_id":"U0FG61H1U","team_name":"donovanh",
      "team_id":"T0FG61H0E","incoming_webhook":{"channel":"#refurbs","channel_id":"C1MPWH42G",
      "configuration_url":"https:\/\/donovanh.slack.com\/services\/B1NFFA8JD",
      "url":"https:\/\/hooks.slack.com\/services\/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"},
      "bot":{"bot_user_id":"U1NFJCCEN","bot_access_token":"xoxb-56528420498-4FeRCdxnbCtZfsmP5X02S4Sd"}}
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
