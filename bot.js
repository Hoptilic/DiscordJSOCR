require("dotenv").config()
const { Client, Intents } = require('discord.js');
const Tesseract = require("tesseract.js"); // Initializing Tesseract, this module is essential for OCR
const { createWorker, createScheduler } = require('tesseract.js');
const scheduler = createScheduler();
const worker1 = createWorker();
const worker2 = createWorker();
const { MessageEmbed } = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
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
      if (["png", "jpg", "jpeg"].indexOf(getExt(attachment.proxyURL)) !== -1){
        console.log(getExt(attachment.proxyURL));
        var ImageURL = attachment.proxyURL;
        var start = Date.now();

        function RecogniseStuff(imageurl){
          Tesseract.recognize(imageurl, "eng", {logger: (m) => console.log(m)}).then(({ data: { text } }) => { return text });
        };
        var end = Date.now();
        var totaltime = Math.floor((end-start) / 1000);
        console.log(totaltime);
        function checkProfanity(input){
          console.log(input);
          let textInput = input.toString().split(" ");
          var checkNWord = textInput.some(e => regexn.test(e));
          var checkFWord = textInput.some(el => regexf.test(el));
          if (checkNWord || checkFWord == true){
            return true;
          } else {
            return false;
          }
        }
        let textresult = RecogniseStuff(ImageURL);
        if (checkProfanity(textresult) == true) {
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Image Filtering')
            .addFields(
              { name: 'Flagged Content:', value: attachment.proxyURL },
              { name: 'User:', value: '<' + '@' + msg.author.id + '>', inline: true},
              { name: 'ID:', value: msg.author.id, inline: true},
              { name: 'ㅤ', value: 'ㅤ', inline: false},
              { name: 'Profanity Found?', value: 'Profanity Present: ' + checkProfanity(text), inline: true},
              { name: 'Processing Time:', value: totaltime + ' Seconds', inline: true},
              { name: 'ㅤ', value: 'ㅤ', inline: false},
              { name: 'Image Extension:', value: '.' + getExt(attachment.proxyURL), inline: true},
              { name: 'Sent From:', value: '<' + '#' + sentChannel + '>', inline: true},
            )
            .setImage(attachment.proxyURL)
            .setTimestamp()
            bot.channels.cache.get(reportchannel).send({ embeds: [exampleEmbed] });  

        }
        msg.delete();
      };
    });
  };
});

bot.login(process.env.TOKEN);