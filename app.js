const config = require('./js/config');
const Twit = require('twit');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();


app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
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


function sendTweet(){
  ////////////////
///SEND TWEET///
////////////////
// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// });
  console.log("Sent");
}


let userKey = config.access_token.split("-");
userKey = Number(userKey[0]);
// console.log(userKey);


//GET USERS LATEST 5 TWEETS
const getTweets = T.get('statuses/user_timeline', options1);

//GET FOLLOWING/FRIENDS LIST
const getFriends = T.get('friends/list', options2);

//SLIDE IN DMS
const slideInDms = T.get('direct_messages/events/list', options2);

// GET DM PARTNER DEETS
const getDmPartner = (dmPart) => T.get('users/lookup', {user_id: dmPart});

//CONVERT TIMESTAMP TO DATE
function timestampToDate(timestamp){
  let ts = timestamp; //dms.data.events[0].created_timestamp
  ts = new Date();
  ts = ts.toDateString().slice(4,10);
  return ts;
}

//POST ROUTE
app.post('/', (req,res)=>{

  console.log(req.body.tweet);

});

//MAIN RENDER*************
app.get('/', (req, res) => {
  //DATA CONTAINERS
  let tweetsSent = [];
  let tweetLikes = [];
  let tweetReTweets = [];
  let tweetDate = [];
  let userScreenName = '';
  let userHandle ='';
  let userPic= '';
  let userBanner = '';
  let followingCount = '';
  //FOR FRIENDS LIST
  let friendNames = [];    //name
  let friendHandles = [];  //screen_name
  let friendImages = [];   //profile_image_url
  //FOR DMS
  let dmPartnerID = '';
  let friendNameDM = '';
  let dmText = [];
  let dmDate = [];
  let friendImageDM = '';


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
      tweetsSent.push(element.text);
      tweetLikes.push(element.favorite_count);
      tweetReTweets.push(element.retweet_count);
      tweetDate.push(element.created_at.slice(4,10));
    });
    userScreenName = tweets.data[0].user.name;
    userHandle = tweets.data[0].user.screen_name;
    userPic= tweets.data[0].user.profile_image_url;
    followingCount = tweets.data[0].user.friends_count;
    userBanner = tweets.data[0].user.profile_banner_url;
    
  });
  slideInDms.then(dms=> {
    dms.data.events.forEach(element => {
      if(userKey != element.message_create.sender_id){
        dmPartnerID = element.message_create.sender_id;
        dmDate.push(timestampToDate(element.created_timestamp));
        dmText.push(element.message_create.message_data.text);
      }
    });

    getDmPartner(dmPartnerID).then(partner=>{
      friendNameDM = partner.data[0].name;
      console.log(friendNameDM);
      friendImageDM = partner.data[0].profile_image_url;
      console.log(friendImageDM);
    }).then(()=>{
        res.render('index', {
          tweetsSent,
          userScreenName,
          userHandle,
          userPic,
          userBanner,
          tweetReTweets,
          tweetLikes,
          tweetDate,
          followingCount,
          friendNames,
          friendHandles,
          friendImages,
          dmText,
          dmDate,
          friendNameDM,
          friendImageDM
        });
    });
  });
});

//HANDLING INCORRECT ROUTE
app.get("/:id", (req,res)=>{
  res.status(404).send(`<h2>Error 404: The page at route "${req.params.id}" was not found, please check URL</h2>`);
});


//PORT
const port = 3000;
app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});