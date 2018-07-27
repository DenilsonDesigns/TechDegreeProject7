const config= require('./js/config');
const Twit = require('twit');
const express = require('express');
const app = express();

app.set('view engine', 'pug');



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

async function getTweets(){
  try{
    //ITERATE THROUGH TWEETS AND PRINT TO CONSOLE
    await T.get('statuses/user_timeline', options , function(err, data) {
      for (var i = 0; i < data.length ; i++) {
        // console.log(data[i].text);
        tweetsSent.push(data[i].text);
        console.log(tweetsSent[i]);
      }
    });
  }catch(err){
    console.log('Could not retrieve tweets');
  }
}
getTweets();

app.get('/',(req,res)=>{
  
  res.render('index');
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