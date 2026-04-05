const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
config: {
name: "uid",
version: "35.0.0",
author: "Siyam Hasan",
countDown: 1,
role: 0,
category: "utility",
description: "Fixed Profile Picture UID Card",
guide: "{pn} or {pn} @mention or reply"
},

onStart: async function ({ api, event }) {
const { threadID, messageID, senderID, mentions, messageReply } = event;

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

let targetID = senderID;

if (Object.keys(mentions).length > 0) {
targetID = Object.keys(mentions)[0];
} else if (messageReply) {
targetID = messageReply.senderID;
}

const timeID = Date.now();
const imgPath = path.join(cacheDir, `uid_${targetID}_${timeID}.png`);

try {
// 🔹 ইউজার ইনফো ফেচ করা
const userInfo = await api.getUserInfo(targetID);
const userName = userInfo[targetID]?.name || "Facebook User";

// 🔥 প্রোফাইল পিকচারের স্ট্যাটিক লিঙ্ক
const realAvatar = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

const text1 = encodeURIComponent(`USER: ${userName}`);
const text2 = encodeURIComponent(`UID: ${targetID}`);
const text3 = encodeURIComponent(`AUTHOR: SIYAM HASAN`);

// 🔥 Popcat Card API
const cardApi = `https://api.popcat.xyz/welcomecard?background=${encodeURIComponent(realAvatar)}&text1=${text1}&text2=${text2}&text3=${text3}&avatar=${encodeURIComponent(realAvatar)}&color=800080`;

const response = await axios({
method: "GET",
url: cardApi,
responseType: "arraybuffer",
timeout: 20000
});

fs.writeFileSync(imgPath, Buffer.from(response.data));

return api.sendMessage({
body: `${targetID}`,
attachment: fs.createReadStream(imgPath)
}, threadID, () => {
setTimeout(() => {
if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
}, 5000);
}, messageID);

} catch (error) {
console.log("UID ERROR:", error);
return api.sendMessage(`UID: ${targetID}`, threadID, messageID);
}
}
};
