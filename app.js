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

// The home route, getting data using promises and rendering
app.get('/', (req, res) => {
  // getting user credentials for promises
  T.get('account/verify_credentials')
    .then(function (result) {
      const verifyCredentials = result.data;
      const { screen_name } = verifyCredentials;
      const { id_str } = verifyCredentials;

      // getting data using promises and assigning them to variables
      Promise.all([
        T.get('users/profile_banner', { screen_name }),
        T.get('friends/list', { count: 5 }),
        T.get("statuses/user_timeline", { q: screen_name, count: 5 }),
        T.get('direct_messages/events/list', { count: 8 })
      ])
      .then(response => { 
        const profileBanner = response[0].data.sizes;
        const friendList = response[1].data.users; 
        const tweets = response[2].data;
        const directMsgs = response[3].data.events.reverse(); 
        const IDs = directMsgs.map(directMsg => {
          return directMsg.message_create.sender_id;
        });

        // getting profile info of users that sent a direct message
        T.get('users/lookup', { user_id: IDs })
          .then(response => {
            const infoSenders = response.data;
            
            // all the data needed to render in one place
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

            // rendering the home page
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


// Exceeds: route handling error
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  // console.log(req);
  res.locals.error = err;
  res.status(err.status);
  res.render('error', err);  
});


// Server
app.listen(1337, () => {
  console.log("Listening on 1337");
});
