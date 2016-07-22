'use strict';

function postNewResultsToChannel(bot, results) {
  var currentdate = new Date(); 
  var datetime = currentdate.getDate() + "/"
                  + (currentdate.getMonth()+1)  + "/" 
                  + currentdate.getFullYear() + " @ "  
                  + currentdate.getHours() + ":"  
                  + currentdate.getMinutes() + ":" 
                  + currentdate.getSeconds();
  console.log(results.length + ' new results found at ' + datetime);
  results.forEach(function(result) {
    bot.postMessageToChannel('dev', 'results found...');
    bot.postMessageToChannel('dev', buildAttachments(result, '#764FA5'));
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
