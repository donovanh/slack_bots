'use strict';

const request = require('request'),
      cheerio = require('cheerio');

function buildRegex(keywords) {
  // ^(?=.*\bmeat\b)(?=.*\bpasta\b)(?=.*\bdinner\b).+
  let regex = '';
  keywords.forEach(function(keyword) {
    regex += '(?=.*'+ keyword +')'
  });
  regex += '.+';
  return regex;
}

function cleanDescription(description) {
  let updatedDescription = description
    .split('</h3>')[1]
    .split('</p>')[1]
    .replace(/(?:\r\n|\r|\n)/g, '')
    .trim();
  return '<p>' + updatedDescription + '</p>';
}

module.exports = function(settings) {
  // Use the settings.url and settings.keywords to check products on the page
  return new Promise(function(resolve, reject) {
    request(settings.url, function (error, response, html) {
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
        const matched = [];
        const regex = buildRegex(settings.keywords);
        $('.product').each(function(i, element){
          let id = $(this).find('.specs h3 a').attr('data-s-object-id');
          let image = $(this).find('img').attr('src');
          let productText = $(this).find('.specs').text();
          let matchString = productText.toLowerCase().replace(/\W+/g, " ");
          if (matchString.search(regex) > -1) {
            let title = $(this).find('.specs h3 a').text().trim();
            let link = 'http://apple.com' + $(this).find('.specs h3 a').attr('href');
            let description = cleanDescription($(this).find('.specs').html());
            // Extract the title, description and image
            matched.push({
              id: id,
              image: image,
              link: link,
              title: title,
              description: description
            });
          }
        });
        resolve(matched);
      }
    });
  });
}
