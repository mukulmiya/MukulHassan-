const axios = require('axios');

const baseApiUrl = "https://noobs-api.top/dipto/baby";

module.exports = {
config: {
name: "bot",
aliases: ["mbot", "milonbot"],
version: "10.0.0",
author: "Milon",
countDown: 0,
role: 0,
description: "High-speed bot with extra dialogues and fixed mentions",
category: "fun",
guide: { en: "{pn} [text]" }
},

onStart: async function ({ api, event, args, usersData }) {
const { threadID, messageID, senderID } = event;

try {
const name = await usersData.getName(senderID);
if (!args[0]) {
return api.sendMessage({
body: `「 ${name} 」\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি?`,
mentions: [{ tag: name, id: senderID }]
}, threadID, messageID);
}

if (args[0] === 'teach') {
const [q, a] = args.slice(1).join(" ").split(/\s*-\s*/);
if (!q || !a) return api.sendMessage("⚠️ Format: teach ask - reply", threadID, messageID);
const { data } = await axios.get(`${baseApiUrl}?teach=${encodeURIComponent(q)}&reply=${encodeURIComponent(a)}&senderID=${senderID}`);
return api.sendMessage(`✅ Added: ${data.message}`, threadID, messageID);
}

const { data } = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(args.join(" "))}&senderID=${senderID}&font=1`);
return api.sendMessage(data.reply, threadID, (err, info) => {
if (global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "bot", messageID: info.messageID, author: senderID });
}, messageID);
} catch { return api.sendMessage("API Busy!", threadID, messageID); }
},

onReply: async ({ api, event }) => {
if (api.getCurrentUserID() == event.senderID) return;
try {
const { data } = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(event.body)}&senderID=${event.senderID}&font=1`);
api.sendMessage(data.reply, event.threadID, (err, info) => {
if (global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "bot", messageID: info.messageID, author: event.senderID });
}, event.messageID);
} catch (err) {}
},

onChat: async ({ api, event, usersData }) => {
const { body, senderID, threadID, messageID } = event;
if (!body) return;
const lowerBody = body.toLowerCase();

if (lowerBody.startsWith("bot") || lowerBody.startsWith("বট")) {
const text = body.replace(/^(bot|বট)\s*/i, "").trim();

if (!text) {
const name = await usersData.getName(senderID);
const randomReplies = [
"𝗵𝗲 𝗯𝗼𝘁 𝗯𝗼𝘁 𝗰𝗵𝗶𝗹𝗹 𝗯𝗿𝗼!", "I love you 💝", "আমি 𓆩সিয়াম𓆪 বস এর সাথে বিজি আছি-😕😏",
"আমার বস 𓆩সিয়াম𓆪 কে একটা জি GF দাও-😽🫶", "জান তোমার নানি রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
"𓆩সিয়াম𓆪 বস'এর হবু বউ রে কেও দেকছো?😪", "জান হাঙ্গা করবা-🙊😝",
"ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤", "তাকাই আছো কেন চুমু দিবা-🙄🐸😘",
"বেশি Bot Bot করলে leave নিবো কিন্তু😒", "তোর বাড়ি কি কিশোরগঞ্জ, পোড়াবাড়িয়া গ্রাম😵‍💫",
"মেয়ে হলে বস 𓆩সিয়াম𓆪 কে 𝐊𝐈𝐒𝐒 দে 😒", "চুমু খাওয়ার বয়স টা চকলেট🍫খেয়ে উড়িয়ে দিলো 𓆩সিয়াম𓆪 বস 🥺🤗",
"আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱", "জান বাল ফালাইবা-🙂🥱🙆‍♂",
"আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "দিনশেষে পরের BOW সুন্দর-☹️🤧",
"সুন্দর মাইয়া মানেই-🥱আমার বস 𓆩সিয়াম𓆪 এর বউ-😽🫶", "হা জানু , এইদিক এ আসো কিস দেই🤭 😘",
"আরে আমি মজা করার mood এ নাই😒", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
"আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস 𓆩সিয়াম𓆪 কে দান করেন-🥱🐰🍒",
"ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧", "অনুমতি দিলে কল দিতাম..!😒",
"জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
"বস 𓆩সিয়াম𓆪 এর সাথে কথা বলবো এখন , ডিস্টার্ব করিস না 😒", "বেশি বেশি বকবক করলে তোকে ব্লক মেরে দেবো কিন্তু-🐸",
"জানু তোমার জন্য আমার মনটা আই ঢাই করে 💖", "ওই যে দেখো 𓆩সিয়াম𓆪 বস যাচ্ছে , এক বালতি প্রেম দিয়ে দাও 🤭"
];
const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];

return api.sendMessage({
body: `「 ${name} 」\n\n${rand}`,
mentions: [{ tag: name, id: senderID }]
}, threadID, (err, info) => {
if (global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "bot", messageID: info.messageID, author: senderID });
}, messageID);
}

try {
const { data } = await axios.get(`${baseApiUrl}?text=${encodeURIComponent(text)}&senderID=${senderID}&font=1`);
api.sendMessage(data.reply, threadID, (err, info) => {
if (global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "bot", messageID: info.messageID, author: senderID });
}, messageID);
} catch (err) {}
}
}
};
