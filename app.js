const config= require('./js/config');
const Twit = require('twit');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

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

const tweetsSent = [];

async function getTweets() {
  try {
    return await T.get('statuses/user_timeline', options);
  } catch (err) {
    console.log('Could not retrieve tweets');
  }
}
// getTweets();

app.get('/', (req, res) => {
  getTweets().then(tweets => {
    tweets.data.forEach(element => {
      tweetsSent.push(element.text)
    });
    res.render('index', {
      tweetsSent
    });
    console.log(tweetsSent);
  });
});
////////////////
///SEND TWEET///
////////////////
// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// });

//PORT
const port = 3000;
app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});