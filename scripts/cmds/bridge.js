const { getStreamsFromAttachment } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "bridge",
    aliases: ["br"],
    version: "24.0.0",
    author: "Milon Hasan",
    countDown: 1,
    role: 0,
    shortDescription: "Perfect Bridge with GCInfo Participant Logic",
    category: "Communication",
    guide: { en: "{pn} list | Reply with [Number] [Message]" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    const botID = api.getCurrentUserID();

    if (args[0] === "list") {
      try {
        // Fetching thread list from inbox
        const list = await api.getThreadList(200, null, ["INBOX"]);
        let msg = "┏━━━━━━❰ 🏢 ACTIVE GROUPS ❱━━━━━━┓\n\n";
        let count = 1;
        const groupData = [];

        for (const item of list) {
          // --- Logic from gcinfo file ---
          // 1. Must be a group
          // 2. Must not be the group where the command is used
          // 3. Bot MUST be a participant (Checks if Bot ID is in the list)
          if (item.isGroup && item.threadID !== threadID && item.participantIDs.includes(botID)) {
            msg += `${count}. 🏷️ ${item.name || "Unnamed Group"}\n\n`;
            groupData.push({
              index: count,
              threadID: item.threadID
            });
            count++;
          }
        }

        if (count === 1) return message.reply("❌ No active groups found where the bot is a member.");

        msg += "┗━━━━━━━━━━━━━━━━━━━━━━┛\n💡 Reply with '[Number] [Message]' to connect.";
        
        return message.reply(msg, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "listReply",
            groupData: groupData,
            messageID: info.messageID
          });
        });
      } catch (err) {
        return message.reply("❌ Error: Failed to load group list.");
      }
    }
    
    return message.reply("⚠️ Use '.bridge list' to see active groups.");
  },

/* --- [ 🔐 INTERNAL_SECURE_METADATA ] ---
 * 🤖 BOT NAME: MILON BOT
 * 👤 OWNER: MILON HASAN
 * 🔗 FACEBOOK: https://www.facebook.com/share/17uGq8qVZ9/
 * 📞 WHATSAPP: +880 1912603270
 * 📍 LOCATION: NARAYANGANJ, BD
 * --------------------------------------- */

  onReply: async function ({ api, event, Reply, usersData, message }) {
    const { threadID, messageID, senderID, body, attachments } = event;
    const senderName = await usersData.getName(senderID);

    if (Reply.type === "listReply") {
      const input = body.split(" ");
      const serial = parseInt(input[0]);
      const content = input.slice(1).join(" ");

      const targetGroup = Reply.groupData.find(g => g.index === serial);
      if (!targetGroup) return; 

      if (!content) return message.reply("⚠️ Please enter a message after the number.");

      const formMessage = {
        body: `🔗 Milon connected group admin\n━━━━━━━━━━━━━━━━━━\n👤 From: ${senderName}\n💬 Message: ${content}\n━━━━━━━━━━━━━━━━━━\n(Reply to this message to send back!)`,
        attachment: await getStreamsFromAttachment(attachments.filter(item => mediaTypes.includes(item.type)))
      };

      return api.sendMessage(formMessage, targetGroup.threadID, (err, info) => {
        if (err) return message.reply("❌ Error: Message failed. Bot might not be in this group.");
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "bridgeChat",
          targetMessageID: info.messageID,
          backToTID: threadID,
          backToMID: messageID
        });
        message.reply(`✅ Connected to group #${serial}`);
      });
    }

    if (Reply.type === "bridgeChat") {
      const sendToTID = (threadID == Reply.backToTID) ? Reply.targetMessageID : Reply.backToTID;
      const replyToMID = (threadID == Reply.backToTID) ? Reply.targetMessageID : Reply.backToMID;

      const formMessage = {
        body: `📩 Bridge Reply from ${senderName}:\n━━━━━━━━━━━━━━━━━━\n${body || "Sent an attachment"}\n━━━━━━━━━━━━━━━━━━\n(Reply to continue)`,
        attachment: await getStreamsFromAttachment(attachments.filter(item => mediaTypes.includes(item.type)))
      };

      try {
        api.sendMessage(formMessage, sendToTID, (err, info) => {
          if (err) return;
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "bridgeChat",
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
  }
};
