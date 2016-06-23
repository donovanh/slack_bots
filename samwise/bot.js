'use strict';
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

  -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('./lib/Botkit.js'),
    os = require('os'),
    request = require('request'),
    cheerio = require('cheerio');

var controller = Botkit.slackbot({
  debug: false
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'Hello ' + user.name + '!!');
    } else {
      bot.reply(message, 'Hello.');
    }
  });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
  var name = message.match[1];
  controller.storage.users.get(message.user, function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user, function(err, id) {
      bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

  controller.storage.users.get(message.user, function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'Your name is ' + user.name);
    } else {
      bot.startConversation(message, function(err, convo) {
        if (!err) {
          convo.say('I do not know your name yet!');
          convo.ask('What should I call you?', function(response, convo) {
            convo.ask('You want me to call you `' + response.text + '`?', [
              {
                pattern: 'yes',
                callback: function(response, convo) {
                  // since no further messages are queued after this,
                  // the conversation will end naturally with status == 'completed'
                  convo.next();
                }
              },
              {
                pattern: 'no',
                callback: function(response, convo) {
                  // stop the conversation. this will cause it to end with status == 'stopped'
                  convo.stop();
                }
              },
              {
                default: true,
                callback: function(response, convo) {
                  convo.repeat();
                  convo.next();
                }
              }
            ]);

            convo.next();

          }, {'key': 'nickname'}); // store the results in a field called nickname

          convo.on('end', function(convo) {
            if (convo.status == 'completed') {
              bot.reply(message, 'Yes, absolutely...');

              controller.storage.users.get(message.user, function(err, user) {
                if (!user) {
                  user = {
                    id: message.user,
                  };
                }
                user.name = convo.extractResponse('nickname');
                controller.storage.users.save(user, function(err, id) {
                  bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                });
              });



            } else {
              // this happens if the conversation ended prematurely for some reason
              bot.reply(message, 'OK, nevermind!');
            }
          });
        }
      });
    }
  });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
  'direct_message,direct_mention,mention', function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,
      ':robot_face: I am your loyal sidekick, <@' + bot.identity.name +
       '>. I am a bot and have been running for ' + uptime + '.');

  });

controller.hears(['hungry', 'lunch', 'stew', 'fish'],
  'direct_message,direct_mention,mention', function(bot, message) {

  bot.reply(message, 'Po-ta-toes! Boil them, mash them, stick them in a stew. Lovely big golden chips with a nice piece of fried fish.');

});

controller.hears(['potato', 'potatoes'],
  'ambient', function(bot, message) {

  bot.reply(message, 'Po-ta-toes! Boil them, mash them, stick them in a stew. Lovely big golden chips with a nice piece of fried fish.');

});

controller.hears(['garden', 'gardening'],
  'ambient', function(bot, message) {

  bot.reply(message, 'Not to be droppin\' any eaves sir, but in my estimation there is no better way to spend an afternoon than in the garden.');

});

controller.hears(['morning'],
  'direct_message,direct_mention,mention', function(bot, message) {

  bot.reply(message, 'Good day to you!');
  getWeather('http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=' + 02888, function(response) {
    bot.reply(message, response);
  });

});

controller.hears(['today', 'what(.*) up', 'weather'],
  'direct_message,direct_mention,mention', function(bot, message) {

  bot.reply(message, 'Let\s see how today is looking so...');
  setTimeout(function() {
    bot.reply(message, { type: 'typing' });
    getWeather('http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=' + 02888, function(response) {
      bot.reply(message, response);
    });
  }, 500);

});

function getWeather(url, callback) {
  request(url, function (error, response, body) {
    if (!error) {
      var $ = cheerio.load(body),
        temperature = $("[data-variable='temperature'] .wx-value").html();

      callback("It’s " + temperature + " degrees Fahrenheit.");
    }
  });
}

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit + 's';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}

/*
// Example of rich response
// listen for the phrase `shirt` and reply back with structured messages
// containing images, links and action buttons
controller.hears(['shirt'],'message_received',function(bot, message) {
    bot.reply(message, {
        attachment: {
            'type':'template',
            'payload':{
                 'template_type':'generic',
                 'elements':[
                   {
                     'title':'Classic White T-Shirt',
                     'image_url':'http://petersapparel.parseapp.com/img/item100-thumb.png',
                     'subtitle':'Soft white cotton t-shirt is back in style',
                     'buttons':[
                       {
                         'type':'web_url',
                         'url':'https://petersapparel.parseapp.com/view_item?item_id=100',
                         'title':'View Item'
                       },
                       {
                         'type':'web_url',
                         'url':'https://petersapparel.parseapp.com/buy_item?item_id=100',
                         'title':'Buy Item'
                       },
                       {
                         'type':'postback',
                         'title':'Bookmark Item',
                         'payload':'USER_DEFINED_PAYLOAD_FOR_ITEM100'
                       }
                     ]
                   },
                   {
                     'title':'Classic Grey T-Shirt',
                     'image_url':'http://petersapparel.parseapp.com/img/item101-thumb.png',
                     'subtitle':'Soft gray cotton t-shirt is back in style',
                     'buttons':[
                       {
                         'type':'web_url',
                         'url':'https://petersapparel.parseapp.com/view_item?item_id=101',
                         'title':'View Item'
                       },
                       {
                         'type':'web_url',
                         'url':'https://petersapparel.parseapp.com/buy_item?item_id=101',
                         'title':'Buy Item'
                       },
                       {
                         'type':'postback',
                         'title':'Bookmark Item',
                         'payload':'USER_DEFINED_PAYLOAD_FOR_ITEM101'
                       }
                     ]
                   }
                 ]
               }
        }
    });
});
*/
