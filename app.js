const config= require('./js/config');
const Twit = require('twit');

//SETTING UP TWIT MODULE OPTIONS
const T = new Twit({
   consumer_key: config.consumer_key,
   consumer_secret: config.consumer_secret,
   access_token: config.access_token,
   access_token_secret: config.access_token_secret,
 });

//SET UP USERNAME AND TWEET COUNT
const options = { screen_name: config.screen_name,
 count: 5 };

//ITERATE THROUGH TWEETS AND PRINT TO CONSOLE
T.get('statuses/user_timeline', options , function(err, data) {
  for (var i = 0; i < data.length ; i++) {
    console.log(data[i].text);
  }
});

////////////////
///SEND TWEET///
////////////////
// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// });