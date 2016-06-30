'use strict';

const request = require('request'),
      cheerio = require('cheerio');

function cleanDescription(description) {
  let updatedDescription = description
    .split('</h3>')[1]
    .split('</p>')[1]
    .replace(/(?:\r\n|\r|\n)/g, '')
    .trim();
  return '<p>' + updatedDescription + '</p>';
}

module.exports = function(url) {
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
          let image = $(this).find('img').attr('src');
          let matchText = $(this).find('.specs').text().toLowerCase().replace(/\W+/g, " ");
          let title = $(this).find('.specs h3 a').text().trim();
          let link = 'http://apple.com' + $(this).find('.specs h3 a').attr('href');
          let description = cleanDescription($(this).find('.specs').html());
          // Extract the title, description and image
          results.push({
            id: id,
            image: image,
            link: link,
            title: title,
            description: description,
            matchText: matchText
          });
        });
        resolve(results);
      }
    });
  });
}
