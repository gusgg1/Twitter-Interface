
const express = require('express');
const config = require('./config');
const Twit = require('twit');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

const T = new Twit(config);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');


// Route ---------------------------------------

app.get('/', (req, res) => {

  T.get('account/verify_credentials')
    .then(function (result) {
      const verifyCredentials = result.data; // Obj
      const { screen_name } = verifyCredentials;
      const { id_str } = verifyCredentials;

      Promise.all([
        T.get('users/profile_banner', { screen_name }),
        T.get('friends/list', { count: 5 }),
        T.get("statuses/user_timeline", { q: screen_name, count: 5 }),
        T.get('direct_messages/events/list', { count: 8 })
      ])
      .then(response => { 
        const profileBanner = response[0].data.sizes;
        const friendList = response[1].data.users; // array of users
        const tweets = response[2].data; // array of objs
        const directMsgs = response[3].data.events.reverse(); // arr of objs

        // console.log(response[3].data.events);


        // console.log(directMsgs);      
        // console.log(directMsgs[0].message_create.message_data.text);
        // console.log(directMsgs[0].message_create);
        
        const IDs = directMsgs.map(directMsg => {
          return directMsg.message_create.sender_id;
        });

        // T.get('users/lookup', { user_id: arrIDS },  function (err, data, response) {
        //   console.log(data);
        // })

        console.log(IDs);

    
        let templateData = { 
          id_str,
          profileBanner, 
          verifyCredentials, 
          friendList,
          tweets,
          directMsgs 
        };
    
        // console.log(templateData);
    
        res.render('layout', templateData);    
      })
    });
});

/*
function test() { 

  T.get('direct_messages/events/list', { count: 8 }, function(err, data, response) {
    // console.log(data.events); // Arr of objs
    // console.log(data.events[0].message_create.sender_id); // Arr of objs
    const arrDataMessages = data.events;
    const arrIDS = arrDataMessages.map(arrDataMessage => {
      return arrDataMessage.message_create.sender_id;
    });
    console.log(arrIDS);


    T.get('users/lookup', { user_id: arrIDS },  function (err, data, response) {
      console.log(data);
    })
    
    
  });
 
}

test()
*/


/*
[ '978998473612816384',  // guus
  '1887672271',          // Darnley Francis
  '978998473612816384',  // guus
  '23078111',            // Dennis
  '23078111' ]           // Dennis 
*/




// ******************** HELPERS ********************


app.listen(1337, () => {
  console.log("Listening on 1337");
});

