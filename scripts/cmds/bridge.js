const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];
const groupCache = {}; 

module.exports = {
config: {
name: "bridge",
aliases: ["br"],
version: "15.0.0",
author: "Milon",
countDown: 2,
role: 0, // 0 মানে এখন সব ইউজার ব্যবহার করতে পারবে
shortDescription: "Bridge for all users with Expanded Group List",
category: "Communication",
guide: { en: "{pn} [Serial/TID] [Message] | {pn} list" }
},

onStart: async function ({ api, event, args, usersData, commandName }) {
const { threadID, messageID, senderID, attachments } = event;

// 1. Expanded List Option
if (args[0] === "list") {
try {
const list = await api.getThreadList(100, null, ["INBOX"]);
let msg = "┏━━━━━━❰ 🏢 GROUP LIST ❱━━━━━━┓\n\n";
let count = 1;
groupCache[threadID] = {}; 

list.forEach(item => {
if (item.isGroup && item.threadID !== threadID) { 
msg += `${count}. 🏷️ ${item.name || "Unnamed Group"}\n🆔 ${item.threadID}\n\n`;
groupCache[threadID][count] = item.threadID; 
count++;
}
});

if (count === 1) return api.sendMessage("❌ No other groups found!", threadID, messageID);

msg += "┗━━━━━━━━━━━━━━━━━━━━━━┛\n💡 Usage: .bridge [Number] [Message]";
return api.sendMessage(msg, threadID, messageID);
} catch (err) {
return api.sendMessage("❌ Error: Could not fetch the group list.", threadID, messageID);
}
}

// 2. Send Bridge Message
let targetTID = args[0];
const content = args.slice(1).join(" ");

if (!targetTID || !content) {
return api.sendMessage("⚠️ Please provide a Serial Number or TID and a message.\nExample: .bridge 3 Hello", threadID, messageID);
}

// Serial Check
if (!isNaN(targetTID) && targetTID.length <= 3) {
if (groupCache[threadID] && groupCache[threadID][targetTID]) {
targetTID = groupCache[threadID][targetTID];
} else {
return api.sendMessage("❌ Serial number not found. Please run '.bridge list' first.", threadID, messageID);
}
}

const senderName = await usersData.getName(senderID);

const formMessage = {
body: `🔗 Milon connected group admin\n━━━━━━━━━━━━━━━━━━\n👤 From: ${senderName}\n💬 Message: ${content}\n━━━━━━━━━━━━━━━━━━\n(Reply to this message to send back!)`,
attachment: await getStreamsFromAttachment(
[...attachments, ...(event.messageReply?.attachments || [])]
.filter(item => mediaTypes.includes(item.type))
)
};

try {
api.sendMessage(formMessage, targetTID, (err, info) => {
if (err) return;
global.GoatBot.onReply.set(info.messageID, {
commandName,
targetMessageID: info.messageID,
backToTID: threadID,
backToMID: messageID
});
});
return api.sendMessage(`✅ Message sent successfully!`, threadID, messageID);
} catch (err) {
return api.sendMessage("❌ Error: Failed to send the message.", threadID, messageID);
}
},

onReply: async ({ api, event, Reply, usersData, commandName }) => {
const { threadID, messageID, senderID, body, attachments, messageReply } = event;
const senderName = await usersData.getName(senderID);

const sendToTID = (threadID == Reply.backToTID) ? (messageReply ? messageReply.threadID : Reply.targetMessageID) : Reply.backToTID;
const replyToMID = (threadID == Reply.backToTID) ? Reply.targetMessageID : Reply.backToMID;

const formMessage = {
body: `📩 Bridge Reply from ${senderName}:\n━━━━━━━━━━━━━━━━━━\n${body || "Sent an attachment"}\n━━━━━━━━━━━━━━━━━━\n(Reply to continue)`,
attachment: await getStreamsFromAttachment(
attachments.filter(item => mediaTypes.includes(item.type))
)
};

try {
api.sendMessage(formMessage, sendToTID, (err, info) => {
if (err) return;
global.GoatBot.onReply.set(info.messageID, {
commandName,
targetMessageID: info.messageID,
backToTID: threadID,
backToMID: messageID
});
}, replyToMID);
api.setMessageReaction("✅", messageID, () => {}, true);
} catch (e) {
console.error(e);
}
}
};
