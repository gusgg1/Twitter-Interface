// Requiring packages
const express = require('express');
const config = require('./config');
const Twit = require('twit');
const bodyParser = require('body-parser');
const moment = require('moment');

// Creating Express app
const app = express();

// Adding config json to the Twit package
const T = new Twit(config);

// App configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');


// --------------------------------- ROUTES ------------------------------------

app.get('/', (req, res) => {
  T.get('account/verify_credentials')
    .then(function (result) {
      const verifyCredentials = result.data;
      const { screen_name } = verifyCredentials;
      const { id_str } = verifyCredentials;

      Promise.all([
        T.get('users/profile_banner', { screen_name }),
        T.get('friends/list', { count: 5 }),
        T.get("statuses/user_timeline", { q: screen_name, count: 5 }),
        T.get('direct_messages/events/list', { count: 8 })
      ])
      .then(checkStatus)
      .then(response => { 
        const profileBanner = response[0].data.sizes;
        const friendList = response[1].data.users; 
        const tweets = response[2].data;
        const directMsgs = response[3].data.events.reverse(); 
        const IDs = directMsgs.map(directMsg => {
          return directMsg.message_create.sender_id;
        });

        T.get('users/lookup', { user_id: IDs })
          .then(response => {
            const infoSenders = response.data;
            
            let templateData = { 
              moment: require('moment'), 
              id_str,
              profileBanner, 
              verifyCredentials, 
              friendList,
              tweets,
              directMsgs,
              IDs,
              infoSenders
            };

            res.render('layout', templateData)
          });  
      });
    });
});


// Exceeds: Posting a tweet
app.post('/', (req, res) => {
  const tweet = req.body.tweet;
  T.post('statuses/update', { status: tweet })
  res.redirect('/');
});


// Server
app.listen(1337, () => {
  console.log("Listening on 1337");
});


// ------------------------ HELPERS ---------------------

function checkStatus(response) {
  if (response[1].resp.statusCode) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusMessage));
  }
}


// timeline