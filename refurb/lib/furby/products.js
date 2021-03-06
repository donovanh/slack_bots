'use strict';

const request = require('request'),
      cheerio = require('cheerio'),
      jsonfile = require('jsonfile'),
      storageFile = __dirname + '/data/data.json';
/*
 * newResults: Compares product results to the list of ids in the data store and updates data store with new items
 * Returns any new items as an array of results
 * Public method
 */
let newResults = function(results) {
  return new Promise(function(resolve, reject) {
    jsonfile.readFile(storageFile, function(err, data) {
      if (err) {
        console.log('Error: ', err);
      }
      const newResults = [];
      let numberOfItems = data.ids.length;
      results.forEach(function(result) {
        if (data.ids.indexOf(result.id) === -1) {
          // Insert this item to the results
          data.ids.push(result.id);
          // Save it as a "new" result
          newResults.push(result);
        }
      });
      // If the number of data ids has increased, this means there's new items added
      if (data.ids.length > numberOfItems) {
        // Write back the resulting file
        jsonfile.writeFile(storageFile, data, function (err) {
          if (err) console.error(err);
        });
      }
      resolve(newResults);
    });
  });
}
/*
 * checkPage: Checks a refurb url and returns an array of products
 * Public method
 */
let checkPage = function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, html) {
      if (error) {
        reject(error);
        return;
      }
      if (response.statusCode !== 200) {
        reject(response.statusCode);
        return;
      } else {
        // All good
        const $ = cheerio.load(html);
        const results = [];
        $('.product').each(function(i, element){
          let id = $(this).find('.specs h3 a').attr('data-s-object-id');
          let image = $(this).find('img').attr('src').replace('wid=110&hei=78', 'wid=330&hei=234');
          let matchText = $(this).find('.specs').text().toLowerCase().replace(/\W+/g, " ");
          let title = $(this).find('.specs h3 a').text().trim();
          let link = 'http://apple.com' + $(this).find('.specs h3 a').attr('href');
          let price = $(this).find('.price').text().trim();
          let description = cleanDescription($(this).find('.specs').html());
          // Extract the title, description and image
          results.push({
            id: id,
            image: image,
            link: link,
            title: title,
            price: price,
            description: description,
            matchText: matchText
          });
        });
        resolve(results);
      }
    });
  });
}
/*
 * cleanDescription: Take the scraped HTML from the page and tidy it up
 * Private method
 */
function cleanDescription(description) {
  let updatedDescription = description
    .split('</h3>')[1]
    .split('</p>')[1]
    .replace(/(?:\r\n|\r|\n)/g, '')
    .replace(/<br>/g, '\n')
    .trim();
  return updatedDescription;
}

// Expose the public methods
module.exports = {
  checkPage: checkPage,
  newResults: newResults
};
