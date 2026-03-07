module.exports = {
  config: {
    name: "antiName",
    version: "12.0.0",
    author: "Milon Hasan",
    category: "events",
    eventType: ["log:thread-name"]
  },

  onStart: async function () {},

  onEvent: async function ({ api, event }) {
    // 1. Check if it's a name change event
    if (event.logMessageType !== "log:thread-name") return;

    const { threadID, author, logMessageData } = event;
    const botID = api.getCurrentUserID();

    // 2. IMPORTANT: Check if Anti-Group is ON
    if (!global.antiGroupSettings || !global.antiGroupSettings[threadID]) return;

    // 3. Bot nije change korle ignore korbe
    if (author == botID) return;

    try {
      // 4. Thread info theke purono nam nibe
      const threadInfo = await api.getThreadInfo(threadID);
      const oldName = logMessageData.oldName || threadInfo.threadName || "Group Name";

      // 5. Action: Restore Name
      await api.setTitle(oldName, threadID);

      // 6. Strike Counter
      if (!global.nameCounter) global.nameCounter = {};
      if (!global.nameCounter[threadID]) global.nameCounter[threadID] = {};

      global.nameCounter[threadID][author] = (global.nameCounter[threadID][author] || 0) + 1;
      const count = global.nameCounter[threadID][author];

      // 7. Response Logic (Notice & Kick)
      if (count >= 3) {
        await api.removeUserFromGroup(author, threadID);
        delete global.nameCounter[threadID][author];
        
        return api.sendMessage(
          `🚨 [ KICKED ]\n━━━━━━━━━━━━━━━━━━\nUser kicked for changing group name 3 times!\nStatus: Name Restored to "${oldName}"`, 
          threadID
        );
      } else {
        return api.sendMessage(
          `⚠️ [ WARNING ]\n━━━━━━━━━━━━━━━━━━\nDon't change group name! (${count}/3)\nRestoring to: "${oldName}"`, 
          threadID
        );
      }

    } catch (err) {
      console.log("AntiName Error:", err);
    }
  }
};
