const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "album",
    aliases: ["list", "vidlist"],
    version: "9.2.0",
    author: "Siyam Hasan",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: { en: "Multi-page video album for Siyam Hasan" },
    guide: { en: "{pn} | {pn} 2 | {pn} 3 | Reply video: {pn} add <category>" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply, senderID } = event;
    const pathData = path.join(process.cwd(), "scripts", "cmds", "album_data.json");

    const allowedCategories = [
      "milon", "sad", "love", "broken", "alone", "romantic",
      "hot", "sex", "couple", "crush", "relationship",
      "funny", "meme", "troll", "prank", "gaming",
      "pubg", "freefire", "gamer", "anime", "animegirl",
      "animeboy", "nature", "sunset", "rain", "aesthetic",
      "dj", "car", "bandari", "pukee"
    ];

    // --- ADD VIDEO SECTION ---
    if (args[0] === "add") {
      if (senderID != "61568411310748") 
        return api.sendMessage("❌ | Only Siyam Hasan can add videos!", threadID, messageID);
      
      const category = args[1]?.toLowerCase();
      if (!allowedCategories.includes(category)) {
        return api.sendMessage(`❌ | Invalid Category! Allowed:\n\n${allowedCategories.join(", ")}`, threadID, messageID);
      }

      if (!messageReply || !messageReply.attachments || messageReply.attachments[0].type !== "video") {
        return api.sendMessage("❌ | Boss, please reply to a video to save it!", threadID, messageID);
      }

      const videoUrl = messageReply.attachments[0].url;
      if (!fs.existsSync(pathData)) fs.writeJsonSync(pathData, {});
      let data = fs.readJsonSync(pathData);
      if (!data[category]) data[category] = [];
      data[category].push(videoUrl);
      fs.writeJsonSync(pathData, data);
      
      return api.sendMessage(`✅ | Video saved to '${category.toUpperCase()}' list!`, threadID, messageID);
    }

    // --- MULTI-PAGE MENU ---
    const page = parseInt(args[0]) || 1;
    let listMsg = "";

    if (page === 1) {
      listMsg = `╭─❍ 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎 𝐋𝐈𝐒𝐓 ❍─╮\n\n✦ 1. 𝐌𝐈𝐋𝐎𝐍 🐼\n✦ 2. 𝐒𝐚𝐝 💔\n✦ 3. 𝐋𝐨𝐯𝐞 ❤️\n✦ 4. 𝐁𝐫𝐨𝐤𝐞𝐧 🥀\n✦ 5. 𝐀𝐥𝐨𝐧𝐞 😔\n✦ 6. 𝐑𝐨𝐦𝐚𝐧𝐭𝐢𝐜 💕\n✦ 7. 𝐇𝐨𝐭 🔥\n✦ 8. 𝐒𝐞𝐱 💋\n✦ 9. 𝐂𝐨𝐮𝐩𝐥𝐞 😘\n✦ 10. 𝐂𝐫𝐮𝐬𝐡 😍\n\n╰──❍ 𝐏𝐚𝐠𝐞 : 1/3 ❍──╯\n💬 Reply number or type '.album 2'`;
    } else if (page === 2) {
      listMsg = `╭─❍ 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎 𝐋𝐈𝐒𝐓 ❍─╮\n\n✦ 11. 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 💞\n✦ 12. 𝐅𝐮𝐧𝐧𝐲 😂\n✦ 13. 𝐌𝐞𝐦𝐞 🤣\n✦ 14. 𝐓𝐫𝐨𝐥𝐥 😈\n✦ 15. 𝐏𝐫𝐚𝐧𝐤 🎭\n✦ 16. 𝐆𝐚𝐦𝐢𝐧𝐠 🎮\n✦ 17. 𝐏𝐮𝐛𝐠 🔫\n✦ 18. 𝐅𝐫𝐞𝐞𝐟𝐢𝐫𝐞 🔥\n✦ 19. 𝐆𝐚𝐦𝐞𝐫 🕹️\n✦ 20. 𝐀𝐧𝐢𝐦𝐞 🌸\n\n╰──❍ 𝐏𝐚𝐠𝐞 : 2/3 ❍──╯\n💬 Reply number or type '.album 3'`;
    } else {
      listMsg = `╭─❍ 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎 𝐋𝐈𝐒𝐓 ❍─╮\n\n✦ 21. 𝐀𝐧𝐢𝐦𝐞𝐠𝐢𝐫𝐥 👧\n✦ 22. 𝐀𝐧𝐢𝐦𝐞𝐛𝐨𝐲 👦\n✦ 23. 𝐍𝐚𝐭𝐮𝐫𝐞 🌿\n✦ 24. 𝐒𝐮𝐧𝐬𝐞𝐭 🌅\n✦ 25. 𝐑𝐚𝐢𝐧 🌧️\n✦ 26. 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 ✨\n✦ 27. 𝐃𝐉 🎧\n✦ 28. 𝐂𝐚𝐫 🏎️\n✦ 29. 𝐁𝐚𝐧𝐝𝐚𝐫𝐢 🥁\n✦ 30. 𝐏𝐮𝐤𝐞𝐞 🔞\n\n╰──❍ 𝐏𝐚𝐠𝐞 : 3/3 ❍──╯\n💬 Reply number or type '.album 1'`;
    }

    return api.sendMessage(listMsg, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        messageID: info.messageID,
        author: event.senderID
      });
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body, senderID } = event;
    if (senderID !== Reply.author) return;

    const categories = {
      "1": "milon", "2": "sad", "3": "love", "4": "broken", "5": "alone", "6": "romantic",
      "7": "hot", "8": "sex", "9": "couple", "10": "crush", "11": "relationship",
      "12": "funny", "13": "meme", "14": "troll", "15": "prank", "16": "gaming",
      "17": "pubg", "18": "freefire", "19": "gamer", "20": "anime", "21": "animegirl",
      "22": "animeboy", "23": "nature", "24": "sunset", "25": "rain", "26": "aesthetic",
      "27": "dj", "28": "car", "29": "bandari", "30": "pukee"
    };

    const selected = categories[body];
    if (!selected) return;

    api.unsendMessage(Reply.messageID);
    api.sendMessage(`⏳ | Loading '${selected.toUpperCase()}' video for you, Siyam Hasan...`, threadID, messageID);

    try {
      const pathData = path.join(process.cwd(), "scripts", "cmds", "album_data.json");
      let videoUrl = "";

      if (fs.existsSync(pathData)) {
        const localData = fs.readJsonSync(pathData);
        if (localData[selected] && localData[selected].length > 0) {
          videoUrl = localData[selected][Math.floor(Math.random() * localData[selected].length)];
        }
      }

      if (!videoUrl) {
        const res = await axios.get(`https://raw.githubusercontent.com/Milon-Hasan/API-STORE/main/albums/${selected}.json`);
        videoUrl = res.data[Math.floor(Math.random() * res.data.length)];
      }

      const cachePath = path.join(__dirname, "cache", `vid_${Date.now()}.mp4`);
      const vidRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(cachePath, Buffer.from(vidRes.data, "utf-8"));

      return api.sendMessage({
        body: `✨ 𝐀𝐋𝐁𝐔𝐌 𝐕𝐈𝐃𝐄𝐎 🌸\n\n📁 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 : ${selected.toUpperCase()} 🐼\n\n🐸 𝐄𝐧𝐣𝐨𝐲 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 🖤`,
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => fs.unlinkSync(cachePath), messageID);
    } catch (e) {
      return api.sendMessage("❌ | Error: Video link expired or API down!", threadID, messageID);
    }
  }
};
