'use strict';

const products = require('./products'),
      messaging = require('./messaging');

module.exports = {
  checkPage: products.checkPage,
  newResults: products.newResults,
  postNewResultsToChannel: messaging.postNewResultsToChannel,
  postMatchedResultsToUser: messaging.postMatchedResultsToUser
};
