const config = require('./js/config');
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
const options1 = { screen_name: config.screen_name,
 count: 5 };
const options2 = {screen_name: config.screen_name};

//DATA CONTAINERS
const tweetsSent = [];
let userScreenName = '';
let userHandle ='';
let userPic= '';
let followingCount = '';
let friendsList = '';
//FOR FRIENDS LIST
let friendNames = [];    //name
let friendHandles = [];  //screen_name
let friendImages = [];   //profile_image_url


//GET USERS LATEST 5 TWEETS
const getTweets = new Promise((resolve, reject)=>{
  resolve(T.get('statuses/user_timeline', options1));
  reject(new Error('Could not get tweets'));
});

//GET FOLLOWING/FRIENDS LIST
const getFriends = new Promise((resolve, reject)=>{
  resolve(T.get('friends/list', options2));
  reject(new Error('Could not retrieve friends data'));
});

//SLIDE IN DMS
// const slideInDms = new Promise((resolve, reject)=>{
//   resolve(T.get('direct_messages/events/list', options2));
//   reject(new Error('Could not slide in DMs'));
// });



//MAIN RENDER*************
app.get('/', (req, res) => {
  // slideInDms.then(dms=> {
  //   console.log(dms);
  // });
  getFriends.then(friends=>{
    //FILLING FRIENDS DATA CONTAINERS
    friends.data.users.forEach(element => {
      friendNames.push(element.name);
    });
    friends.data.users.forEach(element => {
      friendHandles.push(element.screen_name);
    });
    friends.data.users.forEach(element => {
      friendImages.push(element.profile_image_url);
    });
  });
  getTweets.then(tweets => {
    tweets.data.forEach(element => {
      tweetsSent.push(element.text)
    });
    userScreenName = tweets.data[0].user.name;
    userHandle = tweets.data[0].user.screen_name;
    userPic= tweets.data[0].user.profile_image_url;
    followingCount = tweets.data[0].user.friends_count;

    Promise.all([getFriends, getTweets]).then(
      res.render('index', {
        tweetsSent,
        userScreenName,
        userHandle,
        userPic,
        followingCount,
        friendNames,
        friendHandles,
        friendImages
      })
    );
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