## Twitter-Interface

This is app is a Twitter interface that will display the following:
* Your 5 most recent tweets
* Your 5 most recent friends
* Your 5 most recent sent and received messages.

The app will also allow you to send messages to your twitter feed from the 
message bar.

In order to use this app you first need to [create your own Twitter application](https://apps.twitter.com/).
Generate your keys and tokens in Keys and Access Tokens.
Make sure you modify app permissions to:
* Read, Write and Access direct messages

Next, in the root directory create a `config.js` file placing your keys and tokens in it:
```js
module.exports = {
  consumer_key: "YOUR-CONSUMER-KEY",
  consumer_secret: "YOUR-CONSUMER-SECRET",
  access_token: "YOUR-ACCESS-TOKEN",
  access_token_secret: "YOUR-ACCESS-TOKEN-SECRET"
};
```
Lastly, run `npm install` and `npm start` in the terminal and view the app on port:`http://localhost:`

