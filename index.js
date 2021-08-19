require('dotenv').config();
const Discord = require('discord.js');
const { Client, User } = require('discord.js');
const Canvas = require('canvas');
const fetch = require("node-fetch")
const bot = new Client();

bot.on('ready', () =>{
    console.log(`${bot.user.username} ist gestartet`)
})
bot.login(process.env.DISCORDJS_BOT_TOKEN_emoji_Datenbank); //"process.env.DISCORDJS_BOT_TOKEN_emoji_Datenbank" refers to my bot token, which of course I do not publish.
bot.on('message', async (message) =>{
    if(!(message.author.bot)){
      if(message.content == "<@!851140597871411230>"){
        message.channel.send("Mein Prefix ist ``!``. Nutze ``!help`` für eine liste der möglichen Commands.")
      }
      if (message.content == "!help") {
        if(message.author.username != bot.user.username){
          Help(message)
        }
      }
      if(message.content.startsWith("!rfact")){
        if(message.content.replace("!rfact ", "") === "de"){
          var arg = "de"
        }else{
          var arg = "en"
        }
        try {
          let fact = await (await fetch("https://uselessfacts.jsph.pl/random.json?language="+arg)).json()
          const embed = {
            "title": "**Random fact**",
            "description": fact.text,
            "color": "RANDOM",
            "fields": [
              {
                "name": "Source",
                "value": `[${fact.source}](${fact.source_url})`
              },
            ]
          };
            message.reply({embed})
        } catch (error) {
          if(error) throw error;
        }
      }
      if(message.content == "!bot" || message.content == "!invite"){
        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        const embed = {
          "title": "**" + bot.user.username + "**",
          "description": "__Developer:__ [Funty#8818](https://discordapp.com/users/417258282479124480)\n\n__Vote:__ [coming soon](https://www.youtube.com/watch?v=dQw4w9WgXcQ)\n\n__[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=864886679483580427&permissions=8&scope=bot)__ \n\n__Github:__ [emojibot](https://github.com/FuntyGithub/emojibot) \n\n**__Informations:__**",
          "color": "#5A8D3E",
          "thumbnail": {
            "url": bot.user.displayAvatarURL()
          },
          "fields": [
            {
              "name": "🏓 Bot-Latency ",
              "value": `${Date.now() - message.createdTimestamp}ms`,
              "inline": true
            },
            {
              "name": "🏓 API-Latency ",
              "value": `${Math.round(bot.ws.ping)}ms`,
              "inline": true
            },
            {
              "name": "<:red_circle:847468411859763270> Uptime ",
              "value": uptime,
            }
          ]
        };
          message.channel.send({embed})
      }
    }
  })

//HUG COMMAND
bot.on('message', async (message) =>{
  if(!(message.author.bot)){
    if(message.content.startsWith("!hug")){
      var arg = message.content.replace("!hug ", "").replace("--addemoji", "").replace("--mc", "");
        if(message.content.includes("--addemoji")){
          var addemoji = true
        }else{
          var addemoji = false
        }
      if(message.content.includes("--mc")){
        //mc skin
        try{
          let data = await (await fetch("https://api.mojang.com/users/profiles/minecraft/" + arg)).json()
          hug("https://crafatar.com/renders/body/"+data.id+"/?overlay&cape",message.channel,"Hug "+arg,addemoji,"mc")
        }catch(err) {
          message.channel.send("No Minecraft account with the name \""+arg+"\" was found!")
        }
      }else{
        //by author
        if(arg == "" || arg == "!hug"){
          hug(message.author.displayAvatarURL({ format: 'png' }),message.channel,"Hug "+message.author.username,addemoji,"avatar")
        }else{
          //by tag
          if(arg.includes("#") && !(arg.startsWith("http"))){
            if(arg.endsWith(" ")){
              arg = arg.slice(0,-1)
            }
            var id = bot.users.cache.find(u => u.tag === arg)
            if(id == null){
              message.channel.send("``"+arg+"`` could not be found!")
            }else{
              bot.users.fetch(id.id).then(async (user) => {
                hug(user.displayAvatarURL({ format: 'png' }), message.channel, "hug "+user.username, addemoji,"avatar")
              }).catch((error) =>{
                message.channel.send("``"+arg+"`` could not be found!")
                
              });
            }
          }else{
            //by ping
            if(arg.startsWith("<@")){
              var userid = arg.replace("<@", "").replace(">", "").replace("!", "")
              bot.users.fetch(userid).then(async (user) => {
                hug(user.displayAvatarURL({ format: 'png' }), message.channel, "hug "+user.username, addemoji,"avatar")
              }).catch((error) =>{
                message.channel.send("<@"+arg+"> could not be found!")
              });
            }else{
              if(arg.startsWith("http")){
                hug(arg, message.channel, "hug ", addemoji,"avatar")
              }else{
                if(arg.startsWith("<:") || arg.startsWith(":") || arg.startsWith("<a:")){
                  try{
                    var emojim = arg.replace("<", "").replace(":", "").replace(":", "").replace(">", "")
                    emojim = arg.replace("<", "").replace(":", "").replace(":", "").replace(">", "").replace(/[A-Z]/g, '').replace(/[a-z]/g, '')
                    hug("https://cdn.discordapp.com/emojis/"+emojim+".png",message.channel,"Hug "+emojim,addemoji,"avatar");
                  }catch(err) {
                    message.channel.send("Emoji could not be found!")
                  }
                }else{
                  if(isNaN(arg)){
                    const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
                    if(regexExp.test(arg)){
                      hug(arg,message.channel,arg,addemoji,"emoji")
                    }else{
                      message.channel.send("Incorrect syntax! ``"+arg+"``")
                      Help(message)
                    }
                  }else{
                    bot.users.fetch(arg).then(async (user) => {
                      hug(user.displayAvatarURL({ format: 'png' }), message.channel, "hug "+user.username, addemoji,"avatar")
                    }).catch((error) =>{
                      message.channel.send("User with id ``"+arg+"`` could not be found!")
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
  //functions
  async function hug(url, channel, name, addemoji, type) {
    try {
      var attachment = null;
      var canvas = Canvas.createCanvas(112, 112)
      var context = canvas.getContext("2d")
      switch (type){
        case "avatar":
          var layer1 = await Canvas.loadImage(url)
          context.drawImage(layer1, 1, 45, 64, 64)
          layer2 = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820584809612443659/863442209617608714/PEPEHUGGY.png")
          break;
        case "mc":
          var layer1 = await Canvas.loadImage(url)
          context.drawImage(layer1, 5, 18, 64, 144)
          layer2 = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820584809612443659/872145012996046898/PEPEHUGGY_SKIN.png")
          break;
        case "emoji":
          context.font = '50px serif'
          context.textAlign = "center"; 
          context.fillText(url, 44, 88, 64)
          layer2 = await Canvas.loadImage("https://cdn.discordapp.com/attachments/820584809612443659/863442209617608714/PEPEHUGGY.png")
          break;
      }
      context.drawImage(layer2, 0, 0, canvas.width, canvas.height)
      var emojiurl = canvas.toDataURL();
      attachment = new Discord.MessageAttachment(canvas.toBuffer(), name + ".png")
      if (addemoji) {
        var emoji = channel.guild.emojis.cache.find(emoji => emoji.name == "TEMP_Hug")
        if (emoji) await emoji.delete()
        var emoji = await channel.guild.emojis.create(emojiurl, "TEMP_Hug")
        if (emoji) channel.send("Picture was uploaded as emoji: <:" + emoji.name + ":" + emoji.id + ">", attachment)
        else channel.send("Emoji could not be uploaded!", attachment)
      }else channel.send(attachment)
    }catch(err) {
        channel.send("Picture could not be loaded!")
    }
}

//Help command
  var Help = async function (message) {
    const embed = {
      "title": "**Help**",
      "color": "#5A8D3E",
      "description": "This is a List of all commands.",
      "footer": {
        "icon_url": bot.users.cache.get("417258282479124480").displayAvatarURL({ dynamic:true }),
        "text": "made by Funty#8818"
      },
      "fields": [
        {
          "name": "<:gear:872469198759133184>  __Bot__",
          "value": "> ``!help`` -> Shows this message.\n \n> ``!bot`` -> Shows informations about the bot."
        },
        {
          "name": "\u200B",
          "value": "\u200B"
        },
        {
          "name": "<:hugdc:872469563797823520>  __Hug__",
          "value": "> ``!hug`` -> Creates a \"hug picture\" with your profile picture.\n \n > ``!hug <user#tag>`` -> Creates a \"hug picture\" with someone else's profile picture. (example: !hug Funty#8818)\n \n > ``!hug <@user>`` -> Creates a \"hug picture\" with someone else`s profile picture. \n> (example: !hug <@417258282479124480>)\n \n > ``!hug <userid>`` -> Creates a \"hug picture\" with someone else`s profile picture. \n> (example: !hug 417258282479124480)\n \n > ``!hug <emoji>`` -> Creates a \"hug picture\" with a emoji. \n> (example: !hug <:hugdc:872469563797823520>)\n \n > ``!hug <url>`` -> Creates a \"hug picture\" with a picture from a URL. \n> (example: !hug https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg)\n \n > ``!hug <mc name> --mc`` -> Creates a \"hug picture\" with a Minecraft skin. \n> (example: !hug Funty_ --mc)"
        },
        {
          "name": "\u200B",
          "value": "Add as Emoji:\nIf the hug-command includes ``--addemoji`` the picture will be uploaded as a server emoji."
        },
        {
          "name": "\u200B",
          "value": "Minecraft:\nIf the hug-command includes ``--mc`` the bot is looking for a Minecraft user instead of a Discord user. The bot will hug a Minecraft skin instead of a profile picture."
        }
      ]
    };
      message.channel.send({embed})
  }