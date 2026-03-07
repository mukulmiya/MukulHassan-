const axios = require("axios");
const path = require("path");
const fs = require("fs");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "album",
    version: "1.0.0",
    role: 0,
    author: "Dipto", //Don't Change Author name.
    description: "Displays album options for selection.",
    category: "Media",
    countDown: 5,
    guide: {
      en: "{p}{n} or add [cartoon/photo/lofi/sad/islamic/funny/horny/anime]",
    },
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      {
        api.setMessageReaction("😘", event.messageID, (err) => {}, true);
      }
      const albumOptions = [
        "𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
        "𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼",
        "𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼",
        "𝗔𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼",
        "𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼",
        "𝗟𝗼𝗙𝗶 𝗩𝗶𝗱𝗲𝗼",
        "𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
        "𝗖𝗼𝘂𝗽𝗹𝗲 𝗩𝗶𝗱𝗲𝗼",
        "𝗙𝗹𝗼𝘄𝗲𝗿 𝗩𝗶𝗱𝗲𝗼",
        "𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼",
      ];
      const message =
        "❤️‍🩹 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮𝗻 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗕𝗮𝗯𝘆 <💝\n" +
        "✿━━━━━━━━━━━━━━━━━━━━━━━✿\n" +
        albumOptions
          .map((option, index) => `${index + 1}. ${option} 🐤`)
          .join("\n") +
        "\n✿━━━━━━━━━━━━━━━━━━━━━━━✿";

      await api.sendMessage(
        message,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: albumOptions,
          });
        },
        event.messageID,
      );
    } else if (args[0] === "2") {
      {
        api.setMessageReaction("😘", event.messageID, (err) => {}, true);
      }
      const albumOptions = [
        "𝗔𝗲𝘀𝘁𝗵𝗲𝘁𝗶𝗰 𝗩𝗶𝗱𝗲𝗼",
        "𝗦𝗶𝗴𝗺𝗮 𝗥𝘂𝗹𝗲",
        "𝗟𝘆𝗿𝗶𝗰𝘀 𝗩𝗶𝗱𝗲𝗼",
        "𝗖𝗮𝘁 𝗩𝗶𝗱𝗲𝗼",
        "18+ 𝘃𝗶𝗱𝗲𝗼",
        "𝗙𝗿𝗲𝗲 𝗙𝗶𝗿𝗲 𝘃𝗶𝗱𝗲𝗼",
        "𝗙𝗼𝗼𝘁𝗕𝗮𝗹𝗹 𝘃𝗶𝗱𝗲𝗼",
        "𝗚𝗶𝗿𝗹 𝘃𝗶𝗱𝗲𝗼",
        "𝗙𝗿𝗶𝗲𝗻𝗱𝘀 𝗩𝗶𝗱𝗲𝗼",
      ];
      const message =
        "❤️‍🩹 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮𝗻 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗕𝗮𝗯𝘆 <💝\n" +
        "✿━━━━━━━━━━━━━━━━━━━━━━━✿\n" +
        albumOptions
          .map((option, index) => `${index + 11}. ${option} 🐤`)
          .join("\n") +
        "\n✿━━━━━━━━━━━━━━━━━━━━━━━✿";

      await api.sendMessage(
        message,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: albumOptions,
          });
        },
        event.messageID,
      );
    }
    //------------Video Add--------------//
    const validCommands = [
      "cartoon",
      "photo",
      "lofi",
      "sad",
      "islamic",
      "funny",
      "horny",
      "anime",
      "love",
      "baby",
      "lyrics",
      "sigma",
      "photo",
      "aesthetic",
      "cat",
      "flower",
      "ff",
      "sex",
      "girl",
      "football",
      "friend",
    ];
    {
      api.setMessageReaction("👀", event.messageID, (err) => {}, true);
    }
    if (args[0] === "list") {
      try {
        const res = await axios.get(`${await baseApiUrl()}/album?list=dipto`);
        const data = res.data.data;
        const videoCount = data.match(/\d+/g).reduce((acc, num) => acc + parseInt(num), 0);
        api.sendMessage(
          `𝘁𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝗰𝗼𝘂𝗻𝘁: ${videoCount}`,
          event.threadID,
          event.messageID,
        );
      } catch (error) {
        api.sendMessage(`${error}`, event.threadID, event.messageID);
      }
    }
    if (args[0] === "listAll" || args[0] === "listall") {
      try {
        const lRes = await axios.get(`${await baseApiUrl()}/album?list=dipto`);
        const data = lRes.data.data;
        const videoCount = data.match(/\d+/g).reduce((acc, num) => acc + parseInt(num), 0);
        api.sendMessage(
          `🖤 𝗧𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗶𝗻 𝗮𝗹𝗯𝘂𝗺 🩵\n\n${data}\n\n𝘁𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝗰𝗼𝘂𝗻𝘁: ${videoCount}`,
          event.threadID,
          event.messageID,
        );
      } catch (error) {
        api.sendMessage(`${error}`, event.threadID, event.messageID);
      }
    }
    const d1 = args[1] ? args[1].toLowerCase() : "";
    if (!d1 || !validCommands.includes(d1)) return;
    if (!event.messageReply || !event.messageReply.attachments) return;
    const attachment = event.messageReply.attachments[0].url;
    const URL = attachment;
    let query;
    switch (d1) {
      case "cartoon":
        query = "addVideo";
        break;
      case "photo":
        query = "addPhoto";
        break;
      case "lofi":
        query = "addLofi";
        break;
      case "sad":
        query = "addSad";
        break;
      case "funny":
        query = "addFunny";
        break;
      case "islamic":
        query = "addIslamic";
        break;
      case "horny":
        query = "addHorny";
        break;
      case "anime":
        query = "addAnime";
        break;
      case "love":
        query = "addLove";
        break;
      case "lyrics":
        query = "addLyrics";
        break;
      case "flower":
        query = "addBaby";
        break;
      case "photo":
        query = "addPhoto";
        break;
      case "sigma":
        query = "addSigma";
        break;
      case "aesthetic":
        query = "addAesthetic";
        break;
      case "cat":
        query = "addCat";
        break;
      case "ff":
        query = "addFf";
        break;
      case "sex":
        query = "addSex";
        break;
      case "football":
        query = "addFootball";
        break;
      case "girl":
        query = "addGirl";
        break;
      case "friend":
        query = "addFriend";
        break;
      default:
        break;
    }
    try {
      const response = await axios.get(
        `${await baseApiUrl()}/drive?url=${encodeURIComponent(URL)}`,
      );
      let imgurLink = response.data.fileUrl;
      //imgurLink = args.join(" ");
      const fileExtension = `.mp4` //path.extname(imgurLink);
      let query2;
      if (
        fileExtension === ".jpg" ||
        fileExtension === ".jpeg" ||
        fileExtension === ".png"
      ) {
        query2 = "addPhoto";
      } else if (fileExtension === ".mp4") {
        query2 = query;
      } else {
        api.sendMessage(
          "Invalid file format.",
          event.threadID,
          event.messageID,
        );
        return;
      }
      const svRes = await axios.get(
        `${await baseApiUrl()}/album?add=${query2}&url=${imgurLink}`,
      );
      const data = svRes.data;
      //   console.log(data);
      api.sendMessage(
        `✅ | ${data.data}\n\n🔰 | ${data.data2}\n🔥 | URL: ${imgurLink}`,
        event.threadID,
        event.messageID,
      );
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage(
        `Failed to convert image.\n${error}`,
        event.threadID,
        event.messageID,
      );
    }
  },
  onReply: async function ({ api, event, Reply }) {
    const admin = "61586540721576";
    api.unsendMessage(Reply.messageID);
    if (event.type == "message_reply") {
      const reply = parseInt(event.body);
      if (isNaN(reply)) {
        return api.sendMessage(
          "🔰 | Please reply with either 1 - 14",
          event.threadID,
          event.messageID,
        );
      }
      let query;
      let cp;
      if (reply === 1) {
        query = "funny";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🤣";
      } else if (reply === 2) {
        query = "islamic";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼 <😇";
      } else if (reply === 3) {
        query = "sad";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼 <🥺";
      } else if (reply === 4) {
        query = "anime";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗮𝗻𝗶𝗺 𝘃𝗶𝗱𝗲𝗼 <😘";
      } else if (reply === 5) {
        query = "video";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼 <😇";
      } else if (reply === 6) {
        query = "lofi";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝗳𝗶 𝘃𝗶𝗱𝗲𝗼 <😇";
      } else if (reply === 7 && event.senderID === admin) {
        query = "horny";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🥵";
      } else if (reply === 8) {
        query = "love";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝘃𝗲 𝘃𝗶𝗱𝗲𝗼 <😍";
      } else if (reply === 9) {
        query = "baby";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝘂𝘁𝗲 𝗕𝗮𝗯𝘆 𝘃𝗶𝗱𝗲𝗼 <🧑‍🍼";
      } else if (reply === 10) {
        query = "photo";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼 <😙";
      } else if (reply === 11) {
        query = "aesthetic";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗔𝗲𝘀𝘁𝗵𝗲𝘁𝗶𝗰 𝗩𝗶𝗱𝗲𝗼 <😙";
      } else if (reply === 12) {
        query = "sigma";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗶𝗴𝗺𝗮 𝘃𝗶𝗱𝗲𝗼 <🐤";
      } else if (reply === 13) {
        query = "lyrics";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝘆𝗿𝗶𝗰𝘀 𝘃𝗶𝗱𝗲𝗼 <🥰";
      } else if (reply === 14) {
        query = "cat";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝗮𝘁 𝗩𝗶𝗱𝗲𝗼 <😙";
      } else if (reply === 15 && event.senderID === admin) {
        query = "sex";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗲𝘅 𝘃𝗶𝗱𝗲𝗼 <😙";
      } else if (reply === 16) {
        query = "ff";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝗿𝗲𝗲 𝗙𝗶𝗿𝗲 𝗩𝗶𝗱𝗲𝗼 <😙";
      } else if (reply === 17) {
        query = "football";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝗹 𝘃𝗶𝗱𝗲𝗼<😙";
      } else if (reply === 18) {
        query = "girl";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗚𝗶𝗿𝗹 𝘃𝗶𝗱𝗲𝗼<😙";
      } else if (reply === 19) {
        query = "friend";
        cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝗿𝗶𝗲𝗻𝗱𝘀 𝘃𝗶𝗱𝗲𝗼<😙";
      }
      try {
        const res = await axios.get(
          `${await baseApiUrl()}/album?type=${query}`,
        );
        const imgUrl = res.data.data;
        const ex = path.extname(imgUrl);
        const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
        const filename = __dirname + `/assets/dipto_${Date.now()}.mp4`;
        fs.writeFileSync(filename, Buffer.from(imgRes.data, "binary"));
        api.sendMessage(
          {
            body: `${cp}\n\n𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗨𝗿𝗹: ${imgUrl}`,
            attachment: fs.createReadStream(filename),
          },
          event.threadID,
          () => fs.unlinkSync(filename),
          event.messageID,
        );
      } catch (error) {
        api.sendMessage(
          "An error occurred while fetching the media.",
          event.threadID,
          event.messageID,
        );
      }
    }
  },
};
