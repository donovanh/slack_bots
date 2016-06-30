'use strict';

const request = require('request'),
      cheerio = require('cheerio');

function cleanDescription(description) {
  let updatedDescription = description
    .split('</h3>')[1]
    .split('</p>')[1]
    .replace(/(?:\r\n|\r|\n)/g, '')
    .replace(/<br>/g, '\n')
    .trim();
  return updatedDescription;
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
