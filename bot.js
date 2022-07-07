// variables
require("dotenv").config()
const { Client, Intents } = require('discord.js');
const Tesseract = require("tesseract.js");
const ocrSpaceApi = require('ocr-space-api-alt2');
const { MessageEmbed } = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
let start = 1;
let end = 2;
let totaltime = 0;
let profanity = '';
var regexn = /(n|N|m|M|j|J)(i|I|1|L|l|!)(g|G)\w+/;
var regexf = /(f|F)(a|A|4|@)(g|G)\w+/;
var reportchannel = '994546580600397854';
var sentChannel = '';

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  if (msg.content == '!status'){
    msg.reply('Functioning Properly');
  }
});

bot.on("message", (msg) => {
  if (msg.attachments.size > 0) {
    msg.attachments.forEach((attachment) => {
      sentChannel = msg.channel;
      function getExt(filepath){
        return filepath.split("?")[0].split("#")[0].split('.').pop();
      }
      if (["png", "jpg", "jpeg", "gif"].indexOf(getExt(attachment.proxyURL)) !== -1){
        console.log(getExt(attachment.proxyURL));
        var ImageURL = attachment.proxyURL;
        const options =  { 
          apiKey: 'K81964690488957',
          verbose: false,
          url: ImageURL,
          detectOrientation: true,
          scale: true
        }
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
        }
        function checkProfanity(input){
          try{
            console.log(input);
            let textInput = input.toString().split(" ");
            var checkNWord = textInput.some(e => regexn.test(e));
            var checkFWord = textInput.some(el => regexf.test(el));
            if (checkNWord || checkFWord == true){
              return true;
            } else {
              return false;
            }
          } catch(err) {
            console.log('invalid input');
          }

        }
        async function sendmessage(){
          if (checkProfanity(await getText()) == true) {
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Image Filtering')
            .addFields(
              { name: 'Flagged Content:', value: attachment.proxyURL },
              { name: 'User:', value: '<' + '@' + msg.author.id + '>', inline: true},
              { name: 'ID:', value: msg.author.id, inline: true},
              { name: 'ㅤ', value: 'ㅤ', inline: false},
              { name: 'Profanity Found?', value: 'Profanity Present: ' + checkProfanity(profanity), inline: true},
              { name: 'Processing Time:', value: totaltime + ' MS', inline: true},
              { name: 'ㅤ', value: 'ㅤ', inline: false},
              { name: 'Image Extension:', value: '.' + getExt(attachment.proxyURL), inline: true},
              { name: 'Sent From:', value: '<' + '#' + sentChannel + '>', inline: true},
            )
            .setImage(attachment.proxyURL)
            .setTimestamp()
            // console.log(text);
            bot.channels.cache.get(reportchannel).send({ embeds: [exampleEmbed] });  
            msg.delete();
          }
        }
        // console.log(text);
        sendmessage();
      };
    });
  };
});

bot.login(process.env.TOKEN);