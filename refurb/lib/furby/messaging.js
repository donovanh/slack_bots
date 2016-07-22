'use strict';

function postNewResultsToChannel(bot, results) {
  console.log(results.length + ' new results found');
  bot.postMessageToChannel('dev', '', {"icon_emoji":":apple:","attachments":[{"pretext": "Hey yo", "title":"Refurbished 13.3-inch MacBook Pro 2.5GHz Dual-core Intel i5","title_link":"http://apple.com/ie/shop/product/G0MT5B/A/refurbished-133-inch-macBook-Pro-25ghz-Dual-core-Intel-i5","text":"*€1,159.00*\nOriginally released June 2012\n13.3-inch (diagonal) LED-backlit glossy widescreen display, 1280-by-800 resolution\n8GB (2 x 4GB) of 1600MHz DDR3 SDRAM\n500GB Serial ATA @ 5400 rpm\n8x double-layer SuperDrive (DVD&#xB1;R DL/DVD&#xB1;RW/CD-RW)\nIntel HD Graphics 4000","image_url":"http://store.storeimages.cdn-apple.com/4662/as-images.apple.com/is/image/AppleInc/aos/published/images/r/ef/refurb/macbookpro/refurb-macbookpro-13in-mavericks?wid=330&hei=234&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,1.5,0,0&iccEmbed=0&layer=comp&.v=Ouall2","color":"#764FA5","mrkdwn_in":["text"]}]});
  results.forEach(function(result) {
    bot.postMessageToChannel('dev', '', buildAttachments(result, '#764FA5'));
  }); 
}

function postMatchedResultsToUser(bot, results, user, keywords) {
  results.forEach(function(result) {
    if (isMatch(result.matchText, keywords)) {
      // TODO: Build a createMessage function that introduces more pertinent info / personality
      // Also, set the colour different for each product
      bot.postMessageToUser(user, 'I found a match for you on the Apple refurb store!', buildAttachments(result, '#96E23E'));
    }
  });
}
function buildAttachments(result, color) {
  let text = '*' + result.price + '*\n';
  text += result.description;
  return {
    "icon_emoji": ":apple:",
    "attachments": [
      {
        "title": result.title,
        "title_link": result.link,
        "pretext": "A new item was added to the refurb store!",
        "text": text,
        "image_url": result.image,
        "color": color,
        "mrkdwn_in": [
          "text",
          "pretext"
        ]
      }
    ]
  };
}
function buildRegex(keywords) {
  // ^(?=.*\bmeat\b)(?=.*\bpasta\b)(?=.*\bdinner\b).+
  let regex = '';
  keywords.forEach(function(keyword) {
    regex += '(?=.*'+ keyword +')'
  });
  regex += '.+';
  return regex;
}

function isMatch(matchText, keywords) {
  // Return true if this matches keywords
  let regex = buildRegex(keywords);
  return matchText.search(regex) > -1 ? true : false;
}

module.exports = {
  postNewResultsToChannel: postNewResultsToChannel,
  postMatchedResultsToUser: postMatchedResultsToUser
};
