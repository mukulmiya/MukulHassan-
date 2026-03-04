const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
config: {
name: "owner",
version: "16.3.0",
author: "Milon",
countDown: 5,
role: 0,
category: "info",
description: "Generates a premium owner information card with internal data",
guide: "{p}owner"
},

// --- [ 🔐 INTERNAL DATA BLOCK ] ---
// 🤖 Bot: MILON BOT | 👤 Owner: MILON HASAN
// 🔗 FB: https://www.facebook.com/share/17uGq8qVZ9/
// 📞 WA: +880 1912603270 | 📍 Loc: NARAYANGANJ
// ----------------------------------

onStart: async function ({ api, event, threadsData }) {
const { threadID, messageID } = event;

let Canvas;
try {
Canvas = require("canvas");
} catch (e) {
return api.sendMessage("❌ 'canvas' library error. Please install it.", threadID, messageID);
}

const { createCanvas, loadImage } = Canvas;

// --- 1. Data Collection ---
const globalPrefix = global.GoatBot.config.prefix;
const threadPrefix = await threadsData.get(threadID, "data.prefix") || globalPrefix;

const uptime = process.uptime();
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const uptimeString = `${hours}h ${minutes}m`;

const totalCommands = global.GoatBot.commands.size;

const cardUrl = "https://i.imgur.com/5oG0Ohe.jpeg"; 
const avatarUrl = "https://i.imgur.com/3ROoie7.jpeg"; 

try {
api.sendMessage("⏳ Generating Premium Owner Card...", threadID, messageID);

async function getImg(url) {
const res = await axios({
url: url,
method: "GET",
responseType: "arraybuffer",
headers: { "User-Agent": "Mozilla/5.0" }
});
return await loadImage(Buffer.from(res.data));
}

const [cardImg, avatarImg] = await Promise.all([
getImg(cardUrl),
getImg(avatarUrl)
]);

const scale = 3; 
const canvas = createCanvas(cardImg.width * scale, cardImg.height * scale);
const ctx = canvas.getContext("2d");

// Background Offset (Shifted Left)
const imageOffset = 20 * scale; 
ctx.drawImage(cardImg, -imageOffset, 0, canvas.width, canvas.height);

const globalLeftShift = 15 * scale; 
const centerX = (canvas.width / 2) - globalLeftShift; 
const centerY = 155 * scale;

// 2. Header Design
ctx.fillStyle = "#FFD700"; 
ctx.textAlign = "center";
ctx.font = `bold ${22 * scale}px Arial`; 
ctx.fillText("[ OWNER & BOT INFO ]", centerX, 75 * scale);

// 3. Avatar Image
const radius = 62 * scale; 
ctx.save();
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
ctx.closePath();
ctx.clip();
ctx.drawImage(avatarImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
ctx.restore();

ctx.strokeStyle = "#FFD700";
ctx.lineWidth = 5 * scale; 
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
ctx.stroke();

// 4. Text & Info Design
ctx.fillStyle = "#FFD700"; 
ctx.shadowBlur = 10;
ctx.shadowColor = "black";
const nameY = centerY + radius + (30 * scale);

ctx.textAlign = "center";
ctx.font = `bold ${26 * scale}px Arial`; 
ctx.fillText("Milon", centerX, nameY); 

const infoX = centerX - (125 * scale); 
ctx.textAlign = "left";
ctx.font = `bold ${16 * scale}px Arial`; 

// Card Content
ctx.fillText(`🤖 Bot Name: [ MILON BOT ]`, infoX, nameY + (25 * scale)); 
ctx.fillText(`⚙️ Prefix: [ ${threadPrefix} ]`, infoX, nameY + (45 * scale)); 
ctx.fillText(`⏳ Uptime: [ ${uptimeString} ]`, infoX, nameY + (65 * scale)); 
ctx.fillText(`📊 Commands: [ ${totalCommands} ]`, infoX, nameY + (85 * scale)); 
ctx.fillText(`👤 Owner: [ Milon Hasan ]`, infoX, nameY + (115 * scale)); 
ctx.fillText(`📅 Age: [ 17+ ]`, infoX, nameY + (135 * scale)); 
ctx.fillText(`📍 Address: [ NARAYANGANJ ]`, infoX, nameY + (155 * scale)); 
ctx.fillText(`📝 Status: [ silence is my attitude ]`, infoX, nameY + (175 * scale)); 
ctx.fillText(`📞 WhatsApp: [ 880 1912603270 ]`, infoX, nameY + (195 * scale)); 

const cacheDir = path.join(__dirname, "cache");
fs.ensureDirSync(cacheDir);
const outputPath = path.join(cacheDir, `owner_milon_eng_final_${Date.now()}.png`);

fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));

// 5. English Caption
const caption = 
"╔══════════════════╗\n" +
" ✨ 𝗕𝗢𝗧 & 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨\n" +
"╚══════════════════╝\n\n" +
"👤 𝗢𝘄𝗻𝗲𝗿: Milon Hasan\n" +
"🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: MILON BOT\n" +
"⚙️ 𝗣𝗿𝗲𝗳𝗶𝘅: [ " + threadPrefix + " ]\n" +
"⏳ 𝗨𝗽𝘁𝗶𝗺𝗲: " + uptimeString + "\n" +
"📊 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: " + totalCommands + "\n" +
"📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +880 1912603270\n" +
"📍 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: Narayanganj, Bangladesh\n" +
"━━━━━━━━━━━━━━━━━━━━\n" +
"✅ 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗖𝗮𝗿𝗱 𝗗𝗲𝗹𝗶𝘃𝗲𝗿𝗲𝗱!\n" +
"━━━━━━━━━━━━━━━━━━━━";

return api.sendMessage({
body: caption,
attachment: fs.createReadStream(outputPath)
}, threadID, () => {
if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
}, messageID);

} catch (error) {
console.error(error);
return api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
}
}
};
