// variables
require("dotenv").config();
const { Client, Intents } = require('discord.js');
const ocrSpaceApi = require('ocr-space-api-alt2');
const { MessageEmbed } = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS]});
let start = 1;
let end = 2;
let totaltime = 0;
let profanitypresent = false;
var regexn = /([n|N|m|M|j|J]+[i|I|1|L|l|!|h]+[g|G|q]+[^h])\w/;
var regexf = /(f|F)(a|A|4|@)(g|G)\w+/;
let reportchannel = '994648347308732436';
let apikeys = ['K81964690488957', 'K87892637488957'];
let Whitelisted = ['394019914157129728', '204255221017214977', '416358583220043796', '651095740390834176', '282859044593598464', '839383598306033674', '159985870458322944', '499595256270946326', '155149108183695360', '497196352866877441', '235148962103951360', '536991182035746816', '172002275412279296', '993672510082129971', '559047562494083073', '159930767533670400'];

function processcontent(client, imageurl, msg){
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
};

function webhookEmbed(webhook, user, status, channel, info, color){
  const webhookLogs = new MessageEmbed()
    .setColor(color)
    .setTitle('Webhook logs')
    .addFields(
      { name: 'Webhook ID:', value: webhook.id, inline: false},
      { name: 'User:', value: user.tag, inline: true},
      { name: 'User ID:', value: user.id, inline: false},
      { name: 'Status:', value: status, inline: false},
      { name: 'Channel:', value: '<#' + channel.id + '>', inline: false},
      { name: 'Info:', value: info, inline: false},
    )
  bot.channels.cache.get('994914104294776912').send({embeds:[webhookLogs]});
};

bot.on('webhookUpdate', async channel => {
  try { 
    const auditLogss = (await channel.guild.fetchAuditLogs()).entries.first();
    if (auditLogss.executor.bot) return;
    if (auditLogss.action == 'WEBHOOK_CREATE') {
      if (Whitelisted.includes(auditLogss.executor.id)) {
        webhookEmbed(auditLogss.target, auditLogss.executor, 'Whitelisted', channel, 'Webhook Created', '49FF00');
      } else {
        (await channel.fetchWebhooks(auditLogss.id)).first().delete();
        webhookEmbed(auditLogss.target, auditLogss.executor, 'Blacklisted', channel, 'Webhook Deleted', 'FF0000');
      };
    } else if (auditLogss.action == 'WEBHOOK_DELETE') {
      if (Whitelisted.includes(auditLogss.executor.id)) {
        webhookEmbed(auditLogss.target, auditLogss.executor, 'Whitelisted', channel, 'Webhook Deleted', '49FF00');
      } else {
        webhookEmbed(auditLogss.target, auditLogss.executor, 'Blacklisted', channel, 'Webhook Deleted', 'FF0000');
      };
    } else { return };
  } catch {
    console.log('issue, webhook could be deleted too fast by other bots');
  };
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (msg) => {
  if(msg.channelId == '994544037635817542') return;
  if(msg.author.bot) return;
  if(msg.author.id != '159930767533670400') return;
  if (msg.content == '!status'){
    msg.reply('Functioning Properly');
  }
});

bot.on('message', (msg) => {
  if(msg.author.bot) return;
  if(msg.content.includes("https://cdn.discordapp.com") || msg.content.includes("https://media.discordapp.net")){
    var matches = msg.content.match(/\bhttps?:\/\/\S+/gi);
    let ImageURL = msg.content;
    console.log(matches);
    processcontent(bot, matches.toString(), msg);
  }
});

bot.on('message', (msg) => {
  if(msg.author.bot) return;
  if(msg.channelId == '994544037635817542') return;
  if (msg.attachments.size > 0) {
    msg.attachments.forEach((attachment) => {
      processcontent(bot, attachment.proxyURL, msg);
    });
  };
});

bot.login(process.env.TOKEN1);