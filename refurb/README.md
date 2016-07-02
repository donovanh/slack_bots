# Refurb bot

A bot that checks for new deals on the refurb section of Apple's store

Currently it:

* Only works on Ireland store
* Posts all new items to a "refurb" channel
* Private messages me only when a fixed set of keywords are matched

To do:

* Nicer looking messages with images and descriptions
* Set up the concept of users, with their own keywords
* Post new items to users if they match the keywords
* Add in locale support
* Have a "help" response with possible commands
* Create a "Add to Slack" button for sharing
* ???
* Profit

Possible related uses:

* Gold box filtered deal alerts
* ... other online retailers with affiliate schemes?

## Add to Slack button

Follow tutorial: https://99designs.ie/tech-blog/blog/2015/08/26/add-to-slack-button/

* Set up a subdomain pointing to the DO server
* Add it to nginx config - dedicated port for this app
* When url works - set up landing page / installation page
* Do post from app on app registration
* Confirm it's integrated and test bot
* Give bot some custom logic to save user - webhook so that it can message user
* Test messaging user with custom info
