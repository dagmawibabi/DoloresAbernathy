const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const channelID = process.env.CHANNEL_ID;
const token = process.env.BOT_TOKEN; 
const bot = new TelegramBot(token, {polling: true});

// Presets
let subredditList = ["Aesthetic", "TheWayWeWere", "Sizz", "Pics", "ArtPorn", "Art", "DarkAcademia", "AestheticWallpapers", "ImaginaryCityscapes", "ImaginaryMindscapes", "ImaginaryFeels", "ImaginaryTechnology", "SympatheticMonsters", "SpecArt", "FuturePorn", "ImaginaryHorrors", "ImaginaryMonsters", "SkyPorn", "clouds", "VaporwaveAesthetics", "HeavyMind", "LowPoly", "Cyberpunk", "PixelArt", "SteamPunk"]; 
let redditSortTime = ["week", "month", "year", "all"];
let redditSortType = ["hot", "top", "best", "random", "rising"];

// Random Number
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Fetch Post
async function fetchRedditPost(){
    // Choose random subreddit, sort and time
    let randomSubreddit = subredditList[getRandom(0, subredditList.length)];
    let randomSortTime = redditSortTime[getRandom(0, redditSortTime.length)];
    let randomSortType = redditSortType[getRandom(0, redditSortType.length)];

    // Fetch Posts
    let redditResponse;
    await axios.get(`https://www.reddit.com/r/${randomSubreddit}/${randomSortType}.json?t=${randomSortTime}`)
        .then((result) => {
            redditResponse = result;
        })
        .catch(function (error) {
            console.log("Encountered Error.");
        });

    // Post to channel
    for(let i = 0; i < 8; i++){
        let randomPostNumber = getRandom(0, redditResponse["data"]["data"]["children"].length);    
        let newPostTitle = redditResponse["data"]["data"]["children"][randomPostNumber]["data"]["selftext"].toLowerCase();
        let newPostContent = redditResponse["data"]["data"]["children"][randomPostNumber]["data"]["title"].toLowerCase();
        let newPostPhoto = redditResponse["data"]["data"]["children"][randomPostNumber]["data"]["url"].toLowerCase();
        bot.sendPhoto(channelID, newPostPhoto, {caption: "@DoloresAbernathy7"});
    }
}

// Commands
let commands = {
    "reply_markup": {
        "keyboard": [
            ["Post"],
        ]
    }
};


// Main
let chatId;
bot.on('message', async (msgReceived) => {
    chatId = msgReceived.chat.id;
    if (msgReceived.text.toString().toLowerCase() == "post"){
        bot.sendMessage(chatId, "Posting...", commands);
        await fetchRedditPost();
        bot.sendMessage(chatId, "Done!", commands);
    }
})



