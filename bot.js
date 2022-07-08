// variables
require("dotenv").config()
const { Client, Intents } = require('discord.js');
const ocrSpaceApi = require('ocr-space-api-alt2');
const { MessageEmbed } = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
let start = 1;
let end = 2;
let totaltime = 0;
let profanity = '';
let profanitypresent = false;
var regexn = /([n|N|m|M|j|J]+[i|I|1|L|l|!|h]+[g|G|q]+[^h])\w/;
var regexf = /(f|F)(a|A|4|@)(g|G)\w+/;
let reportchannel = '994546580600397854';
var sentChannel = '';
let apikeys = ['K81964690488957', 'K87892637488957'];

function process(client, imageurl, msg){
  function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
  };
  function getExt(filepath){
    return filepath.split("?")[0].split("#")[0].split('.').pop();
  };
  if (["png", "jpg", "jpeg", "gif"].indexOf(getExt(imageurl)) !== -1){
    console.log(getExt(imageurl));
    var ImageURL = imageurl;
    finalapikey = randomChoice(apikeys);
    console.log('used api key: ' + randomChoice(apikeys));
    const options =  { 
      apiKey: finalapikey,
      verbose: false,
      url: ImageURL,
      detectOrientation: true,
      scale: true
    };
    const getText = async () => {
      try {
        start = Date.now();
        const result = await ocrSpaceApi(options);
        profanity = result;
        end = Date.now();
        totaltime = parseFloat(end-start);
        console.log(totaltime);
        return result;
      } catch (error) {
        console.error(error)
      }
    };
    function checkProfanity(input){
      try{
        let trimmed = input.replace(/[\s|.|+|×|÷|=|/|_|#|%|^|*|(|)|-|'|:|;|,|?|`|~|<|>|{|}|°|•|○|●|□|■|♤|♡|◇|♧|☆|《|》|▪|¤|¡|¿]+/g, '');
        console.log(input);
        console.log(trimmed);
        let textInput = trimmed.toString().split(" ");
        var checkNWord = textInput.some(e => regexn.test(e));
        var checkFWord = textInput.some(el => regexf.test(el));
        if (checkNWord || checkFWord == true){
          profanitypresent = true;
          return true;
        } else {
          return false;
        }
      } catch(err) {
        console.log('invalid input');
      }
    };
    async function sendmessage(){
      if (checkProfanity(await getText()) == true) {
        msg.delete().catch(error => {
          if (error.code !== 10008) {
            console.log('delete error lol');
            return; //do nothing
          };
        });
        const exampleEmbed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Image Filtering')
          .addFields(
            { name: 'Flagged Content:', value: imageurl },
            { name: 'User:', value: '<' + '@' + msg.author.id + '>', inline: true},
            { name: 'ID:', value: msg.author.id, inline: true},
            { name: 'ㅤ', value: 'ㅤ', inline: false},
            { name: 'Profanity Found?', value: 'Profanity Present: ' + profanitypresent, inline: true},
            { name: 'Processing Time:', value: totaltime + ' MS', inline: true},
            { name: 'ㅤ', value: 'ㅤ', inline: false},
            { name: 'Image Extension:', value: '.' + getExt(imageurl), inline: true},
            { name: 'Sent From:', value: '<' + '#' + msg.channel.id + '>', inline: true},
          )
          .setImage(imageurl)
          .setTimestamp()
          client.channels.cache.get(reportchannel).send({embeds: [exampleEmbed]});  
        };
      };
      try{
        sendmessage()
      } catch (error){
        console.log("some error occured");
      };
    };
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  if(msg.channelId == '994544037635817542') return;
  if(msg.author.bot) return;
  if(msg.author.id != '159930767533670400') return;
  if (msg.content == '!status'){
    msg.reply('Functioning Properly');
  }
});

bot.on("message", (msg) => {
  if(msg.content.includes("https://cdn.discordapp.com") || msg.content.includes("https://media.discordapp.net")){
    var matches = msg.content.match(/\bhttps?:\/\/\S+/gi);
    let ImageURL = msg.content;
    console.log(matches);
    process(bot, matches.toString(), msg);
  }
});

bot.on("message", (msg) => {
  if(msg.author.bot) return;
  if(msg.channelId == '994544037635817542') return;
  if (msg.attachments.size > 0) {
    msg.attachments.forEach((attachment) => {
      process(bot, attachment.proxyURL, msg);
    });
  };
});


bot.login('NTQ2MzM0MzYzMzA3MjEyODEw.GiLF0n.GsvCHS5QKBFNBohv9rOUNgJCaabdpohb71OLCw');