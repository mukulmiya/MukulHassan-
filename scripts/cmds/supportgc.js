module.exports = {
  config: {
    name: "supportgc",
    version: "1.1",
    author: "Shikaki",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Join the support group chat"
    },
    longDescription: {
      en: "Join the official support group chat"
    },
    category: "General",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, threadsData, getLang, message }) {
    const supportGroupThreadID = "1828641441096287"; // Replace with your support group thread ID
    const botID = api.getCurrentUserID();

    try {
      const { members } = await threadsData.get(supportGroupThreadID);

      // Check if the user is already a member of the support group
      const senderName = event.senderName || (await api.getUserInfo(event.senderID))[event.senderID].name;
      const userAlreadyInGroup = members.some(
        member => member.userID === event.senderID && member.inGroup
      );

      if (userAlreadyInGroup) {
        // Reply with a message indicating that the user is already in the group
        const alreadyInGroupMessage = `
🚫 আপনি ইতিমধ্যেই SupportGc গ্রুপের সদস্য🚫
------------------------
        `;
        return message.reply(alreadyInGroupMessage);
      }

      // Add the user to the support group
      await api.addUserToGroup(event.senderID, supportGroupThreadID);

      // Reply with a message indicating successful addition
      const successMessage = `
🎉 আপনাকে সফলভাবে SupportGc তে যুক্ত করা হয়েছে 🎉
------------------------
      `;
      return message.reply(successMessage);
    } catch (error) {
      // Handle any errors that occur during the process

      // Reply with a message indicating the failure
      const senderName = event.senderName || (await api.getUserInfo(event.senderID))[event.senderID].name;
      const failedMessage = `
❌ আপনাকে SopportGc তে এড করতে ব্যর্থ হয়েছি😞।আপনি আমায় ফ্রেন্ড রিকোয়েস্ট পাঠান অথবা আপনার প্রোফাইল আনলক করুন এবং আবার চেষ্টা করুন ❌
------------------------
      `;
      console.error("Error adding user to support group:", error);
      return message.reply(failedMessage);
    }
  }
};
